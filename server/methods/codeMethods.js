// import bcrypt from 'bcrypt';

// const saltRounds = 10;

Meteor.methods({
	'addCode': function (code) {

		var codeToAdd = {
			code: code,
			dateCreated: new Date,
			addedBy: Meteor.userId()
		}

		// bcrypt.genSalt(saltRounds, function(err, salt) {
		//     bcrypt.hash(code, salt, function(err, hash) {

		//         codeToAdd['hash'] = hash;
		//     });
		// });

		DoorCodes.insert(codeToAdd);
		
	},
	'deleteCode': function (code) {
		DoorCodes.remove(code);
	},
	'openDoor': function () {
		var getUrl = 'http://maindoor.olyp.no/enu/trigger/' + Meteor.settings.private.doorToken;
		HTTP.get(getUrl);
	}
});