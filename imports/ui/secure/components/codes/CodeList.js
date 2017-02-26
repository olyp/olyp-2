import React, {Component} from 'react';
import { createContainer } from 'meteor/react-meteor-data';

import DoorCodes from '../../../../api/collections/doorCodes.js';

class CodeList extends Component {

	getUserProfileFromId (userId) {
		return Meteor.users.find({_id: userId}).fetch();
	}

	deleteCode(code) {
		Meteor.call('doorCode.delete', code);
	}

	render() {

		console.log(this.props.users);
		console.log(this.props.doorCodes);

		return (
			<div>
				{this.props.doorCodes.map((code) => {

					const user = this.getUserProfileFromId(code.userId);
					console.log('user: ' + user);
					const userName = (user && user.profile) ? user.profile.name : '';

					return (
						<div key={code._id}>
							{code.code} - {userName} <span onClick={() => this.deleteCode(code)}>delete</span>
						</div>
					);
				})}
			</div>
		);
	}
}

export default createContainer(() => {
	Meteor.subscribe('allProfiles');
	Meteor.subscribe('allDoorCodes');

	return {
		doorCodes: DoorCodes.find().fetch(),
		users: Meteor.users.find().fetch(),
	};
}, CodeList);