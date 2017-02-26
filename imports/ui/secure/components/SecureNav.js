import React, {Component} from 'react';
import {Link} from 'react-router';
import AccountsUI from '../../AccountsUI.js';

export default class SecureNav extends Component {
	render() {
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
							<li><Link to="/secure/users">Users</Link></li>
							<li><Link to="/secure/booking">Booking</Link></li>
							<li><Link to="/secure/codes">Door Codes</Link></li>
							<li><Link to="/secure/profile">Profile</Link></li>
						</ul>
					</div>
				</div>
			</nav>
		);
	}
}