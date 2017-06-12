import React, { Component } from 'react';
import { browserHistory, Link } from 'react-router';

class MenuContent extends Component {

	render () {

		const isOlypAdmin = Roles.userIsInRole(Meteor.userId(), ['super-admin', 'admin'], 'olyp') ? 
			<div>
				<h1 className="hover" onClick={() => {this.props.onLinkClick('/secure/users')}}><a>Users</a></h1>
				<br />
				<h1 className="hover" onClick={() => {this.props.onLinkClick('/secure/customers')}}>Customers</h1>
				<br />
				<h1 className="hover" onClick={() => {this.props.onLinkClick('/secure/rooms')}}>Rooms</h1>
				<br />
				<h1 className="hover" onClick={() => {this.props.onLinkClick('/secure/codes')}}>Door Codes</h1>
				<hr />
			</div> : null;

		const content = Meteor.userId() ?
			<div>
				<h1 className="hover" onClick={() => {this.props.onLinkClick('/secure')}}>Dashboard</h1>
				<hr />
				<h1 className="hover" onClick={() => {this.props.onLinkClick('/secure/booking')}}>Booking</h1>
				<br />
				<h1 className="hover" onClick={() => {this.props.onLinkClick('/secure/profile')}}>Profile</h1>
				<hr />
				{isOlypAdmin}
				<h1 className="hover" onClick={() => {this.props.onLinkClick('/')}}>About OLYP</h1>
				<hr />
				<h1 className="hover" onClick={() => {Meteor.logout()}}>Log out</h1>
			</div> :
			<div>
				<h1 className="hover" onClick={() => {this.props.onLinkClick('/')}}>About</h1>
				<br />
				<a href="https://me.olyp.no">
					<h1 className="hover">Book Room</h1>
				</a>
				<br />
				<h1 className="hover" onClick={() => {this.props.onLinkClick('/')}}>Contact</h1>
			</div>;


		return (
			<div id="mobile-menu-content" style={{minHeight: $(window).height()}}>
				<div className="container">
					{content}
				</div>
			</div>
		);
	}
}

export default MenuContent;