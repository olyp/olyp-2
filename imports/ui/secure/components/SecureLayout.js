import React, {Component} from 'react';

import SecureNav from './SecureNav.js';

export default class SecureLayout extends Component {
	render() {
		return (
			<div>
				<SecureNav />
				<div className="container-fluid">
					
					{this.props.children}
				</div>
			</div>
		);
	}
}