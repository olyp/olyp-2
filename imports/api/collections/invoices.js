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
	"sum": {
		type: String
	},
	"customerId": {
		type: "String"
	},
	"lines": {
		type: [Object]
	},
	"lines.$.note": {
		type: String,
		optional: true
	},
	"line.$.tax": {
		type: Boolean
	},
	"line.$.sumWithoutTax": {
		type: String
	},
	"line.$.sumWithTax": {
		type: String
	}
});

Invoices.attachSchema( InvoicesSchema );

export default Invoices;