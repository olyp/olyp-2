import React from 'react';
import ReactDOM from 'react-dom';
import {Router, Route, IndexRoute, browserHistory} from 'react-router';


import FrontLayout from '../imports/ui/front/components/FrontLayout.js';
import SecureLayout from '../imports/ui/secure/components/SecureLayout.js';

// ADMIN
import Dashboard from '../imports/ui/secure/components/Dashboard.js';
import CodesAll from '../imports/ui/secure/components/codes/CodesAll.js';
import Profile from '../imports/ui/secure/components/profile/Profile.js';
import Booking from '../imports/ui/secure/components/booking/Booking'

// FRONT
import Home from '../imports/ui/front/components/pages/Home.js';

// ACCOUNT

import Login from '../imports/ui/front/components/users/Login.js';
import InviteSignUp from '../imports/ui/front/components/users/InviteSignUp.js';
import Forgot from '../imports/ui/front/components/users/Forgot.js';
import SignUp from '../imports/ui/front/components/users/SignUp.js';
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

		<Route path="/" component={Home}></Route>

		<Route path="/login" component={Login} onEnter={isLoggedIn}></Route>
		<Route path="/invite/:token" component={InviteSignUp}></Route>
		<Route path="/forgot" component={Forgot}></Route>
		<Route path="/signup" component={SignUp}></Route>

		<Route path="/secure" component={SecureLayout} onEnter={authenticateSecure}>
			<IndexRoute component={Dashboard} />
			<Route path="booking" component={Booking} />		
			<Route path="codes" component={CodesAll} />
			<Route path="profile" component={Profile} />
		</Route>

	</Router>
);

Meteor.startup( () => {
	ReactDOM.render(routes, document.getElementById('render-target'));
});