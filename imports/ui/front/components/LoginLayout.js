import React, { Component } from 'react';
import { Helmet } from 'react-helmet';

import NavBar from '../../shared/navigation/NavBar.js';

class LoginLayout extends Component {
	render () {

		const routeName = 'OLYP || ' + this.props.routes[this.props.routes.length - 1].name;

		return (
			<div>
				<NavBar />
				<Helmet>
					<title>{routeName}</title>
				</Helmet>
				{this.props.children}
			</div>
		);

	}
}

export default LoginLayout;