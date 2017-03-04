import React, { Component } from 'react';
import { browserHistory, Link } from 'react-router';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

import MobileMenu from './MobileMenu.js';

export default class NavBar extends Component {

	constructor(props) {
		super(props);
		this.state = {
			menuOpen: false
		}
	}

	toggleOpen () {
		this.setState({
			menuOpen: !this.state.menuOpen
		});
	}

	redirect (destination) {
		this.toggleOpen();
		browserHistory.push(destination);
	}

	render () {

		const menuIcon = this.state.menuOpen ? "/images/menu-square.png" : "/images/menu-burger.png";
		const menu = this.state.menuOpen ? <MobileMenu onLinkClick={(destination) => {this.redirect(destination)}}/> : '';

		return (
			<div>

				<div  id="custom-nav">
					<div className="row">
						<div className="col-xs-4">
							<img onClick={this.toggleOpen.bind(this)} src={menuIcon} />
						</div>
						<div className="col-xs-4 text-center">
							<img src="/images/logo/logo4.png" />
						</div>
						<div className="col-xs-4 text-right">
							<img src="/images/logo/logo3.png" />
						</div>
					</div>
				</div>

				<ReactCSSTransitionGroup
					transitionName='mobile-menu'
					transitionEnterTimeout={300}
					transitionLeaveTimeout={300}
				>
					{menu}
				</ReactCSSTransitionGroup>

			</div>
		);
	}
}