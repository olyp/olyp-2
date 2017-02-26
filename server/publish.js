import DoorCodeAttempts from '../imports/api/collections/doorCodeAttempts.js';
import DoorCodes from '../imports/api/collections/doorCodes.js';
import Reservations from '../imports/api/collections/reservations.js';
import Rooms from '../imports/api/collections/rooms.js';
import Customers from '../imports/api/collections/customers.js';

Meteor.publish('allDoorCodes', function () {

	const isAdmin = Roles.userIsInRole(this.userId, ['admin', 'super-admin'], 'booking');

	if (isAdmin) {
		return DoorCodes.find();
	} else {
		return null;
	}
});

Meteor.publish('doorCode', function () {
	return DoorCodes.find({userId: this.userId});
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

Meteor.publish('rooms', function () {
	return Rooms.find();
});

Meteor.publish('userCustomers', function () {
	const user = Meteor.users.findOne({_id: this.userId});
	return Customers.find({"_id": {"$in": user.customers.map((it) => it.id)}});
});
