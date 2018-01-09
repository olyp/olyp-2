import React, { Component } from 'react';
import { withTracker } from 'meteor/react-meteor-data'
import moment from 'moment-timezone';
import big from 'big.js';
import _ from 'lodash';
import { Label, Checkbox } from 'react-bootstrap';
import { Link } from 'react-router';

import Reservations from '../../../../api/collections/reservations';
import Customers from '../../../../api/collections/customers';
import Rooms from '../../../../api/collections/rooms';

import Preloader from '../../../shared/preloader/Preloader';

function dateRangeString(from, to) {
	const fromYmd = from.format("DD/MM-YY");
	const toYmd = to.format("DD/MM-YY");

	if (fromYmd === toYmd) {
		return `${fromYmd}, ${from.format("HH:mm")}-${to.format("HH:mm")}`
	} else {
		return `${fromYmd}, ${from.format("HH:mm")} - ${toYmd}, ${to.format("HH:mm")}`
	}
}

function getInvoiceFormForCustomer(customerId, customerForm) {
	const extraLines = customerForm.extraLines;
	const reservations = customerForm.reservations;

	if (!extraLines && !reservations) {
		return null;
	}

	return {
		customerId: customerId,
		reservationIds: reservations ? Object.keys(reservations) : [],
		extraLines: extraLines,
		includeFreeHours: customerForm.includeFreeHours
	};
}

