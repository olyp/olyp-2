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
				<h1 className="hover" onClick={() => {this.props.onLinkClick('/secure/uninvoiced_bookings')}}>Uninvoiced</h1>
				<br />
				<h1 className="hover" onClick={() => {this.props.onLinkClick('/secure/invoices')}}>Invoices</h1>
				<br />
				<h1 className="hover" onClick={() => {this.props.onLinkClick('/secure/rooms')}}>Rooms</h1>
				<br />
				<h1 className="hover" onClick={() => {this.props.onLinkClick('/secure/codes')}}>Door Codes</h1>
				<hr />
			</div> : null;

		const content = Meteor.userId() ?

			// Logged in
			<div>
				<h1 className="hover" onClick={() => {this.props.onLinkClick('/secure')}}>Dashboard</h1>
				<hr />
				<h1 className="hover" onClick={() => {this.props.onLinkClick('/secure/booking')}}>Booking</h1>
				<br />
				<h1 className="hover" onClick={() => {this.props.onLinkClick('/secure/profile')}}>Profile</h1>
				<hr />
				{isOlypAdmin}
				<h1 className="hover" onClick={() => {this.props.onLinkClick('/')}}>Front page</h1>
				<hr />
				<h1 className="hover" onClick={() => {this.props.onLinkClick('/#contact-mobile')}}>Contact</h1>
				<br />
				<h1 className="hover" onClick={() => {Meteor.logout()}}>Log out</h1>
			</div> :

			// Not logged in
			<div>
				<h1 className="hover" onClick={() => {this.props.onLinkClick('/')}}>Home</h1>
				<br />
				<a href="https://me.olyp.no">
					<h1 className="hover">Book Rom</h1>
				</a>
				<br />
				<h1 className="hover" onClick={() => {this.props.onLinkClick('/#contact-mobile')}}>Contact</h1>
			</div>;


		return (

			// 121 = footer height
			<div id="mobile-menu-content" style={{minHeight: document.body.scrollHeight + 121}}>
				<div className="container">
					{content}
				</div>
			</div>
		);
	}
}

export default MenuContent;