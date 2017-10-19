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

function getQFromInvoiceForm(invoiceForm) {
	const res = [];

	for (const customerId in invoiceForm) {
		const customerForm = invoiceForm[customerId];
		const extraLines = customerForm.extraLines;
		const reservations = customerForm.reservations;

		if (!extraLines && !reservations) {
			continue;
		}

		res.push({
			customerId: customerId,
			reservationIds: reservations ? Object.keys(reservations) : [],
			extraLines: extraLines,
			includeFreeHours: customerForm.includeFreeHours
		});
	}

	return res;
}

function asyncKeepLast(fn, cb) {
	let abortPrev = null;

	return (...args) => {
		abortPrev && abortPrev();

		let isAborted = false;
		let abort = () => isAborted = true;
		abortPrev = abort;

		fn.apply(null, [(...args) => {
			if (!isAborted) {
				cb.apply(null, args);
			}
		}].concat(args));
	}
}

function debounce(f, ms) {
	let timeoutId = null;

	return (...args) => {
		clearTimeout(timeoutId);
		timeoutId = setTimeout(() => {
			timeoutId = null;
			f.apply(null, args);
		}, ms);
	}
}

class UninvoicedBookings extends Component {
	constructor() {
		super();
		this.state = {
			invoiceForm: {},
			invoiceDataByCustomerId: {}
		};

		this.fetchNewInvoiceData = asyncKeepLast(
			(cb, q) => {
				Meteor.call("invoice.generateData", q, cb);
			},
			(error, result) => {
				if (error) {
					console.error("An error ocurred when fetching new invoice data", error);
					this.setState({invoiceDataByCustomerId: {}});
				} else {
					this.setState({invoiceDataByCustomerId: result});
				}
			});

		this.fetchNewInvoiceDataDebounced = debounce(this.fetchNewInvoiceData, 300);
	}

	updateInvoiceForm (newInvoiceForm) {
		this.setState({invoiceForm: newInvoiceForm});
		const q = getQFromInvoiceForm(newInvoiceForm);
		this.fetchNewInvoiceData(q);
	}

	updateInvoiceFormDebounced (newInvoiceForm) {
		this.setState({invoiceForm: newInvoiceForm});
		const q = getQFromInvoiceForm(newInvoiceForm);
		this.fetchNewInvoiceDataDebounced(q);
	}

	onReservationCheckboxClicked (checked, customer, reservation) {
		const customerId = customer["_id"];
		const reservationId = reservation["_id"];

		const newInvoiceForm = Object.assign({}, this.state.invoiceForm);
		newInvoiceForm[customerId] = Object.assign({}, newInvoiceForm[customerId]);
		newInvoiceForm[customerId].reservations = Object.assign({}, newInvoiceForm[customerId].reservations);

		if (checked) {
			newInvoiceForm[customerId].reservations[reservationId] = reservation;
		} else {
			delete newInvoiceForm[customerId].reservations[reservationId];
		}

		this.updateInvoiceForm(newInvoiceForm);
	}

	onRoomInvoiceIncludeFreeHoursChecked (includeFreeHours, customerId, roomId, monthStr) {
		const newInvoiceForm = Object.assign({}, this.state.invoiceForm);
		newInvoiceForm[customerId] = Object.assign({}, newInvoiceForm[customerId]);
		newInvoiceForm[customerId].includeFreeHours = Object.assign({}, newInvoiceForm[customerId].includeFreeHours);
		newInvoiceForm[customerId].includeFreeHours[roomId] = Object.assign({}, newInvoiceForm[customerId].includeFreeHours[roomId]);
		newInvoiceForm[customerId].includeFreeHours[roomId][monthStr] = includeFreeHours

		this.updateInvoiceForm(newInvoiceForm);
	}

	onAddInvoiceLineClicked (customerId) {
		const newInvoiceForm = Object.assign({}, this.state.invoiceForm);
		newInvoiceForm[customerId] = Object.assign({}, newInvoiceForm[customerId]);
		newInvoiceForm[customerId].extraLines = [].concat(newInvoiceForm[customerId].extraLines || []);

		newInvoiceForm[customerId].extraLines.push({
			note: "",
			sum: ""
		});

		this.updateInvoiceForm(newInvoiceForm);
	}

