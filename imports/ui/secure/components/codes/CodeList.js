import React, {Component} from 'react';
import { createContainer } from 'meteor/react-meteor-data';

import DoorCodes from '../../../../api/collections/doorCodes.js';

class CodeList extends Component {

	getUserProfileFromId (userId) {
		return Meteor.users.find({_id: userId}).fetch();
	}

	deleteCode(code) {
		const codeId = code._id;

		Meteor.call('doorCode.delete', codeId);
	}

	render() {

		return (
			<div>
				<h3>Temporary codes</h3>

				<div>

					{this.props.doorCodes.map((code) => {

						if (code.userId == 'no user') {
							return (
								<div key={code._id}>
									{code.code} - No user - <span onClick={() => this.deleteCode(code)}>delete</span>
								</div>
							);
						}
					})}

				</div>

				<h3>User codes</h3>

				<div>
					{this.props.doorCodes.map((code) => {

						const user = this.getUserProfileFromId(code.userId)[0];
						const userName = (user && user.profile) ? user.profile.name : '';

						if (userName) {
							return (
								<div key={code._id}>
									{code.code} - {userName} - <span onClick={() => this.deleteCode(code)}>delete</span>
								</div>
							);
						}
					})}
				</div>
			</div>
		);
	}
}

export default createContainer(() => {
	Meteor.subscribe('allProfiles');
	Meteor.subscribe('allDoorCodes');

	return {
		doorCodes: DoorCodes.find().fetch()
	};
}, CodeList);