import React, { Component } from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import { browserHistory, Link } from 'react-router';
import swal from 'sweetalert2';

import CustomersCollection from '../../../../api/collections/customers.js'
import Invoices from '../../../../api/collections/invoices.js'

import Preloader from '../../../shared/preloader/Preloader.js';
import UserRow from '../users/UserRow';

class CustomerSingle extends Component {

	deleteCustomer () {

		swal({
			title: 'Are you sure?',
			text: "You will not be able to recover this customer!",
			type: 'warning',
			showCancelButton: true,
			confirmButtonColor: '#3085d6',
			cancelButtonColor: '#d33',
			confirmButtonText: 'Yes, delete it!'
		}).then(() => {
			Meteor.call('customer.delete', this.props.customer._id, (err, res) => {
				if (err) {
					console.log(err);
					swal("Failed", "The customer cound not be deleted.", "warning");
				} else {
					browserHistory.goBack();
					Bert.alert('Customer deleted', 'success', 'growl-bottom-right', 'fa-smile-o');
				}
			});
		// Since this is a promise, we have to catch "cancel" and say it is ok
		}).catch(swal.noop);
	}

	render () {

		const customer = this.props.customer;
		const invoices = this.props.invoices;
		const users = this.props.users;

		if (!customer) {
			return (
				<Preloader />
			);
		}

		return (
			<div className="container customer-single">
				<div className="row">
					<div className="col-xs-4">
						<span className="glyphicon glyphicon-briefcase"></span>
					</div>
					<div className="col-xs-8">
						<h4>{customer.name}</h4>
					</div>
				</div>
				<hr />
				<div className="row">
					<div className="text-right">
						<div className="col-xs-12">
							{customer.contactPerson.name}
						</div>
						<div className="col-xs-12">
							<a style={{textDecoration: 'underline'}} href={`mailto:${customer.contactPerson.email}`}>{customer.contactPerson.email}</a>
						</div>
						<div className="col-xs-12">
							<a style={{textDecoration: 'underline'}} href={`tel:${customer.contactPerson.phone}`}>{customer.contactPerson.phone}</a>
						</div>
					</div>
				</div>
				<hr />
				<div className="row">
					<div className="col-xs-12">
						<h4>Room booking agreements</h4>
					</div>
				</div>
				<div className="row">
					<div className="col-xs-12">
						<h4>Users</h4>
						{users.map((user) => {
							return (
								<div key={user._id}>
									<UserRow user={user} />
									<hr />
								</div>
							);
						})}
					</div>
				</div>
				<div className="row">
					<div className="col-xs-12">
						<div className="delete-large hover" onClick={this.deleteCustomer.bind(this)}>
      						Delete Customer
    					</div>
					</div>
				</div>
	
			</div>
		);
	}
}

export default withTracker((props) => {
	Meteor.subscribe('allCustomers');
	Meteor.subscribe('customerInvoices', props.params.customerId);
	Meteor.subscribe('customerUsers', props.params.customerId);

	return {
		customer: CustomersCollection.find({_id: props.params.customerId}).fetch()[0],
		// invoices: Invoices.find().fetch(),
		// Restricting again here, in addidtion to in publish since Meteor.userId is already published and logged in user might not be a user of this customer if he/she is an admin
		users: Meteor.users.find({"customers.id": props.params.customerId}).fetch()
	};
})(CustomerSingle);