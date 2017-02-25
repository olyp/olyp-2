import React, {Component} from 'react';
import TrackerReact from 'meteor/ultimatejs:tracker-react';

export default class Profile extends TrackerReact(React.Component) {

	constructor() {
		super();
		this.state = {
			subscription: {
				profile: Meteor.subscribe('profile')
			}
		}
	}

	componentWillUnmount() {
		this.state.subscription.profile.stop();
	}

	// connectFacebook () {

	// 	const user = this.getUserProfile()[0];

	// 	if (Meteor.user()) {
 //    		Meteor.connectWith("facebook", (err) => {
 //    			if (err) {
 //    				console.log(err);
 //    			} else {
 //    				if (!user.profile.firstName) {
 //    					Meteor.call('setUserDataFromFacebook');
 //    				}
 //    			}
 //    		});
	// 	}
	// }

	// connectGoogle () {
	// 	if (Meteor.user()) {
 //    		Meteor.connectWith("google");
	// 	}
	// }

	getUserProfile () {
		return Meteor.users.find().fetch();
	}

	render () {

		// const user = this.getUserProfile()[0];

		// const facebookConnect = (user && user.services && user.services.facebook) ? <p>Connected with Facebook</p> : <button className="btn-primary" onClick={this.connectFacebook.bind(this)}>Connect Facebook</button>;
		// const googleConnect = (user && user.services && user.services.google) ? <p>Connected with Google</p> : <button className="btn-warning" onClick={this.connectGoogle.bind(this)}>Connect Google</button>;


		return (
			<div>
				<h2>Profile</h2>
			</div>
		);
	}
}