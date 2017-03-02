import React, { Component } from 'react';
import { browserHistory, Link } from 'react-router';

export default class MobileMenu extends Component {
	render () {
		return (
			<div>
				<div style={{minHeight: $(window).height()}} id="mobile-menu">

					<div className="row">
						<div className="col-xs-4">
							<img onClick={() => {browserHistory.goBack()}} src="/images/menu-square.png" />
						</div>
						<div className="col-xs-4 text-center">
							<img src="/images/logo/logo4.png" />
						</div>
						<div className="col-xs-4 text-right">
							<img src="/images/logo/logo3.png" />
						</div>
					</div>


					<div id="mobile-menu-content">
						<div className="container">
							<Link to="/secure">
								<h1 style={{'textDecoration': 'underline'}}>Book Rom</h1>
							</Link>
						</div>

						<div className="container">
							<Link to="/">
								<h1 style={{'textDecoration': 'underline'}}>Contact</h1>
							</Link>
						</div>
					</div>

				</div>
			</div>
		);
	}
}