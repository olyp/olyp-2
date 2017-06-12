import React, {Component} from 'react';
import { browserHistory, Link } from 'react-router';
import { createContainer } from 'meteor/react-meteor-data';
import swal from 'sweetalert2';

// import DoorCodes from '../../../../api/collections/doorCodes.js';
import RoomsCollection from '../../../../api/collections/rooms.js';
import CustomersCollection from '../../../../api/collections/customers.js';

import AwsUpload from '../../../shared/files/awsUpload.js';
import AwsImage from '../../../shared/files/awsImage.js';
import CustomerRow from '../customers/CustomerRow';


class Profile extends Component {

	newEmail () {
		console.log('Implement change email ...');
	}

	renameUser () {

		swal({
			title: 'Change name',
			input: 'text',
			showCancelButton: true,
			inputValidator: function (value) {
				return new Promise(function (resolve, reject) {
					if (value) {
						resolve()
					} else {
						reject('You need to write something!')
					}
				})
			}
		}).then((result) => {
			Meteor.call('user.changeName', result, (err, res) => {
				if (err) {
					console.log(err);
				} else {
					Bert.alert('Name changed', 'success', 'growl-bottom-right', 'fa-smile-o');
				}
			});
		}).catch(swal.noop);
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
			title: 'Are you sure?',
			text: "You will not be able to recover this!",
			type: 'warning',
			showCancelButton: true,
			confirmButtonColor: '#3085d6',
			cancelButtonColor: '#d33',
			confirmButtonText: 'Yes, delete my user!'
		}).then(() => {
			Meteor.call('deleteUser', Meteor.userId(), (err, res) => {
				if (err) {
					console.log(err);
				} else {
					browserHistory.push('/login');
				}
			});
		// Since this is a promise, we have to catch "cancel" and say it is ok
		}).catch(swal.noop);
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


	render () {

		const user = this.props.user;
		const name = (user && user.profile && user.profile.name);
		const awsKey = (user && user.profile && user.profile.image && user.profile.image.awsKey);
		const addCustomerUrl = '/secure/addCustomer/' + Meteor.userId();

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

		const doorCode = (canAccess.length != 0 && this.props.doorCode && this.props.doorCode.code) ? this.props.doorCode.code : '';

		const email = (user && user.emails[0]) ? user.emails[0].address : null;
		const verifiedEmail = (user && user.emails[0] && user.emails[0].verified) ? <p>Verified</p> : <p onClick={this.sendVerificationEmail}>click to send verification email</p>;

		return (
			<div className="container user-profile">

				<AwsUpload 
					elementId='uploadProfilePicture'
					postUploadMethod='user.addProfilePicture'
					image 
				/>

				<div className="row">
					<div className="col-xs-4">
					
						<AwsImage 
							awsKey={awsKey}
							onClick={() => {$('#uploadProfilePicture').trigger('click')}}
							className="img-responsive"
							size='100x100'
						/>

					</div>
					<div className="col-xs-8">
						<h4 onClick={this.renameUser.bind(this)}><u>{name}</u></h4>
						<p onClick={this.newEmail.bind(this)}><u>{email}</u></p>
					</div>
				</div>

				<hr />

				{this.props.customers.map((customer) => {
					return <CustomerRow customer={customer} key={customer._id} />
				})}

				<hr />

				<div className="row">
					<Link to={addCustomerUrl}>
						<div className="col-xs-12 button-large hover">Legg til fakturamottaker</div>
					</Link>
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

				{email}
				{verifiedEmail}

				<hr />

				<input
					type="password"
					ref="oldPassword"
					placeholder="Old password ... "
				/>

				<input
					type="password"
					ref="newPassword"
					placeholder="New password ... "
				/>

				<button onClick={this.changePassword.bind(this)}>Change</button>

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

export default createContainer(() => {
	Meteor.subscribe('profile');
	// Meteor.subscribe('doorCode');
	Meteor.subscribe('userRooms');
	Meteor.subscribe('userCustomers');

	return {
		// doorCode: DoorCodes.find().fetch()[0],
		user: Meteor.users.find().fetch()[0],
		rooms: RoomsCollection.find().fetch(),
		customers: CustomersCollection.find().fetch()
	};
}, Profile);