import React, { Component } from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import { browserHistory } from 'react-router';
import big from 'big.js';
import moment from 'moment';

import InvoicesCollection from '../../../../api/collections/invoices';
import CustomersCollection from '../../../../api/collections/customers';

import Preloader from '../../../shared/preloader/Preloader';
import CustomerRow from '../customers/CustomerRow';
import InvoiceLine from './InvoiceLine';

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
			<div>
				<div className="row text-center">
					<h1>Invoice</h1>
					<p style={{color: 'grey'}}>{moment(invoice.createdAt).format('DD.MM.YYYY')}</p>
					<p style={{color: 'grey'}}># xxxx</p>
				</div>
				<hr />
				<CustomerRow customer={customer} onClick={this.goToCustomer.bind(this, customer._id)} hover />
				{invoice.hourlyBookingLines && invoice.hourlyBookingLines.map((hourlyBookingLine, i) => {
					return (
						<div key={i}>
							<hr />
							{hourlyBookingLine.lines.map((line, i) => {
								return (
									<div key={i} className="row">
										<InvoiceLine 
											description={line.note}
											amount={big(line.sumWithTax).toFixed(2)}
										/>
									</div>
								);
							})}
						</div>
					);
				})}
				{invoice.otherLines && invoice.otherLines.map((line, i) => {
					return (
						<div key={i}>
							<hr />
							<div className="row">
								<InvoiceLine 
									description={line.note}
									amount={big(line.sumWithTax).toFixed(2)}
								/>
							</div>
						</div>
					);
				})}
				<hr />
				<div className="row text-right">
					<div className="col-xs-12">
						<h2>Sum: {big(invoice.sumWithTax).toFixed(2)}</h2>
					</div>
				</div>
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