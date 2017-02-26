import React, {Component} from 'react';

import CreateCode from './CreateCode.js';
import CodeList from './CodeList.js';
import OpenDoor from './OpenDoor.js';

export default class DoorCodes extends Component {
	render() {
		return(
			<div className="container">
				<h4>Add code</h4>
				<CreateCode />
				<h4>All codes</h4>
				<CodeList />
				<OpenDoor />
			</div>
		);
	}
}