import Invoices from '../collections/invoices';
import Customers from '../collections/customers';
import Reservations from '../collections/reservations';
import Rooms from '../collections/rooms';

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

function formatTime(t) {
	const remainder = t.mod(1);
	if (remainder.eq(big0)) {
		return t.toFixed(0);
	} else {
		return t.toFixed(1);
	}
}

const taxFactor = big("1.25");
function getSumWithTax(num, hasTax) {
	if (hasTax) {
		return num.times(taxFactor);
	} else {
		return num;
	}
}

function getInvoiceTotal(invoiceDataForRooms, invoiceLines) {
	const validInvoiceLines = invoiceLines && invoiceLines
			.filter((it) => isValidCurrency(it.sum))
			.map((it) => big(it.sum));

	if ((!invoiceDataForRooms || invoiceDataForRooms.length === 0) && (!validInvoiceLines || validInvoiceLines.length === 0)) {
		return null;
	}

	let withoutTax = big0;
	let withTax = big0;

	if (validInvoiceLines) {
		withoutTax = withoutTax.plus(validInvoiceLines.reduce(
			(res, curr) => res.plus(curr),
			big0));

		withTax = getSumWithTax(withoutTax, true);
	}

	if (invoiceDataForRooms) {
		withoutTax = withoutTax.plus(invoiceDataForRooms.reduce(
			(res, curr) => {
				if (curr.includeFreeHours) {
					return res.plus(big(curr.sumWithoutTax));
				} else {
					return res.plus(big(curr.baseSumWithoutTax));
				}
			},
			big0));

		withTax = withTax.plus(invoiceDataForRooms.reduce(
			(res, curr) => {
				if (curr.includeFreeHours) {
					return getSumWithTax(res.plus(big(curr.sumWithoutTax)), curr.tax);
				} else {
					return getSumWithTax(res.plus(big(curr.baseSumWithoutTax)), curr.tax);
				}
			},
			big0));
	}

	return {withoutTax: withoutTax, withTax: withTax};
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

	const freeHoursSumWithoutTax = pricePerHour.times(numDiscountedHours).times(bigNeg1).toFixed(5);

	return {
		month: monthStr,
		roomId: roomId,
		totalMinutes: totalMinutes.toFixed(2),
		totalMinutesRounded: totalMinutesRounded.toFixed(2),
		totalHours: totalHours.toFixed(2),
		totalInvoicedHours: totalInvoicedHours.toFixed(2),
		hasFreeHours: !availableFreeHours.eq(big0),
		numDiscountedHours: numDiscountedHours.toFixed(2),
		freeHoursSumWithoutTax: freeHoursSumWithoutTax,
		freeHoursSumWithTax: freeHoursSumWithoutTax,
		sumWithoutTax: sumWithoutTax.toFixed(5),
		baseSumWithoutTax: baseSumWithoutTax.toFixed(5),
		baseSumWithTax: getSumWithTax(baseSumWithoutTax, roomBookingAgreement.tax).toFixed(5),
		includeFreeHours: includeFreeHours,
		roomReservationIds: roomReservationsInMonth.map((it) => it["_id"] )
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

function getInvoiceDataFromQuery({customerId, reservationIds, extraLines, includeFreeHours}) {
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
		return {lines: roomBookingLines, total: invoiceTotal.withoutTax.toFixed(5), totalWithTax: invoiceTotal.withTax.toFixed(5)};
	}
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

	'invoice.delete': function (invoiceId) {
		const invoice = Invoices.findOne({_id: invoiceId});

		if (invoice.paid) {
			throw new Error("Cannot delete paid invoice");
		}

		const roomReservationIds = invoice.hourlyBookingLines.reduce((res, curr) => {
			return res.concat(curr.roomReservationIds);
		}, []);

		Invoices.remove({_id: invoiceId});
		Reservations.update({"_id": {"$in": roomReservationIds}}, {"$set": {"booking.isInvoiced": false}}, {multi: true});
	},

	"invoice.generateData": function (queries) {
		return queries.reduce((res, query) => {
			const customerId = query.customerId;
			const invoiceData = getInvoiceDataFromQuery(query);
			if (invoiceData) {
				res[customerId] = invoiceData;
			}

			return res;
		}, {});
	},

	"invoice.create": function (query) {
		const {customerId, extraLines} = query;

		const invoiceData = getInvoiceDataFromQuery(query);
		if (invoiceData) {
			const customer = Customers.findOne({"_id": customerId});

			const hourlyBookingLines = invoiceData.lines.map((line) => {
				const room = Rooms.findOne({"_id": line.roomId});

				const roomBookingAgreement = customer.roomBookingAgreements.filter((it) => it.roomId === line.roomId)[0];
				if (!roomBookingAgreement) {
					throw new Error(`Unable to find room booking agreement for room ${line.roomId}, customer ${customerId}`)
				}

				const lines = [];

				lines.push({
					lineInfo: {
						type: "roomBooking",
						roomId: line.roomId,
						totalMinutes: line.totalMinutes,
						totalMinutesRounded: line.totalMinutesRounded
					},
					tax: roomBookingAgreement.tax,
					note: `Booking, ${room.name}, ${formatTime(big(line.totalHours))} timer, ${moment(line.month, "YYYY-MM").format("MMMM, YYYY")}`,
					sumWithoutTax: line.baseSumWithoutTax,
					sumWithTax: line.baseSumWithTax
				});

				if (line.hasFreeHours) {
					lines.push({
						lineInfo: {
							type: "roomBookingRebate",
							roomId: line.roomId,
							discountedHours: line.numDiscountedHours
						},
						tax: roomBookingAgreement.tax,
						note: `Gratis timer (${formatTime(big(line.numDiscountedHours))}), ${room.name}`,
						sumWithoutTax: line.freeHoursSumWithoutTax,
						sumWithTax: line.freeHoursSumWithTax
					});
				}

				return {
					roomId: line.roomId,
					roomReservationIds: line.roomReservationIds,
					roomBookingAgreementId: roomBookingAgreement["_id"],
					hourlyPrice: roomBookingAgreement["hourlyPrice"],
					tax: roomBookingAgreement["tax"],
					freeHours: roomBookingAgreement["freeHours"],
					lines: lines
				}
			});

			const otherLines = (extraLines || []).map((extraLine) => {
				return {
					tax: true,
					note: extraLine.note,
					sumWithoutTax: extraLine.sum,
					sumWithTax: getSumWithTax(big(extraLine.sum), true).toFixed(5)
				}
			});

			Invoices.insert({
				createdAt: new Date(),
				customerId: customerId,
				hourlyBookingLines: hourlyBookingLines,
				otherLines: otherLines,
				sumWithoutTax: invoiceData.total,
				sumWithTax: invoiceData.totalWithTax
			});

			const allRoomReservationIds = invoiceData.lines.reduce((res, curr) => res.concat(curr.roomReservationIds), []);
			Reservations.update({"_id": {"$in": allRoomReservationIds}}, {"$set": {"booking.isInvoiced": true}}, {multi: true})

			return {customerId: customerId};
		} else {
			throw new Error("Unable to generate invoice data due to internal error");
		}
	}
});