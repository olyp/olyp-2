import React from 'react';
import ReactDOM from 'react-dom';
import {Router, Route, IndexRoute, browserHistory} from 'react-router';


import FrontLayout from './front/components/FrontLayout.js';
import SecureLayout from './secure/components/SecureLayout.js';

// ADMIN
import Dashboard from './secure/components/Dashboard.js';
import CodesAll from './secure/components/codes/CodesAll.js';
import Profile from './secure/components/profile/Profile.js';

// FRONT
import Home from './front/components/pages/Home.js';

// ACCOUNT

import Login from './front/components/users/Login.js';
import InviteSignUp from './front/components/users/InviteSignUp.js';
import Forgot from './front/components/users/Forgot.js';
import SignUp from './front/components/users/SignUp.js';
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
			<Route path="codes" component={CodesAll} />
			<Route path="profile" component={Profile} />
		</Route>

	</Router>
);

Meteor.startup( () => {
	ReactDOM.render(routes, document.querySelector('.render-target'));
});