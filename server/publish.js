import DoorCodeAttempts from '../imports/api/collections/doorCodeAttempts.js';
import DoorCodes from '../imports/api/collections/doorCodes.js';
import Reservations from '../imports/api/collections/reservations.js';

Meteor.publish('doorCodes', function () {
	return DoorCodes.find();
});

Meteor.publish('profile', function () {
	return Meteor.users.find(
		{_id: this.userId}, 
		{fields: 
			{
				'services.password': 0, 
				'services.facebook.accessToken': 0, 
				'services.google.accessToken': 0, 
				'services.google.idToken': 0
			}
		}
	);
});

Meteor.publish('reservations', function () {
    return Reservations.find();
});

Meteor.publish('allProfiles', function () {
    return Meteor.users.find({}, {fields: {"profile": 1}});
});

Meteor.publish('allUsers', function () {

	const canManageUsers = Roles.userIsInRole(this.userId, ['admin', 'super-admin'], 'manage-users');

	if (canManageUsers) {
		return Meteor.users.find({}, {fields: {"profile": 1, "emails": 1, "createdAt": 1, "roles": 1, "status": 1}});
	} else {
		return null;
	}

    
});