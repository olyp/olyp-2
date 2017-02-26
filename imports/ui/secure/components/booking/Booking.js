import React, {Component} from 'react';
import TrackerReact from 'meteor/ultimatejs:tracker-react';
import moment from "moment-timezone";
import Calendar from "./Calendar"
import BookingForm from "./BookingForm"

import Reservations from '../../../../api/collections/reservations.js';

function getDaysForBaseDay(baseDay) {
    return [
        baseDay.clone().valueOf(),
        baseDay.clone().day(2).valueOf(),
        baseDay.clone().day(3).valueOf(),
        baseDay.clone().day(4).valueOf(),
        baseDay.clone().day(5).valueOf(),
        baseDay.clone().day(6).valueOf(),
        baseDay.clone().day(7).valueOf()];
}

function getToday() {
    return moment().tz("Europe/Oslo").isoWeekday(1).startOf("day");
}

function createBookingForm() {
	return {
		from: moment().startOf("day").hour(14).valueOf(),
		to: moment().startOf("day").hour(15).valueOf(),
		comment: "",
		isSubmitting: false
	};
}

function updateBookingFormFrom(bookingForm, fromVal) {
	let toVal = bookingForm.to;
	const newMinToVal = moment(fromVal).add(30, "minutes").valueOf();
	if (toVal < newMinToVal) {
		toVal = newMinToVal;
	}

	return {from: fromVal, to: toVal};
}

function updateBookingFormTo(bookingForm, toVal) {
	let fromVal = bookingForm.from;
	const newMaxFromVal = moment(toVal).subtract(30, "minutes").valueOf();
	if (fromVal > newMaxFromVal) {
		fromVal = newMaxFromVal;
	}

	return {from: fromVal, to: toVal};
}

export default class Booking extends TrackerReact(React.Component) {
    constructor() {
        super();
        this.state = {
            subscription: {
                reservations: Meteor.subscribe('reservations'),
                allProfiles: Meteor.subscribe("allProfiles")
            },
            baseDay: getToday(),
			bookingForm: createBookingForm()
        }
    }

    componentWillUnmount() {
        this.state.subscription.reservations.stop();
        this.state.subscription.allProfiles.stop();

    }

    getReservations() {
        const start = this.state.baseDay;
        const end = start.clone().add(7, "days");
        return Reservations.find({from: {$gt: start.toDate()}, to: {$lt: end.toDate()}}).fetch();
    }

    getProfileNameById(id) {
        const res = Meteor.users.find({"_id": id}).fetch()[0];
        return res && res.profile && `${res.profile.firstName} ${res.profile.lastName}`;
    }

    render() {
        return React.DOM.div(null,
			React.DOM.div({className: "row booking-form-calendar-grid"},
				React.DOM.div({className: "booking-form"},
					React.createElement(BookingForm, {
						from: this.state.bookingForm.from,
						to: this.state.bookingForm.to,
						comment: this.state.bookingForm.comment,
						onFromChange: function (val) { this.setState({bookingForm: updateBookingFormFrom(this.state.bookingForm, val)}); }.bind(this),
						onToChange: function (val) { this.setState({bookingForm: updateBookingFormTo(this.state.bookingForm, val)})}.bind(this),
						onCommentChange: function (val) { this.setState({bookingForm: Object.assign({}, this.state.bookingForm, {comment: val})}) }.bind(this),
						onSubmit: function () {
							this.setState({bookingForm: Object.assign({}, this.state.bookingForm, {isSubmitting: true})});
							// TODO: Perform booking
						}.bind(this),
						isSubmitting: this.state.bookingForm.isSubmitting
					})),
				React.DOM.hr({className: "booking-form-calendar-grid-separator"}),
				React.DOM.div({className: "calendar-grid"},
					React.createElement(Calendar, {
						baseDay: this.state.baseDay,
						days: getDaysForBaseDay(this.state.baseDay),
						reservations: this.getReservations(),
						currentUserId: Meteor.userId(),
						getProfileNameById: this.getProfileNameById,
						gotoToday: function () {
							this.setState({baseDay: getToday()})
						}.bind(this),
						gotoWeek: function (step) {
							this.setState({baseDay: this.state.baseDay.clone().add(step * 7, "days").startOf("day")})
						}.bind(this),
						deleteReservation (reservationId) {

						}
					}))));
    }
}