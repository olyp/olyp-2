import Invoices from '../collections/invoices';

Meteor.methods({
	'invoice.togglePaid': function (invoiceId) {

		const doc = Invoices.findOne({_id: invoiceId}, {fields: {paid: 1}});

		if (!doc.paid) {
			Invoices.update({_id: invoiceId}, {$set: {paid: true}});
		} else {
			Invoices.update({_id: invoiceId}, {$set: {paid: !doc.paid}});
		}
	}
});