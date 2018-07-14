import React, {Component} from 'react';
import { browserHistory, Link } from 'react-router';
import { withTracker } from 'meteor/react-meteor-data';
import swal from 'sweetalert2';
import { Glyphicon, Button } from 'react-bootstrap';

import DoorCodes from '../../../../api/collections/doorCodes.js';
import RoomsCollection from '../../../../api/collections/rooms.js';
import CustomersCollection from '../../../../api/collections/customers.js';

import AwsUpload from '../../../shared/files/awsUpload.js';
import CustomerRow from '../customers/CustomerRow';
import Preloader from '../../../shared/preloader/Preloader.js';

// TODO: Customers subscription does not update when removing a customer, figure out why.


class Profile extends Component {

	newEmail () {
		console.log('Implement change email ...');
	}

	renameUser () {

		swal({
			title: 'Change name',
			html:
			    '<input id="swal-firstname" class="swal2-input" placeholder="First name">' +
			    '<input id="swal-lastname" class="swal2-input" placeholder="Last name">',
			showCancelButton: true
		}).then((result) => {

			if (result.value) {
				const firstName = $('#swal-firstname').val();
				const lastName = $('#swal-lastname').val();

				if (firstName == '' || lastName == '') {
					Bert.alert('Enter both first and last name', 'danger', 'growl-bottom-right', 'fa-frown-o');
				} else {
					Meteor.call('user.changeName', firstName, lastName, (err, res) => {
						if (err) {
							console.log(err);
						} else {
							Bert.alert('Name changed', 'success', 'growl-bottom-right', 'fa-smile-o');
						}
					});
				}
			}
		});
	}

	changePassword () {

		const oldPassword = this.refs.oldPassword.value;
		const newPassword = this.refs.newPassword.value;

		Accounts.changePassword(oldPassword, newPassword, (err, res) => {
			if (err) {
				if (err.error == 403) {
					// Wrong old password
					Bert.alert(err.reason, 'danger', 'growl-bottom-right', 'fa-warning');
				}
				this.refs.oldPassword.value = '';
				this.refs.newPassword.value = '';
			} else {
				Bert.alert('Password changed', 'success', 'growl-bottom-right', 'fa-smile-o');
				this.refs.oldPassword.value = '';
				this.refs.newPassword.value = '';
			}
		});
	}

	sendVerificationEmail () {

		Meteor.call('sendVerificationEmail', (err, res) => {
			if (err) {
				console.log(err);
			} else {
				Bert.alert('Verification email sent', 'success', 'growl-bottom-right', 'fa-smile-o');
			}
		});
	}

	deleteUser () {

		swal({
			title: 'Delete your user?',
			text: "You will not be able to recover this!",
			type: 'warning',
			showCancelButton: true,
			confirmButtonColor: '#3085d6',
			cancelButtonColor: '#d33',
			confirmButtonText: 'Yes, delete my user!'
		}).then((result) => {
			if (result.value) {
				Meteor.call('deleteUser', Meteor.userId(), (err, res) => {
					if (err) {
						console.log(err);
					} else {
						browserHistory.push('/login');
					}
				});
			}
		});
	}

	// generateDoorCode () {

	// 	Meteor.call('doorCode.add', Meteor.userId(), (err, res) => {
	// 		if (err) {
	// 			console.log(err);
	// 		} else {
	// 			Bert.alert('Code added', 'success', 'growl-bottom-right', 'fa-smile-o');
	// 		}
	// 	});

	// }

	removeCustomerFromUser (customerId) {

		swal({
			title: 'Remove customer?',
			text: "You can always add this customer again later",
			type: 'warning',
			showCancelButton: true,
			confirmButtonColor: '#3085d6',
			cancelButtonColor: '#d33',
			confirmButtonText: 'Yes, remove this customer!'
		}).then((result) => {
			if (result.value) {
				Meteor.call('user.removeCustomer', Meteor.userId(), customerId, (err, res) => {
					if (err) {
						console.log(err);
					} else {
						Bert.alert('Customer removed', 'success', 'growl-bottom-right', 'fa-smile-o');
					}
				});
			}
		});
	}

