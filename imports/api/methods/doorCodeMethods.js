import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

import DoorCodes from '../collections/doorCodes.js';

Meteor.methods({
	'doorCode.add': function (code) {

		var codeToAdd = {
			code: code,
			dateCreated: new Date,
			addedBy: Meteor.userId()
		}

		DoorCodes.insert(codeToAdd);
		
	},
	'doorCode.delete': function (code) {
		DoorCodes.remove(code);
	},
	'doorCode.open': function () {
		var getUrl = 'http://maindoor.olyp.no/enu/trigger/' + Meteor.settings.private.doorToken;
		HTTP.get(getUrl);
	}
});