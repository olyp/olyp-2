import React, { Component } from 'react';

import NavBar from './navigation/NavBar.js';

class LoginLayout extends Component {
	render () {
		return (
			<div>
				<NavBar />
				{this.props.children}
			</div>
		);

	}
}

export default LoginLayout;