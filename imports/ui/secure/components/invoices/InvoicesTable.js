import React, { Component } from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import { browserHistory } from 'react-router';
import moment from 'moment-timezone';
import ReactTable from 'react-table';
import big from 'big.js';

import Invoices from '../../../../api/collections/invoices';
import Customers from '../../../../api/collections/customers';

import Preloader from '../../../shared/preloader/Preloader';

import 'react-table/react-table.css';

// TODO: implement sorting

class InvoicesTable extends Component {

	state = {
		data: []
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

		if (this.props.loading) {
			return <Preloader />
		}

		const customers = this.props.customers;
		const invoices = this.props.invoices;

		const customersById = {};
		customers.forEach((customer) => customersById[customer["_id"]] = customer);

		const columns = [
			{
				Header: 'Date',
				accessor: 'date',
				headerClassName: 'room-selector room-selector-active hover',
				headerStyle: {padding: '10px 0px'},
				maxWidth: 100,
				className: 'text-center'
			},
			{
				Header: 'Customer',
				accessor: 'customer',
				headerClassName: 'room-selector room-selector-active hover',
				headerStyle: {padding: '10px 0px'}
			}
		];

		const data = [];

		invoices.map((invoice) => {

			const customer = customersById[invoice.customerId];
			const sumWithTax = big(invoice.sumWithTax).toFixed(2);
			const glyph = (customer && customer.type == 'person') ? 'glyphicon-user' : 'glyphicon-briefcase';
			const customerName = (customer.name.length > 18) ? `${customer.name.substring(0, 18)} ...` : customer.name;

			const dateCell = 
				<div>
					{moment(invoice.createdAt).format('DD.MM.YYYY')}
				</div>;

			const customerCell = 
				<div>
					<span className={`glyphicon ${glyph}`}></span> {customerName}
					<p style={{margin: 0, color: 'grey'}}>kr {sumWithTax}</p>
					<p  style={{color: 'grey'}}># xxxx</p>
				</div>

			data.push({
				date: dateCell,
				customer: customerCell,
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

	const customersHandle = Meteor.subscribe('allCustomers');
	const invoicesHandle = Meteor.subscribe('allInvoices');

	const loading = !customersHandle.ready() && !invoicesHandle.ready();

	var sort = {};
	sort[props.sortField] = props.sortDirection;

	return {
		loading,
		customers: Customers.find().fetch(),
		invoices: Invoices.find({}, {sort: sort, skip: props.pageSize * (props.currentPage - 1), limit: props.pageSize}).fetch()
	}
})(InvoicesTable);