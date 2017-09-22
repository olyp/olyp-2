import React, { Component } from 'react';
import { createContainer } from 'meteor/react-meteor-data'
import moment from 'moment-timezone';
import big from 'big.js';

import Reservations from '../../../../api/collections/reservations';
import Customers from '../../../../api/collections/customers';
import Rooms from '../../../../api/collections/rooms';

function dateRangeString(from, to) {
	const fromYmd = from.format("YYYY.MM.DD");
	const toYmd = to.format("YYYY.MM.DD");

	if (fromYmd === toYmd) {
		return `${fromYmd}, ${from.format("HH:mm")}-${to.format("HH:mm")}`
	} else {
		return `${fromYmd}, ${from.format("HH:mm")} - ${toYmd}, ${to.format("HH:mm")}`
	}
}

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
	return Math.max(roundBy, minutes - (minutes % roundBy));
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
					return res.plus(curr.baseSumWithoutTax).plus(curr.freeHoursSumWithoutTax);
				} else {
					return res.plus(curr.baseSumWithoutTax);
				}
			},
			big0));
	}

	return total;
}

class UninvoicedBookings extends Component {
	constructor() {
		super();
		this.state = {
			invoiceForm: {}
		};
	}

	onReservationCheckboxClicked (checked, customer, reservation) {
		const customerId = customer["_id"];
		const reservationId = reservation["_id"];
		const roomId = reservation.roomId;

		const newInvoiceForm = Object.assign({}, this.state.invoiceForm);
		newInvoiceForm[customerId] = Object.assign({}, newInvoiceForm[customerId]);
		newInvoiceForm[customerId].reservations = Object.assign({}, newInvoiceForm[customerId].reservations);
		newInvoiceForm[customerId].invoiceForRoom = Object.assign({}, newInvoiceForm[customerId].invoiceForRoom);

		if (checked) {
			newInvoiceForm[customerId].reservations[reservationId] = reservation;
		} else {
			delete newInvoiceForm[customerId].reservations[reservationId];
		}

		if (Object.keys(newInvoiceForm[customerId].reservations).length === 0) {
			delete newInvoiceForm[customerId].invoiceForRoom[roomId];
		} else {
			const roomBookingAgreement = customer.roomBookingAgreements.filter(
				(roomBookingAgreement) => roomBookingAgreement.roomId === roomId)[0];

			const roomReservations = Object.keys(newInvoiceForm[customerId].reservations).map((reservationId) =>
				newInvoiceForm[customerId].reservations[reservationId]);

			const totalMinutes = roomReservations.reduce((res, curr) => res + getRoomReservationTotalMinutes(curr), 0);
			const totalMinutesRounded = roundMinutesDown(totalMinutes, 30);
			const totalHours =  big(totalMinutesRounded).div(big60);
			const freeHours = big(roomBookingAgreement.freeHours);
			const numDiscountedHours = bigMin(freeHours, totalHours);
			const pricePerHour = big(roomBookingAgreement.hourlyPrice);
			const billableHours = bigMax(big0, totalHours.minus(freeHours));

			const sumWithoutTax = pricePerHour.times(billableHours);
			const baseSumWithoutTax = pricePerHour.times(totalHours);

			newInvoiceForm[customerId].invoiceForRoom[roomId] = Object.assign(
				{
					includeFreeHours: true,
					roomId: roomId
				},
				newInvoiceForm[customerId].invoiceForRoom[roomId],
				{
					hasFreeHours: !freeHours.eq(big0),
					numDiscountedHours: numDiscountedHours,
					freeHoursSumWithoutTax: pricePerHour.times(numDiscountedHours).times(bigNeg1),
					sumWithoutTax: sumWithoutTax,
					baseSumWithoutTax: baseSumWithoutTax
				});
		}

		this.setState({invoiceForm: newInvoiceForm});
	}

	onRoomInvoiceIncludeFreeHoursChecked (includeFreeHours, customerId, roomId) {
		const newInvoiceForm = Object.assign({}, this.state.invoiceForm);
		newInvoiceForm[customerId] = Object.assign({}, newInvoiceForm[customerId]);
		newInvoiceForm[customerId].invoiceForRoom = Object.assign({}, newInvoiceForm[customerId].invoiceForRoom);

		newInvoiceForm[customerId].invoiceForRoom[roomId].includeFreeHours = includeFreeHours;

		this.setState({invoiceForm: newInvoiceForm});
	}


