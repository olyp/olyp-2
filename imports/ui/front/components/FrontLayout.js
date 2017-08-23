import React, {Component} from 'react';
import { Helmet } from 'react-helmet';

// import Preloader from '../../shared/preloader/Preloader.js';

import NavBar from '../../shared/navigation/NavBar.js';
import NavBarDesktop from '../../shared/navigation/NavBarDesktop.js';
import Footer from './navigation/Footer.js';

class FrontLayout extends Component {

	render() {

		const routeName = 'OLYP || ' + this.props.routes[this.props.routes.length - 1].name;

		return (
			<div>
				<div className="mobile">
					<NavBar />
				</div>
				<div className="desktop">
					<NavBarDesktop />
				</div>
				<Helmet>
					<title>{routeName}</title>
				</Helmet>
				{this.props.children}
				<Footer />
			</div>
		);
	}
}

export default FrontLayout;