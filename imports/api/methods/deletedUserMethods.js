import DeletedUsers from '../collections/deletedUsers.js';

Meteor.methods({
	'deletedUsers.add': function (userId) {
		const user = Meteor.users.findOne({_id: userId});

		const email = (user.emails && user.emails[0] && user.emails[0].address);
		const name = (user.profile && user.profile.name);

		DeletedUsers.insert({
			"name": name,
			"oldId": user._id,
			"email": email,
			"deletedDate": new Date,
			"createdDate": user.createdAt
		});
	}
});