	onAddInvoiceLineClicked (customerId) {
		const newInvoiceForm = Object.assign({}, this.state.invoiceForm);
		newInvoiceForm[customerId] = Object.assign({}, newInvoiceForm[customerId]);
		newInvoiceForm[customerId].invoiceLines = [].concat(newInvoiceForm[customerId].invoiceLines || []);

		newInvoiceForm[customerId].invoiceLines.push({
			note: "",
			sum: ""
		});

		this.setState({invoiceForm: newInvoiceForm});
	}

	onInvoiceLineNoteChange (value, customerId, invoiceLineIdx) {
		const newInvoiceForm = Object.assign({}, this.state.invoiceForm);
		this.setState({invoiceForm: newInvoiceForm});
		newInvoiceForm[customerId] = Object.assign({}, newInvoiceForm[customerId]);
		newInvoiceForm[customerId].invoiceLines = [].concat(newInvoiceForm[customerId].invoiceLines || []);
		newInvoiceForm[customerId].invoiceLines[invoiceLineIdx] = Object.assign({}, newInvoiceForm[customerId].invoiceLines[invoiceLineIdx]);

		newInvoiceForm[customerId].invoiceLines[invoiceLineIdx]["note"] = value;

		this.setState({invoiceForm: newInvoiceForm});
	}

	onInvoiceLineSumChange (value, customerId, invoiceLineIdx) {
		const newInvoiceForm = Object.assign({}, this.state.invoiceForm);
		this.setState({invoiceForm: newInvoiceForm});
		newInvoiceForm[customerId] = Object.assign({}, newInvoiceForm[customerId]);
		newInvoiceForm[customerId].invoiceLines = [].concat(newInvoiceForm[customerId].invoiceLines || []);
		newInvoiceForm[customerId].invoiceLines[invoiceLineIdx] = Object.assign({}, newInvoiceForm[customerId].invoiceLines[invoiceLineIdx]);

		newInvoiceForm[customerId].invoiceLines[invoiceLineIdx]["sum"] = value;

		this.setState({invoiceForm: newInvoiceForm});
	}

	onInvoiceLineRemoveClicked (customerId, invoiceLineIdx) {
		const newInvoiceForm = Object.assign({}, this.state.invoiceForm);
		this.setState({invoiceForm: newInvoiceForm});
		newInvoiceForm[customerId] = Object.assign({}, newInvoiceForm[customerId]);
		newInvoiceForm[customerId].invoiceLines = [].concat(newInvoiceForm[customerId].invoiceLines || []);

		newInvoiceForm[customerId].invoiceLines.splice(invoiceLineIdx, 1);

		this.setState({invoiceForm: newInvoiceForm});
	}

