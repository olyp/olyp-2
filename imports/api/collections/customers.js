import { Mongo } from 'meteor/mongo';

const Customers = new Mongo.Collection( 'customers' );

Customers.allow({
	insert: () => false,
	update: () => false,
	remove: () => false
});

Customers.deny({
	insert: () => true,
	update: () => true,
	remove: () => true
});

const CustomerSchema = new SimpleSchema({
	"type": {
		type: String,
		allowedValues: ["person", "company"]
	},

	"name": {
		type: String
	},

	"address": {
		type: String,
		// Some small rural areas does not have an address
		optional: true
	},

	"zip": {
		type: String,
		optional: true
	},

	"city": {
		type: String,
		optional: true
	},

	"brregId": {
		type: String,
		optional: true
	},

	"dateAdded": {
		type: Date,
		optional: true
	},

	"addedBy": {
		type: String,
		optional: true
	},

	"contactPerson.name": {
		type: String
	},

	"contactPerson.email": {
		type: String
	},

	"contactPerson.phone": {
		type: String
	},

	"brregRaw": {
		type: Object,
		blackbox: true,
		optional: true
	},

	"roomBookingAgreements": {
		type: [Object],
		optional: true
	},

	"roomBookingAgreements.$.type": {
		type: String,
		allowedValues: ["hourlyRental", "monthlyRental"]
	},

	"roomBookingAgreements.$._id": {
		type: String
	},

	"roomBookingAgreements.$.roomId": {
		type: String
	},

	"roomBookingAgreements.$.price": {
		type: String
	},

	"roomBookingAgreements.$.freeHours": {
		type: Number,
		optional: true
	},

	"roomBookingAgreements.$.tax": {
		type: Boolean
	},

	"roomBookingAgreements.$.dateCreated": {
		type: Date
	}
});

// const PersonCustomerSchema = new SimpleSchema({
// 	"email": {
// 		type: String
// 	},
// 	"phone": {
// 		type: String
// 	}
// });

// const CompanyCustomerSchema = new SimpleSchema({
// 	"brregId": {
// 		type: String
// 	},

// 	"contactPerson.name": {
// 		type: String
// 	},

// 	"contactPerson.email": {
// 		type: String
// 	},

// 	"contactPerson.phone": {
// 		type: String
// 	},
// 	"brregRaw": {
// 		type: Object,
// 		blackbox: true
// 	}
// });

Customers.attachSchema(CustomerSchema);


// Customers.attachSchema(PersonCustomerSchema, {selector: {type: 'person'}});
// Customers.attachSchema(CompanyCustomerSchema, {selector: {type: 'company'}});

export default Customers;