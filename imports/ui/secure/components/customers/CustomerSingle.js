import React, { Component } from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import { browserHistory } from 'react-router';
import swal from 'sweetalert2';

import RoomsCollection from '../../../../api/collections/rooms.js'
import CustomersCollection from '../../../../api/collections/customers.js'
// import DoorCodes from '../../../../api/collections/doorCodes.js'

import Preloader from '../../../shared/preloader/Preloader.js';
import AwsImage from '../../../shared/files/awsImage.js';

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

	toggleBookingAccessToRoom(roomId) {
		Meteor.call('room.toggleCustomerBookingAccess', roomId, this.props.customer._id, (err, res) => {
			if (err) {
				console.log(err);
			} 
		});
	}

	// toggleAccessToRoom(roomId) {
	// 	Meteor.call('room.toggleUserAccess', roomId, this.props.user._id, (err, res) => {
	// 		if (err) {
	// 			console.log(err);
	// 		} 
	// 	});
	// }

	// toggleIsAdmin() {
	// 	Meteor.call('user.toggleIsAdmin', this.props.user._id, (err, res) => {
	// 		if (err) {
	// 			console.log(err);
	// 		} 
	// 	});
	// }

	// editDoorCode () {
	// 	console.log('Editing door code ...');
	// }

	render () {

		const customer = (this.props.customer) ? this.props.customer : null;
		const name = (customer && customer.name);
		// const email = (user && user.emails && user.emails[0] && user.emails[0].address);
		// const doorCode = (this.props.doorCode) ? this.props.doorCode.code : 'Generate';
		// const isAdminClass = (user && Roles.userIsInRole(user._id, ['super-admin', 'admin'], 'olyp')) ? 'room-selector-active': '';
		// const awsKey = (user && user.profile && user.profile.image && user.profile.image.awsKey);

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
						<h4>{name}</h4>
					</div>
				</div>

				<hr />

				<h4>Can Book:</h4>

				<div className="row">

					{this.props.rooms.map((room) => {

						const customerId = customer._id;
						const activeClass = (room.canBook && room.canBook.indexOf(customerId) != -1) ? 'room-selector-active' : '';

						return (
							<div 
								key={room._id} 
								className={`room-selector col-xs-4 hover ${activeClass}`}
								onClick={() => {this.toggleBookingAccessToRoom(room._id)}}
							>
								{room.name}
							</div>
						);
					})}
			
				</div>

				<hr />

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

export default createContainer((props) => {
	Meteor.subscribe('allUsers');
	Meteor.subscribe('allRooms');
	Meteor.subscribe('allCustomers');

	const customer = CustomersCollection.find({_id: props.params.customerId}).fetch();

	return {
		customer: customer[0],
		rooms: RoomsCollection.find().fetch()
	};
}, CustomerSingle);