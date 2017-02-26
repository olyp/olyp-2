import React, {Component} from 'react';
import TrackerReact from 'meteor/ultimatejs:tracker-react';

import DoorCodes from '../../../../api/collections/doorCodes.js';

export default class CodeList extends TrackerReact(React.Component) {

	constructor() {
		super();
		this.state = {
			subscription: {
				doorCodes: Meteor.subscribe('allDoorCodes')
			}
		}
	}

	componentWillUnmount() {
		this.state.subscription.doorCodes.stop();
	}

	getDoorCodes() {
		return DoorCodes.find().fetch();
	}

	deleteCode(code) {
		Meteor.call('doorCode.delete', code);
	}

	render() {
		return (
			<div>
				{this.getDoorCodes().map((code) => {
					return (
						<div key={code._id}>
							{code.code} - <span onClick={() => this.deleteCode(code)}>delete</span>
						</div>
					);
				})}
			</div>
		);
	}
}