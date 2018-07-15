import { Mongo } from 'meteor/mongo';

const Invoices = new Mongo.Collection( 'invoices' );

Invoices.allow({
	insert: () => false,
	update: () => false,
	remove: () => false
});

Invoices.deny({
	insert: () => true,
	update: () => true,
	remove: () => true
});


const InvoicesSchema = new SimpleSchema({
	"sumWithTax": {
		type: String
	},
	"sumWithoutTax": {
		type: String
	},
	"customerId": {
		type: "String"
	},
	"createdAt": {
		type: Date
	},
	"paid": {
		type: Boolean,
		optional: true
	},
	"hourlyBookingLines": {
		type: [Object]
	},
	"hourlyBookingLines.$.roomId": {
		type: String,
	},
	"hourlyBookingLines.$.roomBookingAgreementId": {
		type: String
	},
	"hourlyBookingLines.$.price": {
		type: String
	},
	"hourlyBookingLines.$.tax": {
		type: Boolean
	},
	"hourlyBookingLines.$.freeHours": {
		type: String
	},

	"hourlyBookingLines.$.lines": {
		type: [Object]
	},
	"hourlyBookingLines.$.lines.$.note": {
		type: String,
		optional: true
	},
	"hourlyBookingLines.$.lines.$.tax": {
		type: Boolean
	},
	"hourlyBookingLines.$.lines.$.sumWithoutTax": {
		type: String
	},
	"hourlyBookingLines.$.lines.$.sumWithTax": {
		type: String
	},


	"otherLines": {
		type: [Object]
	},
	"otherLines.$.note": {
		type: String,
		optional: true
	},
	"otherLines.$.tax": {
		type: Boolean
	},
	"otherLines.$.sumWithoutTax": {
		type: String
	},
	"otherLines.$.sumWithTax": {
		type: String
	}
});

Invoices.attachSchema( InvoicesSchema );

export default Invoices;