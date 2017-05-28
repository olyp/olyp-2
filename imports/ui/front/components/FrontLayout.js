import React, {Component} from 'react';

// import Preloader from '../../shared/preloader/Preloader.js';

import NavBar from '../../shared/navigation/NavBar.js';
import NavBarDesktop from '../../shared/navigation/NavBarDesktop.js';
import Footer from './navigation/Footer.js';

class FrontLayout extends Component {

	render() {
		return (
			<div>
				<div className="mobile">
					<NavBar />
				</div>
				<div className="desktop">
					<NavBarDesktop />
				</div>
				{this.props.children}
				<Footer />
			</div>
		);
	}
}

export default FrontLayout;