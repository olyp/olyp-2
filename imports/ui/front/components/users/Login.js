import React, {Component} from 'react';
import {browserHistory, Link} from 'react-router';

import Preloader from '../../../shared/preloader/Preloader.js';

export default class Login extends Component {
	constructor(props) {
		super(props);
		this.state = {
			loading: false
		}
	}

	handleKeyPress (event) {
		if(event.key == 'Enter'){
			this.handleSubmit();
		}
	}

	handleSubmit () {

		this.setState({
			loading: true
		});

		const email = this.refs.emailAddress.value;
		const password = this.refs.password.value;

		// Validate
		check(email, ValidEmail);
		check(password, String);

		// Login
		Meteor.loginWithPassword(email, password, (err) => {
			if (err) {
				this.setState({
					loading: false
				});
				Bert.alert(err.reason, 'danger', 'growl-bottom-right', 'fa-frown-o');
			} else {
				this.setState({
					loading: false
				});
				browserHistory.push('/secure');
			}
		});
	}

	loginWithFacebook () {

		this.setState({
			loading: true
		});

		Meteor.loginWithFacebook({
			requestPermissions: ['public_profile', 'email']
			}, (err) => {
				if (err) {
					this.setState({
						loading: false
					});
					// if (err.error == 200) {
					// 	// Email already existed and integration has been given to that user
					// 	console.log('facebook-integration given to user');

					// 	Meteor.loginWithFacebook();


					// } else {
					// 	console.log(err);
					// }
			} else {
				// successful login!
				this.setState({
					loading: false
				});

				browserHistory.push('/secure');
			}
		});
	}

	loginWithGoogle () {
		this.setState({
			loading: true
		});
		Meteor.loginWithGoogle({
			requestPermissions: ['email']
			}, (err) => {
				if (err) {

					this.setState({
						loading: false
					});
					// if (err.error == 200) {
					// 	// Email already existed and integration has been given to that user
					// 	console.log('google-integration given to user');

					// } else {
					// 	console.log(err);
					// }
			} else {
				// successful login!
				this.setState({
					loading: false
				});
				browserHistory.push('/secure');
			}
		});
	}

	render () {

		if (this.state.loading) {
			return (
				<Preloader />
			);
		}

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
						<h4 id="login-button" className="hover" onClick={this.handleSubmit.bind(this)}><u>Login</u></h4>
					</div>
				</div>
				
				<div id="social-login" className="row">
					<div className="col-xs-8 col-xs-offset-2">
						<div className="row">
							<div className="col-xs-6 text-left">
								<h4 className="hover" onClick={this.loginWithFacebook.bind(this)}><u>Facebook</u></h4>
							</div>
							<div className="col-xs-6 text-right">
								<h4 className="hover" onClick={this.loginWithGoogle.bind(this)}><u>Google</u></h4>
							</div>
						</div>
					</div>
				</div>

				<Link to="/forgot"><u>Reset password</u></Link>

				<div className="spacer-10"></div>

				<Link to="/signup"><u>Signup</u></Link>
		
			</div>
		);
	}
}