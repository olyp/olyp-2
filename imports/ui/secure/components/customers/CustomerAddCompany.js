import React, { Component } from 'react';
import { browserHistory } from 'react-router';
import swal from 'sweetalert2';

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

				if (res && this.props.userId) {

					Meteor.call('user.addCustomer', this.props.userId, res, (err, res) => {
						if (err) {
							console.log(err);
						} else {
							Bert.alert('Customer added to user', 'success', 'growl-bottom-right', 'fa-smile-o');
							browserHistory.goBack();
						}
					});
				} else {
					Bert.alert('Customer added', 'success', 'growl-bottom-right', 'fa-smile-o');
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

export default CustomerAddCompany;