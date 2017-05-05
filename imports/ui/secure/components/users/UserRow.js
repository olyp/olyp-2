import React, {Component} from 'react';
import { Link } from 'react-router';
import swal from 'sweetalert2';

import AwsImage from '../../../shared/files/awsImage.js';

export default class UserRow extends Component {

	constructor(props) {
		super(props);
		this.state = {
			internalPrice: false,
			manageUsers: false,
			bookingAdmin: false
		}
	}

	deleteUser () {
		swal({
			title: 'Are you sure?',
			text: "You will not be able to recover this user!",
			type: 'warning',
			showCancelButton: true,
			confirmButtonColor: '#3085d6',
			cancelButtonColor: '#d33',
			confirmButtonText: 'Yes, delete it!'
		}).then(() => {
			Meteor.call('deleteUser', this.props.user._id, (err, res) => {
				if (err) {
					console.log(err);
				} else {
					Bert.alert('User deleted', 'success', 'growl-bottom-right', 'fa-smile-o');
				}
			});
		// Since this is a promise, we have to catch "cancel" and say it is ok
		}).catch(swal.noop);
	}

	toggleManageUsers () {
		Meteor.call('toggleManageUsers', this.props.user._id);
	}

	toggleBookingAdmin () {
		Meteor.call('toggleBookingAdmin', this.props.user._id);
	}

	render () {
		const user = this.props.user;
		const profile = user.profile;
		const email = (user && user.emails && user.emails[0]) ? user.emails[0].address : '';
		const url = '/secure/users/' + user._id;
		const awsKey = (user && user.profile && user.profile.image && user.profile.image.awsKey);

		const isOnline = (user && user.status && user.status.online) ? <p>online</p> : null;
		const isAdmin = (user && Roles.userIsInRole(user._id, ['super-admin', 'admin'], 'olyp')) ? <p>admin</p> : null;

		return (
			<Link to={url}>
				<div className="row">
					<div className="col-xs-4">
						<AwsImage 
							awsKey={awsKey}
							className="img-responsive"
							size='100x100'
						/>
					</div>
					<div className="col-xs-8">
						<h4>{profile.name}</h4>
						<p>{email}</p>
						<div className="user-status">
							{isOnline}
							{isAdmin}
						</div>
					</div>
					
				</div>
			</Link>
		);
	}
}