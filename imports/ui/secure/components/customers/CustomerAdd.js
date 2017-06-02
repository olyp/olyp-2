import React, { Component } from 'react';
import { browserHistory } from 'react-router';

import CustomerRow from './CustomerRow';

class CustomerAdd extends Component {

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

	addCustomer (customerRaw) {
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
			dateAdded: new Date(),
			addedBy: Meteor.userId()
		};

		Meteor.call("customer.add", customer, (err, res) => {
			if (err) {
				console.log(err);
			} else {

				if (res && this.props.params.userId) {

					Meteor.call('user.addCustomer', this.props.params.userId, res, (err, res) => {
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
			<div className="container">

				<div className="row">
					<div className="col-xs-10">
						<input 
							type="text" 
							ref="searchInput" 
							placeholder="Search Brønnøysundregistrene ..." 
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

					let onClick = this.addCustomer.bind(this, customer);

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

export default CustomerAdd;