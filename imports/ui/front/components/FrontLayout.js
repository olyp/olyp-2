import React, {Component} from 'react';

import NavBar from './NavBar.js';

export default class FrontLayout extends Component {
	render() {
		return (
			<div>
				<NavBar />
				{this.props.children}
			</div>
		);
	}
}