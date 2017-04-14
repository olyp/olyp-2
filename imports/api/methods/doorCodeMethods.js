import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

import DoorCodes from '../collections/doorCodes.js';

Meteor.methods({
	'doorCode.addTemporary': function (userId, validFrom, validTo) {

		check(userId, String);
		check(validFrom, String);
		check(validTo, String);

		const randomCode = Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000;
		const addedBy = Meteor.userId() ? Meteor.userId() : userId;

		var newCode = {
			code: randomCode,
			userId: userId,
			dateCreated: new Date,
			addedBy: addedBy,
			validFrom: validFrom,
			validTo: validTo,
			temporary: true
		}

		// Remove users old code
		// If the code belongs to no user, keep it
		if (userId !== 'no user') {
			DoorCodes.remove({userId: userId});
		}
		
		DoorCodes.insert(newCode);
		
	},
	'doorCode.add': function (userId) {
		check(userId, String);

		const randomCode = Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000;
		const addedBy = Meteor.userId() ? Meteor.userId() : userId;

		const newCode = {
			code: randomCode,
			userId: userId,
			dateCreated: new Date,
			addedBy: addedBy,
			temporary: false
		}

		DoorCodes.insert(newCode);
	},
	'doorCode.deleteById': function (codeId) {
		check(codeId, String);

		DoorCodes.remove(codeId);
	},
	'doorCode.deleteByUserId': function (userId) {
		check(userId, String);

		DoorCodes.remove({userId: userId});
	}
	// 'doorCode.open': function () {
	// 	var getUrl = 'http://maindoor.olyp.no/enu/trigger/' + Meteor.settings.private.doorToken;
	// 	HTTP.get(getUrl);
	// }
});