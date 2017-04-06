import React, {Component} from 'react';
import { browserHistory, Link } from 'react-router';

export default class Forgot extends Component {

	handleKeyPress (event) {
		if(event.key == 'Enter'){
			this.handleSubmit();
		}
	}

	handleSubmit () {

		const email = this.refs.emailAddress.value;

		check(email, ValidEmail);

		var options = {
			'email': email
		};

		// Send reset mail
		Accounts.forgotPassword(options, function(err) {
			if (err) {
				Bert.alert(err.reason, 'danger', 'growl-bottom-right', 'fa-frown-o');
			} else {
				Bert.alert('Reset email sendt', 'success', 'growl-bottom-right', 'fa-smile-o');
				browserHistory.push('/login');
			}
		})
	}

	render () {
		return (
			<div className="login-layout container text-center" onKeyPress={this.handleKeyPress.bind(this)}>

				<h1>Forgot Password</h1>
			
				<h4>Email</h4>

				<div className="row">
					<div className="col-xs-8 col-xs-offset-2">
						<input ref="emailAddress" type="email" />
					</div>
				</div>


				<div className="row">
					<div className="col-xs-8 col-xs-offset-2">
						<h4 id="login-button" className="hover" onClick={this.handleSubmit.bind(this)}><u>Send reset email</u></h4>
					</div>
				</div>

				<Link to="/login"><u>Login</u></Link>

				<div className="spacer-10"></div>

				<Link to="/signup"><u>Signup</u></Link>
		
			</div>
		);
	}
}