import React, {Component} from 'react';
import { browserHistory } from 'react-router';
import { createContainer } from 'meteor/react-meteor-data';
import swal from 'sweetalert2';

import DoorCodes from '../../../../api/collections/doorCodes.js';

class Profile extends Component {

	constructor(props) {
		super(props);
		this.state = {
			name: ''
		}
	}

	save (e) {

		Meteor.call('changeUserName', this.state.name, (err, res) => {
			if (err) {
				console.log(err);
			} else {
				Bert.alert('Name changed', 'success', 'growl-bottom-right', 'fa-smile-o');
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

	generateDoorCode () {

		Meteor.call('doorCode.add', Meteor.userId(), (err, res) => {
			if (err) {
				console.log(err);
			} else {
				Bert.alert('Code added', 'success', 'growl-bottom-right', 'fa-smile-o');
			}
		});

	}


	render () {

		const user = this.props.user[0];
		const doorCode = (this.props.doorCode && this.props.doorCode.code) ? this.props.doorCode.code : '';

		const email = (user && user.emails[0]) ? user.emails[0].address : null;
		const verifiedEmail = (user && user.emails[0] && user.emails[0].verified) ? <p>Verified</p> : <p onClick={this.sendVerificationEmail}>click to send verification email</p>;

		return (
			<div className="container">
				<h2>Profile</h2>

				<input
					type="text"
					onChange={(e) => {this.setState({name: e.target.value})}}
					// If this.state.name is empty, then check if any the ones in the () exists, if they do, then return the last value, if not, return '' 
					value={this.state.name || (user && user.profile && user.profile.name) || ''}
				/>

				<button onClick={this.save.bind(this)}>Save</button>

				<hr />

				<button onClick={this.generateDoorCode.bind(this)}>Generate new door code</button>

				{doorCode}

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

				<div className="deleteFieldBig" onClick={this.deleteUser.bind(this)}>
					<h4>Delete my user</h4>
				</div>

			</div>
		);
	}
}

export default createContainer(() => {
	Meteor.subscribe('profile');
	Meteor.subscribe('doorCode');

	return {
		doorCode: DoorCodes.find().fetch()[0],
		user: Meteor.users.find().fetch(),
	};
}, Profile);