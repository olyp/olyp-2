import React, {Component} from 'react';
import { createContainer } from 'meteor/react-meteor-data';

import UserRow from './UserRow.js';

class Users extends Component {
	render () {
		return (
			<div className="container">
				<h3>Users</h3>

				<hr />

				{this.props.users.map((user, i) => {

					const isOdd = i % 2 === 0;
					const style = isOdd ? 'user-row-background' : '';

					if (user._id !== Meteor.userId()) {

						return (
							<div className={style} key={user._id}>
								<UserRow user={user}/>
								<hr />
							</div>
						);
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
