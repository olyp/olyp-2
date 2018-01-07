import React, { Component } from 'react';
import { browserHistory } from 'react-router';
import { withTracker } from 'meteor/react-meteor-data';
import swal from 'sweetalert2';

import CustomersCollection from '../../../../api/collections/customers.js';

import CustomerRow from './CustomerRow';

class CustomerAddCompany extends Component {

	constructor(props) {
		super(props);
		this.state = {
			result: []
		}
	}

	searchBrreg () {

		if (this.refs.searchInput.value) {
			const url = 'https://hotell.difi.no/api/json/brreg/enhetsregisteret' + '?' + 'query=' + this.refs.searchInput.value;

			HTTP.get(url, (err, res) => {
				if (err) {
					console.log(err);
				} else {
					this.setState({
						result: res.data.entries
					});
				}
			});
		} else {
			this.setState({
				result: []
			});
		}

	}

	handleCustomerClick (customerRaw) {

		// Check if customer exists
		var exists = false;
		var existingCustomerId = '';

		for (var i = 0; i < this.props.customers.length; i++) {
			if (this.props.customers[i].brregId == customerRaw.orgnr) {
				exists = true;
				existingCustomerId = this.props.customers[i]._id;
				break;
			}
		};

		if (!exists) {

			swal.setDefaults({
				input: 'text',
				confirmButtonText: 'Next &rarr;',
				showCancelButton: true,
				animation: false,
				progressSteps: ['1', '2', '3']
			});

			var steps = [
				{
					title: 'Navn',
					text: 'På kontaktperson'
				},
				{
					title: 'Epost',
					text: 'Til kontaktperson'
				},
				{
					title: 'Mobil',
					text: 'Til kontaktperson'
				}
			];

			swal.queue(steps).then((result) => {
				swal.resetDefaults();
				this.addCustomer(customerRaw, result)
			}, () => {
				swal.resetDefaults();
			});

		} else {

			let customerAlreadyAttatched = this.props.userData.customers.filter((customer) => {
				return customer.id == existingCustomerId
			});

			if (customerAlreadyAttatched) {
				Bert.alert('Customer already exists', 'info', 'growl-bottom-right', 'fa-smile-o');
				browserHistory.goBack();
			} else {
				Meteor.call('user.addCustomer', this.props.userId, existingCustomerId, (err, res) => {
					if (err) {
						console.log(err);
					} else {
						Bert.alert('Existing customer added to user', 'success', 'growl-bottom-right', 'fa-smile-o');
						browserHistory.goBack();
					}
				});
			} 
		}

	}

	addCustomer (customerRaw, contactInfo) {
		this.refs.searchInput.value = '';
		this.setState({
			result: []
		});

		const customer = {
			type: 'company',
			name: customerRaw.navn,
			address: customerRaw.forretningsadr,
			zip: customerRaw.forradrkommnr,
			city: customerRaw.forradrpoststed,
			brregId: customerRaw.orgnr,
			brregRaw: customerRaw,
			contactPerson: {
				name: contactInfo[0],
				email: contactInfo[1],
				phone: contactInfo[2]
			}
		};

		Meteor.call("customer.add", customer, (err, res) => {
			if (err) {
				console.log(err);
			} else {

				var customerResult = res;

				if (res && this.props.userId) {

					Meteor.call('user.addCustomer', this.props.userId, res.customerId, (err, res) => {
						if (err) {
							console.log(err);
						} else {

							if (customerResult.newCustomer) {
								Bert.alert('Customer created and added to user', 'success', 'growl-bottom-right', 'fa-smile-o');
							} else {
								Bert.alert('Existing customer added to user', 'success', 'growl-bottom-right', 'fa-smile-o');
							}
							
							browserHistory.goBack();
						}
					});
				} else {

					if (res.newCustomer) {
						Bert.alert('Customer created', 'success', 'growl-bottom-right', 'fa-smile-o');
					} else {
						Bert.alert('Customer already exists', 'info', 'growl-bottom-right', 'fa-smile-o');
					}
					
					browserHistory.goBack();
				}
			}
		});
	}


	render () {

		return (
			<div>

				<div className="row">
					<div className="col-xs-10">
						<input 
							type="text" 
							ref="searchInput" 
							placeholder="Søk Brønnøysundregistrene ..." 
							className="search-bar"
							onChange={this.searchBrreg.bind(this)}
						/>
					</div>
					<div className="col-xs-2">
						<div className="search-counter pull-right"> {this.state.result.length} </div>
					</div>
				</div>

				<hr />

				{this.state.result.map((customer, i) => {

					var formattedCustomer = {};

					formattedCustomer.name = customer.navn;

					let onClick = this.handleCustomerClick.bind(this, customer);

					return (
						<div className="customer-list" key={i}>
							<CustomerRow customer={formattedCustomer} onClick={onClick}/>
							<hr />
						</div>
					);
				})}
			</div>
		);
	}
}

export default withTracker(() => {

	Meteor.subscribe('allCustomers');
	Meteor.subscribe('userData');

	return {
		customers: CustomersCollection.find().fetch(),
		userData: Meteor.users.find().fetch()[0]
	};
})(CustomerAddCompany);