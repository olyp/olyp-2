import React, {Component} from 'react';

export default class OpenDoor extends Component {
	openDoor () {
		Meteor.call('doorCode.open');
	}

	render () {
		return (
			<div>
				<button onClick={this.openDoor.bind(this)} />
			</div>
		);
	}
}