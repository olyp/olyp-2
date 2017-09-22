import DoorCodeAttempts from '../imports/api/collections/doorCodeAttempts.js';
import DoorCodes from '../imports/api/collections/doorCodes.js';
import Reservations from '../imports/api/collections/reservations.js';
import Rooms from '../imports/api/collections/rooms.js';
import Customers from '../imports/api/collections/customers.js';
import Invoices from "../imports/api/collections/invoices";

Meteor.publish("rolesIsReady", function () {
	return Meteor.roles.find({}, {reactive: false});
});


Meteor.publish('allDoorCodes', function () {

	const isAdmin = Roles.userIsInRole(this.userId, ['admin', 'super-admin'], 'olyp');

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

	const isAdmin = Roles.userIsInRole(this.userId, ['admin', 'super-admin'], 'olyp');

	if (isAdmin) {
		return Meteor.users.find({}, {fields: {"profile": 1, "emails": 1, "createdAt": 1, "roles": 1, "status": 1}});
	} else {
		return null;
	} 
});

Meteor.publish('allRooms', function () {
	const isAdmin = Roles.userIsInRole(this.userId, ['admin', 'super-admin'], 'olyp');

	if (isAdmin) {
		return Rooms.find();
	}
});

Meteor.publish('allCustomers', function () {
	const isAdmin = Roles.userIsInRole(this.userId, ['admin', 'super-admin'], 'olyp');

	if (isAdmin) {
		return Customers.find();
	}
});

Meteor.publish('userRooms', function () {

	const userId = this.userId;

	return Rooms.find({$or: [{'canBook': userId}, {'canAccess': userId}]});
});

Meteor.publish('userCustomers', function () {
	const user = Meteor.users.findOne({_id: this.userId});
	return Customers.find({"_id": {"$in": user.customers.map((it) => it)}});
});

Meteor.publish('allInvoices', function () {

	const isAdmin = Roles.userIsInRole(this.userId, ['admin', 'super-admin'], 'olyp');

	if (isAdmin) {
		return Invoices.find();
	} else {
		return this.ready();
	}
});

Meteor.publish("allUnInvoicedBookings", function () {
	const isAdmin = Roles.userIsInRole(this.userId, ['admin', 'super-admin'], 'olyp');

	if (isAdmin) {
		return Reservations.find({"type": "booking", "booking.isInvoiced": false});
	} else {
		return this.ready();
	}
});
