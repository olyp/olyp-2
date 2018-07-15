import { Meteor } from 'meteor/meteor';

import Reservations from '../collections/reservations';
import moment from "moment-timezone";

const fmt = "HH:mm, DD.MM.YYYY";

Meteor.methods({
	"booking.add": function (payload) {

		check(payload, Object);

		const roomId = payload.roomId;
		const userId = Meteor.userId();
		const customerId = payload.customerId;

		// Using start/end instead of from/to since from is reserved
		const start = payload.from;
		const end = payload.to;

		if (start > end) {
			throw new Meteor.Error(666, "From must be before to");
		}

		if (end < start) {
			throw new Meteor.Error(666, "To must be after from");
		}

		// const overlappingReservations = Reservations.find({
		// 	from: {$lt: to}, 
		// 	to: {$gt: from}, 
		// 	roomId: roomId
		// }).fetch();

		const overlappingReservations = Reservations.find({
			from: {$gte: start},
			to: {$lte: end},
			roomId: roomId
		}).fetch();

		if (overlappingReservations.length > 0) {
			const overlappingReservation = overlappingReservations[0];
			const bookingUser = Meteor.users.findOne({'_id': overlappingReservation.booking.userId});
			throw new Meteor.Error(666, `There are overlapping reservations: ${moment(overlappingReservation.from).format(fmt)} - ${moment(overlappingReservation.to).format(fmt)}, ${bookingUser.profile.firstName} ${bookingUser.profile.lastName}`);
		}

		Reservations.insert({
			type: "booking",
			booking: {
				userId: userId,
				customerId: customerId,
				isInvoiced: false
			},
			comment: payload.comment,
			from: start,
			to: end,
			roomId: roomId
		});
	},

	"booking.delete": function (payload) {

		check(payload, Object);

		const reservationId = payload.id;
		Reservations.remove({"_id": reservationId, "booking.userId": Meteor.userId()})
	}
})

