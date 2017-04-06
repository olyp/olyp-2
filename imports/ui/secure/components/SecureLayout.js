import React, {Component} from 'react';

import NavBar from '../../shared/navigation/NavBar.js';

export default class SecureLayout extends Component {
	render() {
		return (
			<div>
				<NavBar />
				<div className="spacer-30"></div>
				<div className="spacer-30"></div>
				<div className="spacer-30"></div>
				<div className="container-fluid">
					{this.props.children}
				</div>
			</div>
		);
	}
}