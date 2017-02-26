import React, {Component} from 'react';

import CreateCode from './CreateCode.js';
import CodeList from './CodeList.js';
import OpenDoor from './OpenDoor.js';

export default class DoorCodes extends Component {
	render() {
		return(
			<div className="container">
				<OpenDoor />
				<hr />
				<CreateCode />
				<hr />
				<CodeList />
			</div>
		);
	}
}