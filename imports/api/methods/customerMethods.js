import uuid from 'uuid/v4';

import Customers from '../collections/customers.js';

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
	}
});