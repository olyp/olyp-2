import React, { Component } from 'react';
import { browserHistory, Link } from 'react-router';

export default class MobileMenu extends Component {

	render () {

		return (
			<div id="mobile-menu-content" style={{minHeight: $(window).height()}}>
				<div className="container">
					<div onClick={() => {this.props.onLinkClick('/secure')}}>
						<h1 style={{'textDecoration': 'underline'}}>Book Rom</h1>
					</div>
					<div onClick={() => {this.props.onLinkClick('/')}}>
						<h1 style={{'textDecoration': 'underline'}}>Contact</h1>
					</div>
				</div>
			</div>
		);
	}
}