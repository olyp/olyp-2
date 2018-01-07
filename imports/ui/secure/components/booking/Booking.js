import React, {Component} from 'react';
// import TrackerReact from 'meteor/ultimatejs:tracker-react';
import { withTracker } from 'meteor/react-meteor-data';
import moment from "moment-timezone";
import Calendar from "./Calendar";
import BookingForm from "./BookingForm";

import Reservations from '../../../../api/collections/reservations';
import Rooms from '../../../../api/collections/rooms';
import Customers from '../../../../api/collections/customers';

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

class Booking extends Component {
    constructor() {
        super();
        this.state = {
            baseDay: getToday(),
			bookingForm: createBookingForm()
        }
    }

    getReservations() {
        const start = this.state.baseDay;
        const end = start.clone().add(7, "days");
        return Reservations.find({from: {$gt: start.toDate()}, to: {$lt: end.toDate()}}).fetch();
    }

    getRoom() {
    	return Rooms.find({name: {"$regex": "5$"}}).fetch()[0];
	}

	getUserCustomer() {
    	return Customers.find().fetch()[0];
	}

    getProfileNameById(id) {
        const res = Meteor.users.find({"_id": id}).fetch()[0];
        return res && res.profile && `${res.profile.firstName} ${res.profile.lastName}`;
    }

    submitBooking() {
		const payload = {
			bookingForm: this.state.bookingForm,
			roomId: this.getRoom()["_id"],
			customerId: this.getUserCustomer()["_id"]
		};
		Meteor.call("booking.add", payload, (err, res) => {

			if (err) {
				console.error(err);
				Bert.alert(err.reason, 'danger', 'growl-bottom-right', 'fa-warning');
				this.setState({bookingForm: Object.assign({}, this.state.bookingForm, {isSubmitting: false})});
			} else {
				Bert.alert('Booking confirmed', 'success', 'growl-bottom-right', 'fa-smile-o');
				this.setState({bookingForm: createBookingForm()})
			}
		});
	}

	deleteReservation(reservationId) {
    	if (confirm("Are you sure you want to delete this booking?")) {
			Meteor.call("booking.delete", {id: reservationId}, (err, res) => {
				if (err) {
					console.error(err);
					Bert.alert(err.reason, 'danger', 'growl-bottom-right', 'fa-warning');
				} else {
					Bert.alert('Booking deleted', 'success', 'growl-bottom-right', 'fa-smile-o');
				}
			});
		}
	}

    render() {
		return (<div>
			<div className='row booking-form-calendar-grid'>
				<div className='booking-form container'>
					<BookingForm
						from={this.state.bookingForm.from}
						to={this.state.bookingForm.to}
						comment={this.state.bookingForm.comment}
						onFromChange={(val) => this.setState({bookingForm: updateBookingFormFrom(this.state.bookingForm, val)})}
						onToChange={(val) => this.setState({bookingForm: updateBookingFormTo(this.state.bookingForm, val)}) }
						onCommentChange={(val) => this.setState({bookingForm: Object.assign({}, this.state.bookingForm, {comment: val})}) }
						onSubmit={() => this.submitBooking() }
						isSubmitting={this.state.bookingForm.isSubmitting}
					 />
				</div>
				<hr className='booking-form-calendar-grid-separator' />
				<div className='calendar-grid container'>
					<Calendar
						baseDay={this.state.baseDay}
						days={getDaysForBaseDay(this.state.baseDay)}
						reservations={this.getReservations()}
						currentUserId={Meteor.userId()}
						getProfileNameById={this.getProfileNameById}
						gotoToday={() => this.setState({baseDay: getToday()})}
						gotoWeek={(step) => this.setState({baseDay: this.state.baseDay.clone().add(step * 7, "days").startOf("day")})}
						deleteReservation={(reservationId) => this.deleteReservation(reservationId)}
					/>
				</div>
			</div>
		</div>);
    }
}

export default withTracker (() => {
		Meteor.subscribe('reservations');
		Meteor.subscribe("allProfiles");
		Meteor.subscribe("allRooms");
		Meteor.subscribe("userCustomers");

		return {
			reservations: Reservations.find().fetch(),
			allProfiles: Meteor.users.find().fetch(),
			allRooms: Rooms.find().fetch(),
			userCustomers: Customers.find().fetch()
		}

})(Booking);