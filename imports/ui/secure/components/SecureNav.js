import React, {Component} from 'react';
import {Link} from 'react-router';
import { createContainer } from 'meteor/react-meteor-data';

import AccountsUI from '../../AccountsUI.js';

class SecureNav extends Component {
	render() {

		const userId = (this.props.user) ? this.props.user._id : '';

		const canManageUsers = Roles.userIsInRole(userId, ['super-admin', 'admin'], 'manage-users') ? <li><Link to="/secure/users">Users</Link></li> : '';
		const canEditDoorCodes = Roles.userIsInRole(userId, ['super-admin', 'admin'], 'booking') ? <li><Link to="/secure/codes">Door Codes</Link></li> : '';

		return (
			<nav className="navbar navbar-default">
				<div className="container-fluid">

					<div className="navbar-header">
						<button type="button" className="navbar-toggle collapsed" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1" aria-expanded="false">
							<span className="sr-only">Toggle navigation</span>
							<span className="icon-bar"></span>
							<span className="icon-bar"></span>
							<span className="icon-bar"></span>
						</button>
						<Link className="navbar-brand" to="/">
							OLYP Secure
						</Link>
					</div>

					<div className="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
						<AccountsUI />

						<ul className="nav navbar-nav navbar-right">
							<li><Link to="/secure">Dashboard</Link></li>
							{canManageUsers}
							{canEditDoorCodes}
							<li><Link to="/secure/booking">Booking</Link></li>
							<li><Link to="/secure/profile">Profile</Link></li>
						</ul>
					</div>
				</div>
			</nav>
		);
	}
}

export default createContainer(() => {
	Meteor.subscribe('profile');

	return {
		user: Meteor.users.find().fetch()[0]
	};
}, SecureNav);