function getQFromInvoiceForm(invoiceForm) {
	const res = [];

	for (const customerId in invoiceForm) {
		const customerForm = invoiceForm[customerId];
		const invoiceFormForCustomer = getInvoiceFormForCustomer(customerId, customerForm);

		if (invoiceFormForCustomer !== null) {
			res.push(invoiceFormForCustomer);
		}
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

const big0 = big("0");

function formatTime(t) {
	const remainder = t.mod(1);
	if (remainder.eq(big0)) {
		return t.toFixed(0);
	} else {
		return t.toFixed(1);
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

	submitInvoice (customerId) {
		this.setState({isSubmitting: true})

		const invoiceForm = getInvoiceFormForCustomer(customerId, this.state.invoiceForm[customerId]);

		Meteor.call("invoice.create", invoiceForm, (err, data) => {
			this.setState({isSubmitting: false});
			if (err) {
				console.error(err);
			} else {
				const newInvoiceForm = Object.assign({}, this.state.invoiceForm);
				delete newInvoiceForm[customerId];

				const newInvoiceDataByCustomerId = Object.assign({}, this.state.invoiceDataByCustomerId);
				delete newInvoiceDataByCustomerId[customerId];

				this.setState({invoiceForm: newInvoiceForm, invoiceDataByCustomerId: newInvoiceDataByCustomerId});
			}
		})
	}

	render () {

		if (this.props.loading) {
			return <Preloader />
		}

		const reservations = this.props.reservations;
		const customers = this.props.customers;
		const rooms = this.props.rooms;

		const reservationsByCustomer = {};

		reservations.forEach((reservation) => {
			const customerId = reservation.booking.customerId;
			reservationsByCustomer[customerId] = reservationsByCustomer[customerId] || [];
			reservationsByCustomer[customerId].push(reservation)
		});

		const customersById = {};
		customers.forEach((customer) => customersById[customer["_id"]] = customer);

		const roomsById = {};
		rooms.forEach((room) => roomsById[room["_id"]] = room);

		if (_.isEmpty(reservationsByCustomer) || _.isEmpty(customersById) || _.isEmpty(roomsById)) {
			return <Preloader />
		}

		return (
			<div>
				{Object.keys(reservationsByCustomer).sort().map((customerId) => {
					const reservations = reservationsByCustomer[customerId]
						.sort((a, b) => a.from.getTime() - b.from.getTime());
					const customer = customersById[customerId];
					const customerForm = this.state.invoiceForm[customerId];
					const extraLines = customerForm && customerForm.extraLines;

					const invoiceData = this.state.invoiceDataByCustomerId[customerId];

					// Filter out customers with no roombooking-agreement
					if (!customer.roomBookingAgreements || customer.roomBookingAgreements.length == 0) {
						return null;
					}

					return <div key={customerId}>
						<h4>{customer && customer.name}</h4>

						<div style={{maxWidth: 288}} className="panel panel-default">
							<div className="panel-body">
								{customer.roomBookingAgreements.map((roomBookingAgreement) => {
									const roomId = roomBookingAgreement.roomId;
									const room = roomsById[roomId];
									return <div key={`customer_${customerId}-agreement-${roomId}`} className='row' >
										<div className='col-xs-4'>{room ? room.name : roomId}</div>
										<div className='col-xs-4'>{big(roomBookingAgreement.hourlyPrice).toFixed(0)}kr/t</div>
										<div className='col-xs-4'>{roomBookingAgreement.freeHours}t inkl</div>
									</div>
								})}
							</div>
						</div>
						<hr />
						{reservations.map((reservation) => {
							const reservationId = reservation._id;
							const formReservations = customerForm && customerForm.reservations;
							const room = roomsById[reservation.roomId];
							const user = Meteor.users.findOne({_id: reservation.booking.userId});
							let userName = (user && user.profile) ? user.profile.firstName + ' ' + user.profile.lastName : null;

							if (userName) {
								userName = userName.substring(0, 15);
							}
							
							return (
								<div key={reservation._id}>
									<div className="row uninvoiced-booking-line">		
										<div className="col-xs-2">
											<Checkbox
												   checked={formReservations ? formReservations.hasOwnProperty(reservationId) : false}
												   onClick={(e) => this.onReservationCheckboxClicked(e.target.checked, customer, reservation)} />
										</div>
										<div className="col-xs-5">
											{reservation.comment}
										</div>
										<div className="col-xs-5 text-right">
											<Link to={`/secure/rooms/${room._id}`}>
												<Label bsStyle="primary">{room && room.name}</Label>
											</Link>
											<br />
											<Link to={`/secure/users/${user._id}`}>
												<Label bsStyle="primary">{userName}</Label>
											</Link>
											<br />
											<Link>
												<Label bsStyle="primary">{moment(reservation.createdAt).format("DD/MM-YY, HH:mm")}</Label>
											</Link>
										</div>
										<div className="col-xs-10 col-xs-offset-2 text-right">
											<Label bsStyle="success">{dateRangeString(moment(reservation.from), moment(reservation.to))}</Label>
										</div>
									</div>

									<hr />
								</div>
							);
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
										Booking, {room.name}, {formatTime(big(invoiceLine.totalHours))} timer, {moment(monthStr, "YYYY-MM").format("MMMM, YYYY")}
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
										Gratis timer ({formatTime(big(invoiceLine.numDiscountedHours))}), {room.name}
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
							<a className="btn btn-primary" disabled={this.state.isSubmitting || !invoiceData} onClick={() => { this.submitInvoice(customerId) }}>
								Opprett faktura for {customer && customer.name}
							</a>
						</p>
					</div>
				})}
			</div>
		);
	}
}

export default withTracker((props) => {
	const allUnInvoicedBookingsHandle = Meteor.subscribe("allUnInvoicedBookings");
	const allCustomersHandle = Meteor.subscribe("allCustomers");
	const allRoomsHandle = Meteor.subscribe("allRooms");
	const allProfilesHandle = Meteor.subscribe("allProfiles");

	const loading = !allUnInvoicedBookingsHandle.ready() && !allCustomersHandle.ready() && !allRoomsHandle.ready();
	
	return {
		loading,
		reservations: Reservations.find().fetch(),
		customers: Customers.find().fetch(),
		rooms: Rooms.find().fetch(),
		profiles: Meteor.users.find().fetch()
	}
})(UninvoicedBookings);