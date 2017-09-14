import React, {Component} from 'react';
import TrackerReact from 'meteor/ultimatejs:tracker-react';
import moment from "moment-timezone";
import big from "big.js"

import Invoices from '../../../../api/collections/invoices.js';
import Customers from '../../../../api/collections/customers.js';


export default class InvoicesComponent extends TrackerReact(React.Component) {
	constructor() {
		super();
		this.state = {
			subscription: {
				allInvoices: Meteor.subscribe("allInvoices"),
				allCustomers: Meteor.subscribe('allCustomers')
			},
			currentMonth: moment().tz("Europe/Oslo").isoWeekday(1).startOf("month")
		}
	}

	componentWillUnmount() {
		this.state.subscription.allInvoices.stop();
		this.state.subscription.allCustomers.stop();
	}

	getCurrentInvoices() {
		let start = this.state.currentMonth.clone();
		let end = this.state.currentMonth.clone().add(1, "month");

		return Invoices.find(
			{createdAt: {$gte: start.toDate(), $lt: end.toDate()}},
			{$sort: {createdAt: "desc"}}).fetch()
	}

	getAllCustomers() {
		return Customers.find();
	}

	changeMonth(inc) {
		this.setState({currentMonth: this.state.currentMonth.clone().add(inc, "month")});
	}

	render() {
		const customersById = {};
		this.getAllCustomers().forEach((customer) => customersById[customer["_id"]] = customer);

		return React.DOM.div(null,
			React.DOM.div(null,
				React.DOM.div({className: "btn-group", style: {marginRight: 10}},
					React.DOM.a({
						className: "btn btn-default",
						onClick: function () {
							this.changeMonth(-1);
						}.bind(this)
					}, React.DOM.span({className: "glyphicon glyphicon-chevron-left"})),
					React.DOM.a({
						className: "btn btn-default",
						onClick: function () {
							this.changeMonth(1);
						}.bind(this)
					}, React.DOM.span({className: "glyphicon glyphicon-chevron-right"}))),
				this.state.currentMonth.format("YYYY-MM-DD")),
			this.getCurrentInvoices().map(function (invoice) {
				const customer = customersById[invoice.customerId];
				return React.DOM.div({key: `invoice-${invoice["_id"]}`},
					React.DOM.h2(null, customer && customer.name),
					invoice.hourlyBookingLines.map(function (hourlyBookingLineForRoom) {
						return React.DOM.div({key: `invoice-line-foom-${hourlyBookingLineForRoom.roomId}`},
							React.DOM.div({className: "row", style: {fontWeight: "bold"}},
								React.DOM.div({className: "col-xs-4"},
									"Beskrivelse"),
								React.DOM.div({className: "col-xs-3", style: {textAlign: "right"}},
									"Pris (inkl. mva)")),
							hourlyBookingLineForRoom.lines.map(function (line, idx){
								return React.DOM.div({key: `invoice-line-${idx}`, className: "row"},
									React.DOM.div({className: "col-xs-4"},
										line.note),
									React.DOM.div({className: "col-xs-3", style: {textAlign: "right"}},
										big(line.sumWithTax).toFixed(2)))
							}))
					}),
					React.DOM.div({className: "row"},
						React.DOM.div({className: "col-xs-4"}),
						React.DOM.div({className: "col-xs-3", style: {textAlign: "right"}},
							"Sum: " + big(invoice.sumWithTax).toFixed(2))));
			}));
	}
}