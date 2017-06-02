import Customers from '../collections/customers.js';

Meteor.methods({
	"customer.delete": (customerId) => {
		const isAdmin = Roles.userIsInRole(Meteor.userId(), ['super-admin', 'admin'], 'olyp');

		if (isAdmin) {
			Customers.remove({_id: customerId});
		}
	},
	"customer.add": (customer) => {
		const exists = Customers.findOne({name: customer.name});

		if (!exists) {
			const newCustomer = Customers.insert(customer);
			return newCustomer;
		} else {
			return exists._id;
		}
	}
});