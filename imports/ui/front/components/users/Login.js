import React, {Component} from 'react';
import {browserHistory, Link} from 'react-router';

export default class Login extends Component {

	componentDidMount() {

	}

	login () {

		// Prevent reload
		// event.preventDefault();

		// Fetch data from form
		const email = this.refs.emailAddress.value;
		const password = this.refs.password.value;

		// Validate
		check(email, ValidEmail);
		check(password, String);

		// Login
		Meteor.loginWithPassword(email, password, function(error) {
			if (error) {
				alert( error.reason );
			} else {
				// send to /secure, then, if admin, they will be sent to /admin (see routes)
				browserHistory.push('/secure');
			}
		});
	}

	loginWithFacebook () {
		Meteor.loginWithFacebook({
			requestPermissions: ['public_profile', 'email']
			}, (err) => {
				if (err) {
					
					// if (err.error == 200) {
					// 	// Email already existed and integration has been given to that user
					// 	console.log('facebook-integration given to user');

					// 	Meteor.loginWithFacebook();


					// } else {
					// 	console.log(err);
					// }
			} else {
				// successful login!
				browserHistory.push('/secure');
			}
		});
	}

	loginWithGoogle () {
		Meteor.loginWithGoogle({
			requestPermissions: ['email']
			}, (err) => {
				if (err) {

					
					// if (err.error == 200) {
					// 	// Email already existed and integration has been given to that user
					// 	console.log('google-integration given to user');

					// } else {
					// 	console.log(err);
					// }
			} else {
				// successful login!
				browserHistory.push('/secure');
			}
		});
	}

	render () {
		return (
			<div id="login" className="container text-center">

				<h1>Log in</h1>
			
				<h4>Email</h4>

				<div className="row">
					<div className="col-xs-8 col-xs-offset-2">
						<input ref="emailAddress" type="email" />
					</div>
				</div>

			
					<h4>Password</h4>
				

				<div className="row">
					<div className="col-xs-8 col-xs-offset-2">
						<input ref="password" type="password" />
					</div>
				</div>

				<div className="row">
					<div className="col-xs-8 col-xs-offset-2">
						<h4 id="login-button" onClick={this.login.bind(this)}>Login</h4>
					</div>
				</div>
				
				
				<div className="row">
					<div className="col-xs-10 col-xs-offset-1">
						<div className="col-xs-6 text-left">
							<h4 onClick={this.loginWithFacebook.bind(this)}>Facebook</h4>
						</div>
						<div className="col-xs-6 text-right">
							<h4 onClick={this.loginWithGoogle.bind(this)}>Google</h4>
						</div>
					</div>
				</div>

				<div className="spacer-50"></div>

				<Link to="/forgot">Reset password</Link>

				<div className="spacer-10"></div>

				<Link to="/signup">Signup</Link>
		
			</div>
		);
	}
}