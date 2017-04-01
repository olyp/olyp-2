import React, {Component} from 'react';
import { Link, browserHistory } from 'react-router';

class ResetPassword extends Component {

	handleKeyPress (event) {
		if(event.key == 'Enter'){
			this.handleSubmit();
		}
	}

	handleSubmit () {

		const newPassword = this.refs.password.value;
		const token = this.props.params.token;

		check(newPassword, String);
		check(token, String);

		Accounts.resetPassword(token, newPassword, (err, res) => {
			if (err) {
				Bert.alert(err.reason, 'danger', 'growl-bottom-right', 'fa-frown-o');
			} else {
				browserHistory.push('/secure');
			}
		})

	}

	render () {
		return (
			<div className="login-layout container text-center" onKeyPress={this.handleKeyPress.bind(this)}>

				<h1>New Password</h1>
			
				<h4>Password</h4>
				
				<div className="row">
					<div className="col-xs-8 col-xs-offset-2">
						<input ref="password" type="password" />
					</div>
				</div>

				<div className="row">
					<div className="col-xs-8 col-xs-offset-2">
						<h4 id="login-button" className="hover" onClick={this.handleSubmit.bind(this)}>Save</h4>
					</div>
				</div>

				<Link to="/login">Login</Link>

				<div className="spacer-10"></div>

				<Link to="/signup">Signup</Link>
		
			</div>
		);
	}
}

export default ResetPassword;