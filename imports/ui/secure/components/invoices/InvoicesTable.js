import React, { Component } from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import { browserHistory } from 'react-router';
import moment from 'moment-timezone';
import ReactTable from 'react-table';
import big from 'big.js';

import Invoices from '../../../../api/collections/invoices';
import Customers from '../../../../api/collections/customers';

import 'react-table/react-table.css';

// TODO: implement sorting

class InvoicesTable extends Component {

	constructor (props) {
		super(props);
		this.state = {
			data: []
		}
	}

	goToInvoice (invoiceId) {
		const url = '/secure/invoices/' + invoiceId;
		browserHistory.push(url);
	}

	toggleInvoicePaid (invoiceId) {
		Meteor.call('invoice.togglePaid', invoiceId, (err, res) => {
			if (err) {
				console.log(err);
			}
		});
	}

	reOrder (field) {
		this.props.reOrder(field);
	}

	render () {

		// this.props.reOrder('date');

		const customers = this.props.customers;
		const invoices = this.props.invoices;

		if (!customers && !invoices) {
			return (
				<div>Loading</div>
			);
		}

		const customersById = {};
		customers.forEach((customer) => customersById[customer["_id"]] = customer);


		const columns = [
			{
				Header: 'Customer',
				accessor: 'customer',
				headerClassName: 'room-selector room-selector-active hover',
				headerStyle: {padding: '10px 0px'}
			},
			{
				Header: 'Invoiced',
				accessor: 'createdAt',
				headerClassName: 'room-selector room-selector-active hover',
				headerStyle: {padding: '10px 0px'},
				maxWidth: 100,
				className: 'text-center'
			},
			{
				Header: 'Due',
				accessor: 'dueDate',
				headerClassName: 'room-selector room-selector-active hover',
				headerStyle: {padding: '10px 0px'},
				maxWidth: 100,
				className: 'text-center'
			},
			{
				Header: 'Amount',
				accessor: 'sum',
				headerClassName: 'room-selector room-selector-active hover',
				headerStyle: {padding: '10px 0px'},
				maxWidth: 100,
				className: 'text-right'
			},
			{
				Header: 'Paid',
				accessor: 'paid',
				headerClassName: 'room-selector room-selector-active hover',
				headerStyle: {padding: '10px 0px'},
				maxWidth: 50,
				className: 'hover'
			}
		];

		const data = [];

		invoices.map((invoice) => {

			const customer = customersById[invoice.customerId];
			const sumWithTax = big(invoice.sumWithTax).toFixed(2);

			data.push({
				customer: customer.name,
				createdAt: moment(invoice.createdAt).format('YYYY-MM-DD'),
				dueDate: '',
				sum: sumWithTax,
				paid: invoice.paid,
				_id: invoice._id

			});
		});

		return (
			<div>
				<ReactTable 
					columns={columns}
					data={data}
					manual
					showPagination={false}
					defaultPageSize={this.props.pageSize}
					getTdProps={(state, rowInfo, column, instance) => {

						let style = {};

						if (rowInfo && column) {
							if (column.id == 'paid') {
								if (rowInfo.original.paid == undefined) {
									style.background = 'yellow';
								} else if (rowInfo.original.paid) {
									style.background = 'green';
								} else {
									style.background = 'red';
								}

							}
						}

						return {
							style,
							onClick: (e, handleOriginal) => {
								if (column.id == 'paid') {
									this.toggleInvoicePaid(rowInfo.original._id);
								} else {
									this.goToInvoice(rowInfo.original._id);
								}
							}
						}
					}}
					onSortedChange={(newSorted, column, shiftKey) => {
						this.reOrder(column.id);
					}}
				/>
			</div>
		);
	}
};

export default withTracker((props) => {

	Meteor.subscribe('allCustomers');
	Meteor.subscribe('allInvoices');

	var sort = {};
	sort[props.sortField] = props.sortDirection;

	return {
		customers: Customers.find().fetch(),
		invoices: Invoices.find({}, {sort: sort, skip: props.pageSize * (props.currentPage - 1), limit: props.pageSize}).fetch()
	}
})(InvoicesTable);