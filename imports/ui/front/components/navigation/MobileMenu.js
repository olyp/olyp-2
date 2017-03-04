import React, { Component } from 'react';
import { browserHistory, Link } from 'react-router';

export default class MobileMenu extends Component {

	render () {

		return (
			<div id="mobile-menu-content" style={{minHeight: $(window).height()}}>
				<div className="container">
					<h1 onClick={() => {this.props.onLinkClick('/secure')}}>Book Rom</h1>
					<br />
					<h1 onClick={() => {this.props.onLinkClick('/')}}>Contact</h1>
					<br />
					<h1 onClick={() => {this.props.onLinkClick('/')}}>About</h1>
					<br />
					<h1 onClick={() => {this.props.onLinkClick('/')}}>Lololol</h1>
				</div>
			</div>
		);
	}
}