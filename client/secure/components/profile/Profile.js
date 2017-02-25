import React, {Component} from 'react';
import TrackerReact from 'meteor/ultimatejs:tracker-react';

export default class Profile extends TrackerReact(React.Component) {

	handleSubmit (e) {
		e.preventDefault();

		Meteor.call('changeUserName', this.refs.name.value, (err, res) => {
			if (err) {
				console.log(err);
			} else {
				Bert.alert('Name changed', 'success', 'growl-bottom-right', 'fa-smile-o');
				this.refs.name.value = '';
			}
		});
	}

	render () {

		// const facebookConnect = (user && user.services && user.services.facebook) ? <p>Connected with Facebook</p> : <button className="btn-primary" onClick={this.connectFacebook.bind(this)}>Connect Facebook</button>;
		// const googleConnect = (user && user.services && user.services.google) ? <p>Connected with Google</p> : <button className="btn-warning" onClick={this.connectGoogle.bind(this)}>Connect Google</button>;


		return (
			<div className="container">
				<h2>Profile</h2>
				<form onSubmit={this.handleSubmit.bind(this)}>
					<input
						type="text"
						ref="name"
						placeholder="Ringo Starr"
					/>
					<button type="submit">Save</button>
				</form>
			</div>
		);
	}
}