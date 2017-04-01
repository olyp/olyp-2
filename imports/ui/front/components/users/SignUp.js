import React, {Component} from 'react';
import {browserHistory, Link} from 'react-router';

export default class SignUp extends Component {

	handleKeyPress (event) {
		if(event.key == 'Enter'){
			this.handleSubmit();
		}
	}

	handleSubmit () {

		const email = this.refs.emailAddress.value;
		const firstName = this.refs.firstName.value;
		const lastName = this.refs.lastName.value;
		const password = this.refs.password.value;


		// Validate

		check(email, ValidEmail);
		check(firstName, String);
		check(lastName, String);
		check(password, String);

		// Make user object

		let user = {
			'email': email,
			'firstName': firstName,
			'lastName': lastName,
			'password': Accounts._hashPassword(password)
		}

		// Check token (creating user and giving role 'invited' in method if token matches)

		Meteor.call('createStandardUser', user, function(err) {
			if (err) {
				Bert.alert(err.reason, 'danger', 'growl-bottom-right', 'fa-frown-o');
			} else {
				Meteor.loginWithPassword(user.email, password, function(err) {
					if (err) {
						Bert.alert(err.reason, 'danger', 'growl-bottom-right', 'fa-frown-o');
					} else {
						browserHistory.push('/secure');
					}
				});
			}
		});
	}

	render () {
		return (
			<div className="login-layout container text-center" onKeyPress={this.handleKeyPress.bind(this)}>

				<h1>Sign Up</h1>

				<h4>First Name</h4>

				<div className="row">
					<div className="col-xs-8 col-xs-offset-2">
						<input ref="firstName" type="text" />
					</div>
				</div>

				<h4>Last Name</h4>

				<div className="row">
					<div className="col-xs-8 col-xs-offset-2">
						<input ref="lastName" type="text" />
					</div>
				</div>
			
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
						<h4 id="login-button" className="hover" onClick={this.handleSubmit.bind(this)}>Sign Up</h4>
					</div>
				</div>

				<Link to="/forgot">Reset password</Link>

				<div className="spacer-10"></div>

				<Link to="/login">Login</Link>
		
			</div>
		);
	}
}