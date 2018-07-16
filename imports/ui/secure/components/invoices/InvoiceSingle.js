import React, { Component } from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import { browserHistory } from 'react-router';

import InvoicesCollection from '../../../../api/collections/invoices';
import CustomersCollection from '../../../../api/collections/customers';

import Preloader from '../../../shared/preloader/Preloader';
import CustomerRow from '../customers/CustomerRow';

class InvoiceSingle extends Component {

	goToCustomer (customerId) {
		const url = '/secure/customers/' + customerId;
		browserHistory.push(url);
	}

	render () {

		const invoice = this.props.invoice;
		const customer = this.props.customer;

		if (this.props.loading || !invoice || !customer) {
			return <Preloader />
		}

		return (
			<div className="container">
				<CustomerRow customer={customer} onClick={this.goToCustomer.bind(this, customer._id)} hover />
			</div>
		);
	}
};

export default withTracker((props) => {
	const invoicesHandle = Meteor.subscribe('allInvoices');
	const customersHandle = Meteor.subscribe('allCustomers');

	const invoice = InvoicesCollection.findOne({_id: props.params.invoiceId});
	let customer = null;

	if (invoice) {
		customer = CustomersCollection.findOne({_id: invoice.customerId});
	}

	const loading = !invoicesHandle.ready() && !customersHandle.ready() && invoice == null && customer == null;

	return {
		invoice,
		customer,
		loading
	};

})(InvoiceSingle);