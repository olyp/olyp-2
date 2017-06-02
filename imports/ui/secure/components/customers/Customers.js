import React, { Component } from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import { browserHistory, Link } from 'react-router';

import CustomersCollection from '../../../../api/collections/customers.js';

import CustomerRow from './CustomerRow.js';

class Customers extends Component {

	constructor(props) {
		super(props);
		this.state = {
			query: '',
			result: []
		}
	}

	search () {
		this.setState({
			query: this.refs.searchInput.value
		});
	}

	goToCustomer (customerId) {
		const url = '/secure/customers/' + customerId;
		browserHistory.push(url);
	}

	render () {

		var filteredCustomers = this.props.customers.filter(
			(customer) => {

				const query = this.state.query.toLowerCase();
				const customerName = customer.name ? customer.name.toLowerCase() : '';
				// const email = (user.emails && user.emails[0] && user.emails[0].address) ? user.emails[0].address : '';

				const customerNameMatch = customerName.indexOf(query) !== -1;
				// const emailMatch = email.indexOf(query) !== -1;

				if (customerNameMatch) {
					return true
				}
			}
		);

		return (
			<div className="container">

				<div className="row">
					<div className="col-xs-10">
						<input 
							type="text" 
							ref="searchInput" 
							placeholder="Search ..." 
							className="search-bar"
							onChange={this.search.bind(this)}
						/>
					</div>
					<div className="col-xs-2">
						<div className="search-counter pull-right"> {filteredCustomers.length} </div>
					</div>
				</div>

				<hr />

				<div className="row">
					<Link to="/secure/addCustomer">
						<div className="col-xs-12 button-large hover">Add Customer</div>
					</Link>
				</div>

				<hr />

				{filteredCustomers.map((customer, i) => {

					// if (user._id !== Meteor.userId()) {

						let onClick = this.goToCustomer.bind(this, customer._id);

						return (
							<div className="customer-list" key={customer._id}>
								<CustomerRow customer={customer} onClick={onClick} />
								<hr />
							</div>
						);
					// }
					
				})}
			</div>
		);
	}
}

export default createContainer(() => {
	Meteor.subscribe('allCustomers');

	return {
		customers: CustomersCollection.find().fetch()
	};
}, Customers);