	removeFacebookConnection () {
		swal({
			title: 'Disconnect Facebook account?',
			text: "You can always reconnect your Facebook account later",
			type: 'warning',
			showCancelButton: true,
			confirmButtonColor: '#3085d6',
			cancelButtonColor: '#d33',
			confirmButtonText: 'Yes, disconnect!'
		}).then((result) => {
			if (result.value) {
				Meteor.call('user.removeFacebookConnection', (err, res) => {
					if (err) {
						console.log(err);
					} else {
						Bert.alert('Facebook disconnected', 'success', 'growl-bottom-right', 'fa-smile-o');
					}
				});
			}
		});
	}

	addFacebookConnection () {
		Meteor.loginWithFacebook({
			requestPermissions: ['public_profile', 'email']
			}, (err) => {
				if (err) {
					console.log(err);
				} else {
					Bert.alert('Facebook connected', 'success', 'growl-bottom-right', 'fa-smile-o');
				}
		});
	}

	removeGoogleConnection () {
		swal({
			title: 'Disconnect Google account?',
			text: "You can always reconnect your Google account later",
			type: 'warning',
			showCancelButton: true,
			confirmButtonColor: '#3085d6',
			cancelButtonColor: '#d33',
			confirmButtonText: 'Yes, disconnect!'
		}).then((result) => {
			if (result.value) {
				Meteor.call('user.removeGoogleConnection', (err, res) => {
					if (err) {
						console.log(err);
					} else {
						Bert.alert('Google disconnected', 'success', 'growl-bottom-right', 'fa-smile-o');
					}
				});	
			}
		});
	}

	addGoogleConnection () {
		Meteor.loginWithGoogle({
			requestPermissions: ['email']
			}, (err) => {
				if (err) {
					console.log(err);
				} else {
					Bert.alert('Google connected', 'success', 'growl-bottom-right', 'fa-smile-o');
				}
		});
	}


