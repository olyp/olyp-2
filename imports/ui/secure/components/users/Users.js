import React, {Component} from 'react';
import { createContainer } from 'meteor/react-meteor-data';

import UserRow from './UserRow.js';

class Users extends Component {
	render () {
		return (
			<div className="container">
				<h3>Users</h3>
				{this.props.users.map((user) => {

					if (user._id !== Meteor.userId()) {
						return <UserRow key={user._id} user={user}/>
					}
					
				})}
			</div>
		);
	}
}

export default createContainer(() => {
	Meteor.subscribe('allUsers');

	return {
		users: Meteor.users.find().fetch()
	};
}, Users);
