import React, {Component} from 'react';
import {browserHistory, Link} from 'react-router';

export default class Login extends Component {

	handleKeyPress (event) {
		if(event.key == 'Enter'){
			this.handleSubmit();
		}
	}

	handleSubmit () {

		const email = this.refs.emailAddress.value;
		const password = this.refs.password.value;

		// Validate
		check(email, ValidEmail);
		check(password, String);

		// Login
		Meteor.loginWithPassword(email, password, function(err) {
			if (err) {
				Bert.alert(err.reason, 'danger', 'growl-bottom-right', 'fa-frown-o');
			} else {
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
			<div className="login-layout container text-center" onKeyPress={this.handleKeyPress.bind(this)}>

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
						<h4 id="login-button" className="hover" onClick={this.handleSubmit.bind(this)}>Login</h4>
					</div>
				</div>
				
				<div id="social-login" className="row">
					<div className="col-xs-10 col-xs-offset-1">
						<div className="col-xs-6 text-left">
							<h4 className="hover" onClick={this.loginWithFacebook.bind(this)}>Facebook</h4>
						</div>
						<div className="col-xs-6 text-right">
							<h4 className="hover" onClick={this.loginWithGoogle.bind(this)}>Google</h4>
						</div>
					</div>
				</div>

				<Link to="/forgot">Reset password</Link>

				<div className="spacer-10"></div>

				<Link to="/signup">Signup</Link>
		
			</div>
		);
	}
}