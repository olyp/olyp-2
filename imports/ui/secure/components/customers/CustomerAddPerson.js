import React, { Component } from 'react';
import { browserHistory } from 'react-router';

class CustomerAddPerson extends Component {

	constructor(props) {
		super(props);
		this.state = {
			city: ''
		}
	}

	searchZip () {

		const zip = this.refs.zip.value.toString();

		if (zip.length == 4) {
			const url = 'https://api.bring.com/shippingguide/api/postalCode.json?clientUrl='+ Meteor.settings.public.url + '&pnr=' + zip;

			HTTP.get(url, (err, res) => {
				if (err) {
					console.log(err);
				} else {

					this.setState({
						city: res.data.result
					});
				}
			});
		} else {
			this.setState({
				city: ''
			});
		}
	}

	addCustomer () {
		const customer = {
			type: 'person',
			name: this.refs.name.value,
			contactPerson: {
				name: this.refs.name.value,
				phone: this.refs.phone.value,
				email: this.refs.email.value
			},
			address: this.refs.address.value,
			zip: this.refs.zip.value,
			city: this.refs.city.value
		};

		Meteor.call('customer.add', customer, (err, res) => {
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
				<input 
					ref="name"
					type="text"
					placeholder="Navn"
				/>

				<div className="spacer-10"></div>

				<input 
					ref="email"
					type="email"
					placeholder="Epost"
				/>

				<div className="spacer-10"></div>

				<input 
					ref="phone"
					type="tel"
					placeholder="Mobil"
				/>

				<div className="spacer-10"></div>

				<input 
					ref="address"
					type="text"
					placeholder="Adresse"
				/>

				<div className="spacer-10"></div>

				<input 
					ref="zip"
					type="number"
					placeholder="Postnummer"
					onChange={this.searchZip.bind(this)}
					min="0001"
					max="9999"
				/>

				<div className="spacer-10"></div>

				<input 
					ref="city"
					type="text"
					placeholder="By"
					disabled
					value={this.state.city}
				/>

				<hr />

				<div className="row">
					<div className="col-xs-12 button-large hover" onClick={this.addCustomer.bind(this)}>Add</div>
				</div>
			</div>
		);
	}
}

export default CustomerAddPerson;