	render () {

		const user = this.props.user;

		if (!user) {
			return <Preloader />;	
		}

		// Have to do the following since the customers subscription does not update when removing a customer from a user
		let customers = [];

		if (user.customers) {
			user.customers.map((customer) => {
				customers.push(CustomersCollection.findOne({_id: customer.id}));
			});
		}

		const name = (user && user.profile && user.profile.firstName && user.profile.lastName) ? user.profile.firstName + ' ' + user.profile.lastName : null;
		// const awsKey = (user && user.profile && user.profile.image && user.profile.image.awsKey);
		const addCustomerUrl = '/secure/addCustomer/' + Meteor.userId();

		let imageSource = "/images/default_avatar_100x100.jpg"

		if (user.services && user.services.google) {
			imageSource = user.services.google.picture;
		}


		if (user.services && user.services.facebook) {
			imageSource = `http://graph.facebook.com/${user.services.facebook.id}/picture?type=square`;
				
		}

		if (user.profile && user.profile.image) {
			imageSource = `/images/${user.profile.image.localId}?size=100x100`;
				
		}

		const image = <img 
				src={imageSource}
				onClick={() => {$('#uploadProfilePicture').trigger('click')}}
				className="img-responsive"
			/>

		const rooms = (this.props.rooms) ? this.props.rooms : [];
		var canAccess = this.props.rooms.filter(
			(room) => {
				const userArray = (room && room.canAccess) ? room.canAccess : [];
				if (userArray.indexOf(Meteor.userId()) !== -1) {
					return true
				}
			}
		);

		var canBook = this.props.rooms.filter(
			(room) => {
				const userArray = (room && room.canBook) ? room.canBook : [];
				if (userArray.indexOf(Meteor.userId()) !== -1) {
					return true
				}
			}
		);

		const doorCode = (canAccess.length != 0 && this.props.doorCode && this.props.doorCode.code) ? 
			<div><h4><Glyphicon glyph="lock" /> {this.props.doorCode.code}</h4></div> : 
			null;

		const email = (user && user.emails[0]) ? user.emails[0].address : null;
		const verifiedEmail = (user && user.emails[0] && user.emails[0].verified) ? <Glyphicon glyph="ok" /> : <p onClick={this.sendVerificationEmail}>click to send verification email</p>;

		const facebook = (user.services && user.services.facebook) ? 
			<div onClick={this.removeFacebookConnection.bind(this)} className="col-xs-6 room-selector room-selector-active">Facebook  <Glyphicon glyph="ok" /></div> :
			<div onClick={this.addFacebookConnection.bind(this)} className="col-xs-6 room-selector room-selector-active" style={{backgroundColor: '#EA2427'}}>Connect Facebook</div>

		const google = (user.services && user.services.google) ? 
			<div onClick={this.removeGoogleConnection.bind(this)} className="col-xs-6 room-selector room-selector-active">Google  <Glyphicon glyph="ok" /></div> :
			<div onClick={this.addGoogleConnection.bind(this)} className="col-xs-6 room-selector room-selector-active" style={{backgroundColor: '#EA2427'}}>Connect Google</div>

		return (
			<div className="container user-profile">

				<AwsUpload 
					elementId='uploadProfilePicture'
					postUploadMethod='user.addProfilePicture'
					image 
				/>

				<div className="row">
					<div className="col-xs-4">

						{image}

					</div>
					<div className="col-xs-8">
						<h4 onClick={this.renameUser.bind(this)}><u>{name}</u></h4>
						<p onClick={this.newEmail.bind(this)}><u>{email}</u></p>
						{doorCode}
					</div>
				</div>

				<hr />

				<div className="row">
					<div className="col-xs-12">
						{facebook}
						{google}
					</div>
				</div>

				<hr />

				{customers.map((customer) => {

					if (customer) {
						return <CustomerRow customer={customer} key={customer._id} onClick={this.removeCustomerFromUser.bind(this, customer._id) } />
					}

				})}

				<hr />

				<div className="row">
					<div className="col-xs-12">
						<Link to={addCustomerUrl}>
							<div className="button-large hover">Add invoice receiver</div>
						</Link>
					</div>
				</div>

				<hr />

				<h4>Can Book:</h4>

				<div className="row">

					{canBook.map((room) => {
						return (
							<div 
								key={room._id}
								className="room-selector col-xs-4 room-selector-active"
							>
								{room.name}
							</div>
						);
					})}
				</div>

				<hr />

				<h4>Can Access:</h4>

				<div className="row">

					{canAccess.map((room) => {
						return (
							<div 
								key={room._id}
								className="room-selector col-xs-4 room-selector-active"
							>
								{room.name}
							</div>
						);
					})}
				</div>

				<hr />

				{email} - {verifiedEmail}

				<hr />

				<div className="row">

					<div className="col-xs-12">

						<input
							type="password"
							ref="oldPassword"
							placeholder="Old password ... "
						/>
					</div>
				</div>

				<br />
				<div className="row">

					<div className="col-xs-12">
						<input
							type="password"
							ref="newPassword"
							placeholder="New password ... "
						/>
					</div>
				</div>

				<br />

				<div className="row">
					<div className="col-xs-12">
						<div className="button-large hover" onClick={this.changePassword.bind(this)}>Change</div>
					</div>
				</div>

				<hr />

				<div className="row">
					<div className="col-xs-12">
						<div className="delete-large" onClick={this.deleteUser.bind(this)}>
      						Delete my user
    					</div>
					</div>
				</div>

				<hr />

			</div>
		);
	}
}

export default withTracker(() => {
	Meteor.subscribe('profile');
	Meteor.subscribe('doorCode');
	Meteor.subscribe('userRooms');
	Meteor.subscribe('userCustomers');

	return {
		doorCode: DoorCodes.find().fetch()[0],
		user: Meteor.users.find().fetch()[0],
		rooms: RoomsCollection.find().fetch(),
		customers: CustomersCollection.find().fetch()
	};
})(Profile);