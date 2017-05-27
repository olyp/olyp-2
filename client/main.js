import React from 'react';
import ReactDOM from 'react-dom';
import {Router, Route, IndexRoute, browserHistory} from 'react-router';

// LAYOUTS
import FrontLayout from '../imports/ui/front/components/FrontLayout.js';
import LoginLayout from '../imports/ui/front/components/LoginLayout.js';
import SecureLayout from '../imports/ui/secure/components/SecureLayout.js';

// SECURE
import Dashboard from '../imports/ui/secure/components/Dashboard.js';
import DoorCodes from '../imports/ui/secure/components/codes/DoorCodes.js';
import Profile from '../imports/ui/secure/components/profile/Profile.js';
import Booking from '../imports/ui/secure/components/booking/Booking.js';
import Users from '../imports/ui/secure/components/users/Users.js';
import UserSingle from '../imports/ui/secure/components/users/UserSingle.js';
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

	// If no user, send to login
	if (!Roles.userIsInRole(Meteor.userId(), ['super-admin', 'admin'], 'olyp')) {
		replace({
			pathname: '/secure',
			state: { nextPathname: nextState.location.pathname },
		});
	}
	callback();
	
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



const routes = (
	<Router history={browserHistory}>

		<Route path="/" component={FrontLayout}>
			<IndexRoute component={Home} />	
		</Route>

		<Route path="/secure" component={SecureLayout} onEnter={authenticateSecure}>
			<IndexRoute component={Dashboard} />
			<Route path="booking" component={Booking} />		
			<Route path="codes" component={DoorCodes} />
			<Route path="profile" component={Profile} />

			<Route path="users" component={Users} onEnter={authenticateAdmin} />
			<Route path="users/:userId" component={UserSingle} onEnter={authenticateAdmin} />
			<Route path="rooms" component={Rooms} onEnter={authenticateAdmin} />
			<Route path="rooms/:roomId" component={RoomSingle} onEnter={authenticateAdmin} />

			<Route path="upload" component={awsUpload} />
		</Route>

		<Route component={LoginLayout}>
			<Route path="/login" component={Login} onEnter={isLoggedIn}></Route>
			<Route path="/forgot" component={Forgot}></Route>
			<Route path="/signup" component={SignUp}></Route>
			<Route path="/resetPassword/:token" component={ResetPassword}></Route>
		</Route>

	</Router>
);

Meteor.startup( () => {
	ReactDOM.render(routes, document.getElementById('render-target'));
});