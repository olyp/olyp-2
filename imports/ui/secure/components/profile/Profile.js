import React, {Component} from 'react';
import { createContainer } from 'meteor/react-meteor-data';

class Profile extends Component {

	constructor(props) {
		super(props);
		this.state = {
			name: ''
		}
	}

	save (e) {

		Meteor.call('changeUserName', this.state.name, (err, res) => {
			if (err) {
				console.log(err);
			} else {
				Bert.alert('Name changed', 'success', 'growl-bottom-right', 'fa-smile-o');
			}
		});
	}


	render () {

		const user = this.props.user[0];

		return (
			<div className="container">
				<h2>Profile</h2>

				<input
					type="text"
					onChange={(e) => {this.setState({name: e.target.value})}}
					// If this.state.name is empty, then check if any the ones in the () exists, if they do, then return the last value, if not, return '' 
					value={this.state.name || (user && user.profile && user.profile.name) || ''}
				/>

				<button onClick={this.save.bind(this)}>Save</button>

			</div>
		);
	}
}

export default createContainer(() => {
	Meteor.subscribe('profile');

	return {
		user: Meteor.users.find().fetch(),
	};
}, Profile);