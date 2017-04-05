import { Meteor } from 'meteor/meteor';

import Rooms from '../collections/rooms.js';

Meteor.methods({
	'room.toggleUserBookingAccess': function (roomId, userId) {

		const hasAccess = Rooms.findOne({_id: roomId, "canBook": userId});

		if (hasAccess) {
			Rooms.update({_id: roomId}, {$pull: {"canBook": userId}});
		} else {
			Rooms.update({_id: roomId}, {$push: {"canBook": userId}});
		}

	},
	'room.toggleUserAccess': function (roomId, userId) {

		const hasAccess = Rooms.findOne({_id: roomId, "canAccess": userId});

		if (hasAccess) {
			Rooms.update({_id: roomId}, {$pull: {"canAccess": userId}});
		} else {
			Rooms.update({_id: roomId}, {$push: {"canAccess": userId}});
		}

	}
});