	onExtraLineNoteChange (value, customerId, invoiceLineIdx) {
		const newInvoiceForm = Object.assign({}, this.state.invoiceForm);
		this.setState({invoiceForm: newInvoiceForm});
		newInvoiceForm[customerId] = Object.assign({}, newInvoiceForm[customerId]);
		newInvoiceForm[customerId].extraLines = [].concat(newInvoiceForm[customerId].extraLines || []);
		newInvoiceForm[customerId].extraLines[invoiceLineIdx] = Object.assign({}, newInvoiceForm[customerId].extraLines[invoiceLineIdx]);

		newInvoiceForm[customerId].extraLines[invoiceLineIdx]["note"] = value;

		this.setState({invoiceForm: newInvoiceForm});
	}

	onExtraLinesumChange (value, customerId, invoiceLineIdx) {
		const newInvoiceForm = Object.assign({}, this.state.invoiceForm);
		this.setState({invoiceForm: newInvoiceForm});
		newInvoiceForm[customerId] = Object.assign({}, newInvoiceForm[customerId]);
		newInvoiceForm[customerId].extraLines = [].concat(newInvoiceForm[customerId].extraLines || []);
		newInvoiceForm[customerId].extraLines[invoiceLineIdx] = Object.assign({}, newInvoiceForm[customerId].extraLines[invoiceLineIdx]);

		newInvoiceForm[customerId].extraLines[invoiceLineIdx]["sum"] = value;

		this.updateInvoiceFormDebounced(newInvoiceForm);
	}

	onExtraLineRemoveClicked (customerId, invoiceLineIdx) {
		const newInvoiceForm = Object.assign({}, this.state.invoiceForm);
		this.setState({invoiceForm: newInvoiceForm});
		newInvoiceForm[customerId] = Object.assign({}, newInvoiceForm[customerId]);
		newInvoiceForm[customerId].extraLines = [].concat(newInvoiceForm[customerId].extraLines || []);

		newInvoiceForm[customerId].extraLines.splice(invoiceLineIdx, 1);

		this.updateInvoiceForm(newInvoiceForm);
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
					const extraLines = customerForm && customerForm.extraLines;

					const invoiceData = this.state.invoiceDataByCustomerId[customerId];

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

						{extraLines && extraLines.map((invoiceLine, idx) => {
							return <div key={`invoice_line_${idx}`} className="row">
								<div className="col-xs-1">
									<a className="btn btn-danger btn-xs"
									   onClick={(e) => this.onExtraLineRemoveClicked(customerId, idx)}>Fjern</a>
								</div>
								<div className="col-xs-3">
									<input type="text"
										   value={invoiceLine.note}
										   onChange={(e) => this.onExtraLineNoteChange(e.target.value, customerId, idx)}/>
								</div>

								<div className="col-xs-3">
									<input type="text"
										   value={invoiceLine.sum}
										   onChange={(e) => this.onExtraLinesumChange(e.target.value, customerId, idx)}/>
								</div>
							</div>
						})}

						{invoiceData && invoiceData.lines.map((invoiceLine) => {
							const roomId = invoiceLine.roomId;
							const monthStr = invoiceLine.month;
							const room = roomsById[roomId];

							return <div key={`room_booking_${roomId}_${monthStr}`}>
								<div className="row">
									<div className="col-xs-1">
									</div>
									<div className="col-xs-3">
										Booking, {room.name}, {moment(monthStr, "YYYY-MM").format("MMMM, YYYY")}
									</div>
									<div className="col-xs-3">
										{big(invoiceLine.baseSumWithoutTax).toFixed(2)}
									</div>
								</div>

								{invoiceLine.hasFreeHours && <div className="row">
									<div className="col-xs-1">
										<input type="checkbox"
											   checked={invoiceLine.includeFreeHours}
											   onChange={(e) => this.onRoomInvoiceIncludeFreeHoursChecked(e.target.checked, customerId, roomId, monthStr)} />
									</div>
									<div className="col-xs-3">
										Gratis timer ({big(invoiceLine.numDiscountedHours).toFixed(1)}), {room.name}
									</div>
									<div className="col-xs-3">
										{big(invoiceLine.freeHoursSumWithoutTax).toFixed(2)}
									</div>
								</div>}
							</div>;
						})}

						{invoiceData && <div className="row">
							<div className="col-xs-1">
							</div>
							<div className="col-xs-3">
							</div>
							<div className="col-xs-3">
								Total: {big(invoiceData.total).toFixed(2)}
							</div>
						</div>}

						<p>
							<a className="btn btn-primary" disabled={!invoiceData}>
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