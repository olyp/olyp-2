import Invoices from '../collections/invoices';
import Customers from '../collections/customers';
import Reservations from '../collections/reservations';

import big from 'big.js';
import moment from 'moment-timezone';

function isValidCurrency(text) {
	let isValid = true;
	try {
		big(text)
	} catch (e) {
		isValid = false;
	}

	return isValid;
}

function getRoomReservationTotalMinutes(roomReservation) {
	return moment(roomReservation.to).diff(moment(roomReservation.from), "minutes", true);
}

function roundMinutesDown(minutes, roundBy) {
	if (minutes === 0) {
		return 0
	} else {
		return Math.max(roundBy, minutes - (minutes % roundBy));
	}
}

const big60 = big("60");
const big0 = big("0");
const bigNeg1 = big("-1");

function bigMax(a, b) {
	return a.lt(b) ? b : a;
}

function bigMin(a, b) {
	return a.lt(b) ? a : b;
}

function getInvoiceTotal(invoiceDataForRooms, invoiceLines) {
	const validInvoiceLines = invoiceLines && invoiceLines
			.filter((it) => isValidCurrency(it.sum))
			.map((it) => big(it.sum));

	if ((!invoiceDataForRooms || invoiceDataForRooms.length === 0) && (!validInvoiceLines || validInvoiceLines.length === 0)) {
		return null;
	}

	let total = big0;

	if (validInvoiceLines) {
		total = total.plus(validInvoiceLines.reduce(
			(res, curr) => res.plus(curr),
			big0));
	}

	if (invoiceDataForRooms) {
		total = total.plus(invoiceDataForRooms.reduce(
			(res, curr) => {
				if (curr.includeFreeHours) {
					return res.plus(big(curr.baseSumWithoutTax)).plus(big(curr.freeHoursSumWithoutTax));
				} else {
					return res.plus(big(curr.baseSumWithoutTax));
				}
			},
			big0));
	}

	return total;
}

function getRoomLineForMonth(includeFreeHours, customerId, roomId, roomReservationsInMonth, roomBookingAgreement, monthStr) {
	const month = moment(monthStr, "YYYY-MM");
	const startOfMonth = month.clone().startOf("month");
	const startOfNextMonth = startOfMonth.clone().add(1, "months");

	const invoidedBookingsThisMonth = Reservations.find({
		"booking.isInvoiced": true,
		"booking.customerId": customerId,
		"roomId": roomId,
		"from": {"$gt": startOfMonth.toDate()},
		"to": {"$lt": startOfNextMonth.toDate()}
	}).fetch();

	const totalInvoicedMinutes = invoidedBookingsThisMonth.reduce((res, curr) => res + getRoomReservationTotalMinutes(curr), 0);
	const totalInvoicedMinutesRounded = roundMinutesDown(totalInvoicedMinutes, 30);
	const totalInvoicedHours = big(totalInvoicedMinutesRounded).div(big60);

	const totalMinutes = roomReservationsInMonth.reduce((res, curr) => res + getRoomReservationTotalMinutes(curr), 0);
	const totalMinutesRounded = roundMinutesDown(totalMinutes, 30);
	const totalHours =  big(totalMinutesRounded).div(big60);
	const freeHours = big(roomBookingAgreement.freeHours);
	const availableFreeHours = bigMax(big0, freeHours.minus(big(totalInvoicedHours)));
	const numDiscountedHours = bigMin(availableFreeHours, totalHours);
	const pricePerHour = big(roomBookingAgreement.hourlyPrice);
	const billableHours = includeFreeHours ? bigMax(big0, totalHours.minus(availableFreeHours)) : totalHours;

	const sumWithoutTax = pricePerHour.times(billableHours);
	const baseSumWithoutTax = pricePerHour.times(totalHours);

	return {
		month: monthStr,
		roomId: roomId,
		totalInvoicedHours: totalInvoicedHours.toFixed(2),
		hasFreeHours: !availableFreeHours.eq(big0),
		numDiscountedHours: numDiscountedHours.toFixed(2),
		freeHoursSumWithoutTax: pricePerHour.times(numDiscountedHours).times(bigNeg1).toFixed(5),
		sumWithoutTax: sumWithoutTax.toFixed(5),
		baseSumWithoutTax: baseSumWithoutTax.toFixed(5),
		includeFreeHours: includeFreeHours
	}}

function getRoomLines(includeFreeHours, customerId, roomId, allRoomReservations, roomBookingAgreement) {
	const roomReservationsByMonth = {};
	allRoomReservations.forEach((roomReservation) => {
		const from = moment(roomReservation.from);
		const fromKey = from.format("YYYY-MM");
		roomReservationsByMonth[fromKey] = roomReservationsByMonth[fromKey] || [];
		roomReservationsByMonth[fromKey].push(roomReservation);
	});

	return Object.keys(roomReservationsByMonth).sort().map((monthStr) => {
		return getRoomLineForMonth(includeFreeHours ? includeFreeHours[monthStr] : true, customerId, roomId, roomReservationsByMonth[monthStr], roomBookingAgreement, monthStr);
	});
}


Meteor.methods({
	'invoice.togglePaid': function (invoiceId) {

		const doc = Invoices.findOne({_id: invoiceId}, {fields: {paid: 1}});

		if (!doc.paid) {
			Invoices.update({_id: invoiceId}, {$set: {paid: true}});
		} else {
			Invoices.update({_id: invoiceId}, {$set: {paid: !doc.paid}});
		}
	},

	"invoice.generateData": function (queries) {
		return queries.reduce((res, {customerId, reservationIds, extraLines, includeFreeHours}) => {
			const customer = Customers.findOne({_id: customerId});

			const roomReservations = reservationIds.map((reservationId) =>
				Reservations.findOne({_id: reservationId}));

			const roomReservationsByRoom = {};
			roomReservations.forEach((roomReservation) => {
				const roomId = roomReservation.roomId;
				roomReservationsByRoom[roomId] = roomReservationsByRoom[roomId] || [];
				roomReservationsByRoom[roomId].push(roomReservation);
			});


			let roomBookingLines = [];

			for (const roomId in roomReservationsByRoom) {
				const roomBookingAgreement = customer.roomBookingAgreements.filter(
					(roomBookingAgreement) => roomBookingAgreement.roomId === roomId)[0];
				roomBookingLines = roomBookingLines.concat(getRoomLines(includeFreeHours && includeFreeHours[roomId], customerId, roomId, roomReservationsByRoom[roomId], roomBookingAgreement));
			}

			const invoiceTotal = getInvoiceTotal(roomBookingLines, extraLines);

			if (invoiceTotal !== null) {
				res[customerId] = {lines: roomBookingLines, total: invoiceTotal.toFixed(5)};
			}

			return res;
		}, {});
	}
});