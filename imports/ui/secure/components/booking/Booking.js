import React, {Component} from 'react';
import TrackerReact from 'meteor/ultimatejs:tracker-react';
import moment from "moment-timezone";
import Calendar from "./Calendar"

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

export default class Booking extends TrackerReact(React.Component) {
    constructor() {
        super();
        this.state = {
            subscription: {
                reservations: Meteor.subscribe('reservations'),
                allProfiles: Meteor.subscribe("allProfiles")
            },
            baseDay: getToday()
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
			}));
    }
}