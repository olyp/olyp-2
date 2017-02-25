import React, {Component} from 'react';

export default class ResetPassword extends Component {

	componentDidMount() {
		Materialize.updateTextFields();
	}

	handleSubmit (event) {

		// Prevent reload
		event.preventDefault();

		// Fetch data from form
		const newPassword = this.refs.password.value;

		// Validate
		check(password, String);

		// Reset Password

		//TODO: get token from accountRoutes.js
		Accounts.resetPassword(token, newPassword, (err) => {
			if (err) {
				alert (err.reason);
			} else {
				//TODO: Get done function from accountRoutes.js
			}
		})

	}

	render () {
		return (
			<div className="login container">
				<h4>Reset password</h4>
				<div className="divider"></div>
				<div className="row">
					<div className="col-xs-12 col-sm-6 col-md-4">
						<form onSubmit={ this.handleSubmit.bind(this) }>
								
						    <div className="row">
								<div className="input-field col s12 m6">
									<input ref="password" id="password" type="password" className="validate" />
									<label htmlFor="password">Password</label>
								</div>
							</div>
							
							<button className="btn grey waves-effect waves-light" type="submit">Reset</button>
			
						</form>
					</div>
					<br />
					<p>Did you suddenly remember? <a href="/login">Login</a></p>
					<p>Don't have an account? <a href="/signup">Signup</a></p>
				</div>
			</div>
		);
	}
}