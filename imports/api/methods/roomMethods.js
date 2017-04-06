import { Meteor } from 'meteor/meteor';

import Rooms from '../collections/rooms.js';

Meteor.methods({
	'room.add': function (name) {
		Rooms.insert({name: name});
	},
	'room.delete': function (roomId) {
		Rooms.remove({_id: roomId});
	},
	'room.rename': function (roomId, name) {
		Rooms.update({_id: roomId}, {$set: {name: name}});
	},
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