	render () {
		if (!this.props.isReady) {
			return <div>Loading...</div>
		}

		const reservationsByCustomer = {};
		this.props.reservations.forEach((reservation) => {
			const customerId = reservation.booking.customerId;
			reservationsByCustomer[customerId] = reservationsByCustomer[customerId] || [];
			reservationsByCustomer[customerId].push(reservation)
		});

		const customersById = {};
		this.props.customers.forEach((customer) => customersById[customer["_id"]] = customer);

		const roomsById = {};
		this.props.rooms.forEach((room) => roomsById[room["_id"]] = room);

		return (
			<div>
				{Object.keys(reservationsByCustomer).map((customerId) => {
					const reservations = reservationsByCustomer[customerId]
						.sort((a, b) => a.from.getTime() - b.from.getTime());
					const customer = customersById[customerId];
					const customerForm = this.state.invoiceForm[customerId];
					const invoiceDataForRooms = customerForm && customerForm.invoiceForRoom && Object.keys(customerForm.invoiceForRoom).map((roomId) => customerForm.invoiceForRoom[roomId])
					const invoiceLines = customerForm && customerForm.invoiceLines;

					const total = getInvoiceTotal(invoiceDataForRooms, invoiceLines);

					return <div key={customerId}>
						<h2>{customer && customer.name}</h2>
						<div className="row" style={{fontWeight: "bold"}}>
							<div className="col-xs-1">

							</div>
							<div className="col-xs-4">
								Fra/til
							</div>
							<div className="col-xs-3">
								Kommentar
							</div>
							<div className="col-xs-1">
								Rom
							</div>
							<div className="col-xs-3">
								Opprettet
							</div>
						</div>
						{reservations.map((reservation) => {
							const reservationId = reservation._id;
							const formReservations = customerForm && customerForm.reservations;
							const room = roomsById[reservation.roomId];

							return <div key={reservation._id} className="row">
								<div className="col-xs-1">
									<input type="checkbox"
										   checked={formReservations ? formReservations.hasOwnProperty(reservationId) : false}
										   onClick={(e) => this.onReservationCheckboxClicked(e.target.checked, customer, reservation)} />
								</div>
								<div className="col-xs-4">
									{dateRangeString(moment(reservation.from), moment(reservation.to))}
								</div>
								<div className="col-xs-3">
									{reservation.comment}
								</div>
								<div className="col-xs-1">
									{room && room.name}
								</div>
								<div className="col-xs-3">
									{moment(reservation.createdAt).format("YYYY.MM.DD, HH:mm")}
								</div>
							</div>
						})}

						<p><a className="btn btn-default btn-sm" onClick={(e) => this.onAddInvoiceLineClicked(customerId)}>Legg til fakturalinje</a></p>

						{total !== null && <div className="row" style={{fontWeight: "bold"}}>
							<div className="col-xs-1"></div>
							<div className="col-xs-3">Notat</div>
							<div className="col-xs-3">Sum</div>

						</div>}

						{invoiceLines && invoiceLines.map((invoiceLine, idx) => {
							return <div key={`invoice_line_${idx}`} className="row">
								<div className="col-xs-1">
									<a className="btn btn-danger btn-xs"
									   onClick={(e) => this.onInvoiceLineRemoveClicked(customerId, idx)}>Fjern</a>
								</div>
								<div className="col-xs-3">
									<input type="text"
										   value={invoiceLine.note}
										   onChange={(e) => this.onInvoiceLineNoteChange(e.target.value, customerId, idx)}/>
								</div>

								<div className="col-xs-3">
									<input type="text"
										   value={invoiceLine.sum}
										   onChange={(e) => this.onInvoiceLineSumChange(e.target.value, customerId, idx)}/>
								</div>
							</div>
						})}

						{invoiceDataForRooms && invoiceDataForRooms.map((invoiceData) => {
							const {roomId} = invoiceData;
							const room = roomsById[roomId];

							return <div key={`room_invoice_${roomId}`}>
								<div className="row">
									<div className="col-xs-1"></div>
									<div className="col-xs-3">
										Booking, {room.name}
									</div>
									<div className="col-xs-3">
										{invoiceData.baseSumWithoutTax.toFixed(2)}
									</div>
								</div>
								{invoiceData.hasFreeHours && <div className="row">
									<div className="col-xs-1">
										<input type="checkbox"
											   checked={invoiceData.includeFreeHours}
											   onChange={(e) => this.onRoomInvoiceIncludeFreeHoursChecked(e.target.checked, customerId, roomId)}/>
									</div>
									<div className="col-xs-3">
										Gratis timer, {room.name}
									</div>
									<div className="col-xs-3">
										{invoiceData.freeHoursSumWithoutTax.toFixed(2)}
									</div>
								</div>}
							</div>
						})}

						{total !== null && <div className="row">
							<div className="col-xs-1">
							</div>
							<div className="col-xs-3">
							</div>
							<div className="col-xs-3">
								Total: {total.toFixed(2)}
							</div>
						</div>}

						<p>
							<a className="btn btn-primary" disabled={total === null}>
								Opprett faktura for {customer && customer.name}
							</a>
						</p>
					</div>
				})}
			</div>
		);
	}
}

export default createContainer((props) => {
	const allUnInvoicedBookingsHandle = Meteor.subscribe("allUnInvoicedBookings");
	const allCustomersHandle = Meteor.subscribe("allCustomers");
	const allRoomsHandle = Meteor.subscribe("allRooms");
	
	return {
		isReady: allUnInvoicedBookingsHandle.ready() && allCustomersHandle.ready() && allRoomsHandle.ready(),
		reservations: Reservations.find().fetch(),
		customers: Customers.find().fetch(),
		rooms: Rooms.find().fetch()
	}
}, UninvoicedBookings);