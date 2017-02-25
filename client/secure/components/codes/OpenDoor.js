import React, {Component} from 'react';

export default class OpenDoor extends Component {
	openDoor () {
		Meteor.call('openDoor');
	}

	render () {
		return (
			<div>
				<button onClick={this.openDoor.bind(this)} />
			</div>
		);
	}
}