import React, { Component } from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import { browserHistory, Link } from 'react-router';
import swal from 'sweetalert2';
import { Glyphicon, FormGroup, ControlLabel, FormControl } from 'react-bootstrap';

import CustomersCollection from '../../../../api/collections/customers';
import Invoices from '../../../../api/collections/invoices';
import Rooms from '../../../../api/collections/rooms';

import Preloader from '../../../shared/preloader/Preloader';
import UserRow from '../users/UserRow';
import RoomBookingAgreementRow from '../booking/RoomBookingAgreementRow';

class CustomerSingle extends Component {

	deleteCustomer () {

		swal({
			title: 'Delete customer?',
			text: "You will not be able to recover this customer!",
			type: 'warning',
			showCancelButton: true,
			confirmButtonColor: '#3085d6',
			cancelButtonColor: '#d33',
			confirmButtonText: 'Yes, delete it!'
		}).then((result) => {
			if (result.value) {
				Meteor.call('customer.delete', this.props.customer._id, (err, res) => {
					if (err) {
						console.log(err);
					} else {
						browserHistory.goBack();
						Bert.alert('Customer deleted', 'success', 'growl-bottom-right', 'fa-smile-o');
					}
				});
			}
		});
	}

	addRoomBookingAgreement () {

		const rooms = this.props.rooms;

		let roomsString = '<select id="create-agreement-room" class="swal2-input">';

		rooms.map((room) => {
			roomsString = roomsString + `<option value=${room._id}>${room.name}</option>`;
		});

		roomsString = roomsString + '</select>';

		swal({
			title: 'Create agreement',
			html: 
				'<select id="create-agreement-type" class="swal2-input"><option value="hourlyRental">Hourly</option><option value="monthlyRental">Monthly</option></select>' +
				roomsString +
				'<input id="create-agreement-price" class="swal2-input" placeholder="NOK">' +
				'<input id="create-agreement-freehours" class="swal2-input" placeholder="Free hours">' +
				'<input type="checkbox" id="create-agreement-tax"> + MVA?',
			focusConfirm: true,
			showCancelButton: true
		}).then((result) => {

			if (result.value) {
				const type = $('#create-agreement-type').val();
				const roomId = $('#create-agreement-room').val();
				const freeHours = $('#create-agreement-freehours').val();
				const price = $('#create-agreement-price').val();
				const tax = $('#create-agreement-tax').is(":checked");

				let agreementExists = false;

				this.props.customer.roomBookingAgreements.map((agreement) => {
					if (agreement.roomId == roomId) {
						agreementExists = true;
					}
				});

				if (price == "") {
					Bert.alert('You need to enter an price', 'warning', 'growl-bottom-right', 'fa-frown-o');
				} else if (type == "monthlyRental" && freeHours != "") {
					Bert.alert('No free hours in monthly agreement', 'warning', 'growl-bottom-right', 'fa-frown-o');
				} else if (agreementExists) {
					Bert.alert('An agreement already exists for that room', 'warning', 'growl-bottom-right', 'fa-frown-o');
				} else {

					const agreement = {
						type,
						roomId,
						price,
						freeHours,
						tax
					};

					Meteor.call('customer.addRoomBookingAgreement', this.props.customer._id, agreement, (err, res) => {
						if (err) {
							console.log(err);
						} else {
							Bert.alert('Agreement added', 'success', 'growl-bottom-right', 'fa-smile-o');
						}
					});
				}
			}
		});
	}

	removeRoomBookingAgreement (agreementId) {
		swal({
			title: 'Remove agreement?',
			text: "You can always add a new one :)",
			type: 'warning',
			showCancelButton: true,
			confirmButtonColor: '#3085d6',
			cancelButtonColor: '#d33',
			confirmButtonText: 'Yes, remove it!'
		}).then((result) => {
			if (result.value) {
				Meteor.call('customer.removeRoomBookingAgreement', this.props.customer._id, agreementId, (err, res) => {
					if (err) {
						console.log(err);
					} else {
						Bert.alert('Agreement removed', 'success', 'growl-bottom-right', 'fa-smile-o');
					}
				});
			}
		});
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

		let contactPerson = {
			name: (customer.contactPerson && customer.contactPerson.name),
			email: (customer.contactPerson && customer.contactPerson.email),
			phone: (customer.contactPerson && customer.contactPerson.phone)
		}

		if (customer.type == "person") {
			contactPerson = {
				name: customer.name,
				email: customer.email,
				phone: customer.phone
			}
		}

		const type = (customer && customer.type) ? <p>{customer.type}</p> : null;

		const roomBookingAgreements = (customer.roomBookingAgreements) ? customer.roomBookingAgreements : [];

		return (
			<div className="container customer-single">
				<div className="row">
					<div className="col-xs-4 text-center">
						<Glyphicon 
							glyph="briefcase" 
							style={{fontSize: 'xx-large', marginTop: '16px'}}
						/>
					</div>
					<div className="col-xs-8">
						<h4>{customer.name}</h4>
						<div className="customer-status">
							{type}
						</div>
					</div>
				</div>
				<hr />
				<div className="row">
					<div className="text-right">
						<div className="col-xs-12">
							{contactPerson.name}
						</div>
						<div className="col-xs-12">
							<a style={{textDecoration: 'underline'}} href={`mailto:${contactPerson.email}`}>{contactPerson.email}</a>
						</div>
						<div className="col-xs-12">
							<a style={{textDecoration: 'underline'}} href={`tel:${contactPerson.phone}`}>{contactPerson.phone}</a>
						</div>
					</div>
				</div>
				<hr />
				<div className="row">
					<div className="col-xs-10">
						<h4>Room booking agreements</h4>
					</div>
					<div className="col-xs-2 text-right">
						<Glyphicon 
							onClick={this.addRoomBookingAgreement.bind(this)}
							glyph="plus"
							className="plus hover"
							style={{marginTop: '12px'}}
						/>
					</div>
				</div>

				<div className="spacer-10"></div>

				{roomBookingAgreements.map((agreement) => {
					return (
						<div key={agreement._id}>
							<RoomBookingAgreementRow agreement={agreement} onClick={this.removeRoomBookingAgreement.bind(this, agreement._id)} />
						</div>
					);
				})}

				<hr />

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
	Meteor.subscribe('allRooms');
	Meteor.subscribe('customerInvoices', props.params.customerId);
	Meteor.subscribe('customerUsers', props.params.customerId);

	return {
		customer: CustomersCollection.find({_id: props.params.customerId}).fetch()[0],
		rooms: Rooms.find().fetch(),
		// invoices: Invoices.find().fetch(),
		// Restricting again here, in addidtion to in publish since Meteor.userId is already published and logged in user might not be a user of this customer if he/she is an admin
		users: Meteor.users.find({"customers.id": props.params.customerId}).fetch()
	};
})(CustomerSingle);