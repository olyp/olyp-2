import uuid from 'uuid/v4';

import Customers from '../collections/customers';
import DeletedRoomBookingAgreements from '../collections/deletedRoomBookingAgreements';

Meteor.methods({
	"customer.delete": (customerId) => {
		const isAdmin = Roles.userIsInRole(Meteor.userId(), ['super-admin', 'admin'], 'olyp');

		if (isAdmin) {
			Customers.remove({_id: customerId});
		}
	},
	"customer.add": (customer) => {

		check(customer, Object);

		if (customer.type == 'company') {
			var exists = Customers.findOne({name: customer.name});
		};

		if (customer.type == 'person') {
			var exists = Customers.findOne({'contactPerson.email': customer.contactPerson.email});
		};

		customer.dateAdded = new Date();
		customer.addedBy = Meteor.userId();
		customer.roomBookingAgreements = [
		    {
		      _id: uuid(),
		      type: "hourlyRental",
		      roomId: Meteor.settings.private.room5Id,
		      hourlyPrice: "250.00000",
		      freeHours: 0,
		      tax: true
		    }
		];

		console.log(customer);

		if (!exists) {
			const newCustomer = Customers.insert(customer);
			return {
				customerId: newCustomer,
				newCustomer: true
			};
		} else {
			return {
				customerId: exists._id,
				newCustomer: false
			};
		}
	},
	"customer.removeRoomBookingAgreement": (customerId, agreementId) => {

		const customer = Customers.findOne({_id: customerId});
		const agreement = customer.roomBookingAgreements.map((agreement) => {
			if (agreement._id == agreementId) {
				return agreement;
			}
		});

		const payload = {
			customer: customer,
			agreement: agreement[0],
			deletedDate: new Date(),
			deletedBy: Meteor.userId()
		}

		DeletedRoomBookingAgreements.insert(payload);

		Customers.update({_id: customerId}, {$pull: {roomBookingAgreements: {_id: agreementId}}});
	},
	"customer.addRoomBookingAgreement": (customerId, agreement) => {
		agreement._id = uuid();

		console.log(agreement);

	}
});