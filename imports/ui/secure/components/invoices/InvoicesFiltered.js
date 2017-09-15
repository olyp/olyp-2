import React, { Component } from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import big from 'big.js';

import Invoices from '../../../../api/collections/invoices';
import Customers from '../../../../api/collections/customers';

class InvoicesFiltered extends Component {

	render () {

		const invoices = this.props.invoices;
		const customers = this.props.customers;
		const customersById = {};

		if (customers) {
			customers.forEach((customer) => customersById[customer["_id"]] = customer);
		}

		if (!invoices) {
			return (
				<div>Loading</div>
			);
		}

		return (
			<div>
				{ invoices.map((invoice) => {

					const customer = customersById[invoice.customerId];
					const sumWithTax = big(invoice.sumWithTax).toFixed(2);

					return (
						<div key={invoice._id}>
							<h2>{customer.name}</h2>
							{invoice.hourlyBookingLines.map((hourlyBookingLineForRoom, idx) => {
								return (
									<div key={idx}>
										<div className="row">
											<div className="col-xs-4">Description</div>
											<div className="col-xs-3 text-right">Price (w/tax)</div>
										</div>
										{hourlyBookingLineForRoom.lines.map((line, idx) => {
											const lineSum = big(line.sumWithTax).toFixed(2);

											return (
												<div key={idx} className="row">
													<div className="col-xs-4">{line.note}</div>
													<div className="col-xs-3 text-right">{lineSum}</div>
												</div>
											);
										})}
										<div className="row">
											<div className="col-xs-4"></div>
											<div className="col-xs-3 text-right">
												Sum: {sumWithTax}
											</div>
										</div>
									</div>
								);
							})}
						</div>
					);
				})}
			</div>
		);
	}
};

export default createContainer((props) => {

	Meteor.subscribe("allInvoices");
	Meteor.subscribe("allCustomers");

	let start = props.currentMonth.clone();
	let end = props.currentMonth.clone().add(1, "month");

	return {
		invoices: Invoices.find(
			{ createdAt: {$gte: start.toDate(), $lt: end.toDate()} },
			{ $sort: {createdAt: "desc"} }).fetch(),
		customers: Customers.find().fetch()
	}
}, InvoicesFiltered);