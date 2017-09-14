import React from 'react';
import ReactDOM from 'react-dom';
import {Router, Route, IndexRoute, browserHistory} from 'react-router';

// LAYOUTS
import FrontLayout from '../imports/ui/front/components/FrontLayout.js';
// import LoginLayout from '../imports/ui/front/components/LoginLayout.js';
import SecureLayout from '../imports/ui/secure/components/SecureLayout.js';

// SECURE
import Dashboard from '../imports/ui/secure/components/Dashboard.js';
import DoorCodes from '../imports/ui/secure/components/codes/DoorCodes.js';
import Profile from '../imports/ui/secure/components/profile/Profile.js';
import Booking from '../imports/ui/secure/components/booking/Booking.js';
import Users from '../imports/ui/secure/components/users/Users.js';
import UserSingle from '../imports/ui/secure/components/users/UserSingle.js';
import Customers from '../imports/ui/secure/components/customers/Customers.js';
import CustomerSingle from '../imports/ui/secure/components/customers/CustomerSingle.js';
import CustomerAdd from '../imports/ui/secure/components/customers/CustomerAdd.js';
import CustomerRoomAgreement from '../imports/ui/secure/components/customers/CustomerRoomAgreement.js';
import Invoices from '../imports/ui/secure/components/invoices/Invoices';
import Rooms from '../imports/ui/secure/components/rooms/Rooms.js';
import RoomSingle from '../imports/ui/secure/components/rooms/RoomSingle.js';

import awsUpload from '../imports/ui/shared/files/awsUpload.js';

// FRONT
import Home from '../imports/ui/front/components/pages/Home.js';

// ACCOUNT
import Login from '../imports/ui/front/components/users/Login.js';
import SignUp from '../imports/ui/front/components/users/SignUp.js';
import Forgot from '../imports/ui/front/components/users/Forgot.js';
import ResetPassword from '../imports/ui/front/components/users/ResetPassword.js';

// ACCOUNT ROUTES

// Redirect to '/' on logout, uses gwendall:accounts-helpers
Accounts.onLogout(function() {
	browserHistory.push('/login');
});

// AUTH LOGIC
const authenticateSecure = (nextState, replace, callback) => {

	// If no user, send to login
	if (!Meteor.loggingIn() && !Meteor.userId()) {
		replace({
			pathname: '/login',
			state: { nextPathname: nextState.location.pathname },
		});
	}
	callback();
};

const authenticateAdmin = (nextState, replace, callback) => {
	Meteor.subscribe("rolesIsReady", function () {
		if (!Roles.userIsInRole(Meteor.userId(), ['super-admin', 'admin'], 'olyp')) {
			replace({
				pathname: '/secure',
				state: { nextPathname: nextState.location.pathname },
			});
		}

		callback();
	});
};

const isLoggedIn = (nextState, replace, callback) => {
	
	// If user is logged in, send to /secure
	if (Meteor.userId()) {
		replace({
			pathname: '/secure',
			state: { nextPathname: nextState.location.pathname },
		});
	}
	callback();
}

// To be able to use hash links
function hashLinkScroll() {
	const { hash } = window.location;
	if (hash !== '') {
		// Push onto callback queue so it runs after the DOM is updated,
		// this is required when navigating from a different page so that
		// the element is rendered on the page before trying to getElementById.
		setTimeout(() => {
			const id = hash.replace('#', '');
			const element = document.getElementById(id);
			if (element) {
				element.scrollIntoView();
			}
		}, 0);
	}
}

const routes = (
	<Router history={browserHistory} onUpdate={hashLinkScroll}>

		<Route path="/" component={FrontLayout}>
			<IndexRoute component={Home} name="HOME"/>

			<Route path="/login" name="LOGIN" component={Login} onEnter={isLoggedIn}></Route>
			<Route path="/forgot" name="FORGOT" component={Forgot}></Route>
			<Route path="/signup" name="SIGNUP" component={SignUp}></Route>
			<Route path="/resetPassword/:token" name="RESET" component={ResetPassword}></Route>
		</Route>

		<Route path="/secure" component={SecureLayout} onEnter={authenticateSecure}>
			<IndexRoute component={Dashboard} name="SECURE" />

			<Route path="booking" name="BOOKING" component={Booking} />		
			<Route path="codes" name="CODES" component={DoorCodes} />
			<Route path="profile" name="PROFILE" component={Profile} />

			<Route path="users" name="USERS" component={Users} />
			<Route path="users/:userId" name="USER" component={UserSingle} />

			<Route path="customers" name="CUSTOMER" component={Customers} />
			<Route path="customers/:customerId" name="CUSTOMER" component={CustomerSingle} />
			<Route path="invoices" name="INVOICE" component={Invoices} />
			<Route path="addCustomer" name="ADD CUSTOMER" component={CustomerAdd} />
			<Route path="addCustomer/:userId" name="ADD CUSTOMER" component={CustomerAdd} />
			<Route path="editCustomerRoomAgreement/:customerId/:roomId" name="EDIT CUSTOMER" component={CustomerRoomAgreement} />

			<Route path="rooms" name="ROOMS" component={Rooms} />
			<Route path="rooms/:roomId" name="ROOM" component={RoomSingle} />

			<Route path="upload" name="UPLOAD" component={awsUpload} />
		</Route>

	</Router>
);

Meteor.startup( () => {
	ReactDOM.render(routes, document.getElementById('render-target'));
});