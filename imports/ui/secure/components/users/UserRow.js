import React, {Component} from 'react';
import { Link } from 'react-router';
import swal from 'sweetalert2';

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
		const online = (user && user.status && user.status.online) ? <span>Online</span> : '';
		const url = '/secure/users/' + user._id;

		return (
			<Link to={url}>
				<div className="row">
					<div className="col-xs-4">
						<img src="http://eng.icrconference.org/wp-content/uploads/2016/04/blank.gif" />
					</div>
					<div className="col-xs-8">
						<h4>{profile.name}</h4>
						<p>{email}</p>
					</div>
				</div>
			</Link>
		);

		// Old

		return (
			<div className="row user-row">
				<div className="col-xs-3">
					{profile.name}
				</div>
				<div className="col-xs-3">
					{email}
				</div>
				<div className="col-xs-4">
					<div className="row">

						<div className="col-xs-7">
							<div className="checkbox">
								<label>
									<input
						            	type="checkbox"
						            	readOnly
						            	checked={Roles.userIsInRole(user._id, ['admin', 'super-admin'], 'manage-users')}
						             	onClick={this.toggleManageUsers.bind(this)}
						            />
						            Manage users
						        </label>
						    </div>
						</div>

						<div className="col-xs-5">
							<div className="checkbox">
								<label>
									<input
						            	type="checkbox"
						            	readOnly
						            	checked={Roles.userIsInRole(user._id, ['admin', 'super-admin'], 'booking')}
						             	onClick={this.toggleBookingAdmin.bind(this)}
						            />
						            Admin
								</label>
							</div>
						</div>

					</div>
				</div>
				<div className="col-xs-2 text-right">
					<div className="row">
						<div className="col-xs-6">
							{online}
						</div>
						<div className="col-xs-6">
							<button className="delete" onClick={this.deleteUser.bind(this)}>
          						X
        					</button>
						</div>
					</div>
				</div>
			</div>
		);
	}
}