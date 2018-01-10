import uuid from 'uuid/v4';
import big from 'big.js';

import Customers from '../collections/customers';
import DeletedRoomBookingAgreements from '../collections/deletedRoomBookingAgreements';

Meteor.methods({
	"customer.delete": (customerId) => {
		check(customerId, String);

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

		check(customerId, String);
		check(agreementId, String);

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

		check(customerId, String);
		check(agreement, Object);

		agreement._id = uuid();
		agreement.price = big(agreement.price).toFixed(5);
		agreement.freeHours = Number(agreement.freeHours);
		agreement.dateCreated = new Date();

		Customers.update({_id: customerId}, {$push: {roomBookingAgreements: agreement}});

	}
});