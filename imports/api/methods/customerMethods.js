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

		const exists = Customers.findOne({name: customer.name});

		customer.dateAdded = new Date();
		customer.addedBy = Meteor.userId();

		if (!exists) {
			const newCustomer = Customers.insert(customer);
			return newCustomer;
		} else {
			return exists._id;
		}
	}
});