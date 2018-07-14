import React, { Component } from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import moment from "moment-timezone";

import Calendar from "./Calendar";
import BookingForm from "./BookingForm";
import Preloader from '../../../shared/preloader/Preloader';

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
		baseDay.clone().day(7).valueOf()
	];
}

function getToday() {
	return moment().tz("Europe/Oslo").isoWeekday(1).startOf("day");
}

class Booking extends Component {
	state = {
		baseDay: getToday(),
		currentRoom: Meteor.settings.public.room5Id,
		currentRoomName: Meteor.settings.public.room5Name
	}

	getReservations() {
		const start = this.state.baseDay;
		const end = start.clone().add(7, "days");
		return Reservations.find({from: {$gt: start.toDate()}, to: {$lt: end.toDate()}, roomId: this.state.currentRoom}).fetch();
	}

	getRoomName() {
		const room = Rooms.find({name: {"$regex": "5$"}}).fetch()[0];
		console.log(room);
	}

	getUserCustomer() {
		return Customers.find().fetch()[0];
	}

	getProfileNameById(id) {
		const res = Meteor.users.find({"_id": id}).fetch()[0];
		return res && res.profile && `${res.profile.firstName} ${res.profile.lastName}`;
	}

	submitBooking(payload) {
		Meteor.call('booking.add', payload, (err, res) => {
			if (err) {
				console.error(err);
				Bert.alert(err.reason, 'danger', 'growl-bottom-right', 'fa-warning');
			} else {
				Bert.alert('Booking confirmed', 'success', 'growl-bottom-right', 'fa-smile-o');
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

	changeRoom = (currentRoom) => {
		this.setState({
			currentRoom: currentRoom._id,
			currentRoomName: currentRoom.name
		});
	}

	render() {

		if (this.props.loading) {
			return <Preloader />
		}

		const { currentRoom } = this.state;
		const rooms = this.props.allRooms;

		const roomSelector = 
			(rooms.length < 1) ? 
			<p>You are not allowed to book any rooms</p> :
			<div className="row">
				{rooms.map((room) => {
					const active = (room._id == this.state.currentRoom) ? 'room-selector-active' : '';
					return (
						<div 
							key={room._id}
							className={`room-selector col-xs-4 hover ${active}`}
							onClick={this.changeRoom.bind(this, room)}
						>
							{room.name}
						</div>
					);
				})}
			</div>;
		
		return (
			<div>
				{roomSelector}
				<br />
				<BookingForm onSubmit={(payload) => {this.submitBooking(payload)}} currentRoom={this.state.currentRoom} currentRoomName={this.state.currentRoomName} />
				<div className='row booking-form-calendar-grid'>
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
			</div>
		);
	}
}

export default withTracker (() => {
		const reservationsHandle = Meteor.subscribe('reservations');
		const roomsHandle = Meteor.subscribe("allRooms");

		const loading = !reservationsHandle.ready() && !roomsHandle.ready();

		return {
			loading,
			reservations: Reservations.find().fetch(),
			allRooms: Rooms.find({canBook: {$in: [Meteor.userId()]}}).fetch()
		}
})(Booking);