import React, {Component} from 'react';
import { browserHistory } from 'react-router';

export default class InviteSignUp extends Component {

	componentDidMount() {
		
	}

	handleSubmit (event) {

		// Prevent reload
		event.preventDefault();

		// Fetch data from form
		const email = this.props.location.query.email;
		const firstName = this.refs.firstName.value;
		const lastName = this.refs.lastName.value;
		const password = this.refs.password.value;
		const token = this.props.params.token;

		// Validate

		check(email, ValidEmail);
		check(firstName, String);
		check(lastName, String);
		check(password, String);
		check(token, String);

		// Make user object

		let user = {
			'email': email,
			'firstName': firstName,
			'lastName': lastName,
			'password': Accounts._hashPassword(password),
			'token': token
		}

		// Check token (creating user and giving role 'invited' in method if token matches)

		Meteor.call('createInvitedUser', user, function(error) {
			if (error) {
				alert(error.reason);
			} else {
				Meteor.loginWithPassword(user.email, password, function(error) {
					if (error) {
						alert( error.reason );
					} else {
						browserHistory.push('/secure');
					}
				});
			}
		});
	}

	render () {
		return (
			<div className="signup container">
				<h2>Sign up</h2>


				<div className="row">
					<form className="col s12" onSubmit={ this.handleSubmit.bind(this) }>
						<div className="row">
							<div className="input-field col s6">
								<input ref="firstName" id="first_name" type="text" className="validate" />
								<label htmlFor="first_name">First Name</label>
							</div>
							<div className="input-field col s6">
								<input ref="lastName" id="last_name" type="text" className="validate" />
								<label htmlFor="last_name">Last Name</label>
							</div>
						</div>

						<div className="row">
							<div className="input-field col s12">
								<input disabled ref="emailAddress" id="email" type="email" className="validate" defaultValue={ this.props.location.query.email }/>
								<label htmlFor="email">Email</label>
							</div>
						</div>
						<div className="row">
							<div className="input-field col s12">
								<input ref="password" id="password" type="password" className="validate" />
								<label htmlFor="password">Password</label>
							</div>
						</div>
						<button className="btn grey waves-effect waves-light" type="submit">Sign up</button>
					</form>
					<p>Already registered? <a href="/login">Log In</a>.</p>
				</div>
			</div>
		);
	}
}