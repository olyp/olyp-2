import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

import DoorCodes from '../collections/doorCodes.js';

Meteor.methods({
	'doorCode.add': function (userId) {

		const randomCode = Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000;

		var newCode = {
			code: randomCode,
			userId: userId,
			dateCreated: new Date,
			addedBy: Meteor.userId()
		}

		// Remove users old code
		DoorCodes.remove({userId: userId});

		DoorCodes.insert(newCode);
		
	},
	'doorCode.delete': function (code) {
		DoorCodes.remove(code);
	},
	'doorCode.open': function () {
		var getUrl = 'http://maindoor.olyp.no/enu/trigger/' + Meteor.settings.private.doorToken;
		HTTP.get(getUrl);
	}
});