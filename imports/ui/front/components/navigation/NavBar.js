import React, { Component } from 'react';
import { browserHistory, Link } from 'react-router';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

import MobileMenu from './MobileMenu.js';

class NavBar extends Component {

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

		const menuIcon = this.state.menuOpen ?  
			<img src="/images/menu-square.png" className="shadow"/> : 
			<div id="custom-burger-menu">
				<img src="/images/menu-burger-segment.png" className="shadow" />
				<img src="/images/menu-burger-segment.png" className="shadow" />
				<img src="/images/menu-burger-segment.png" className="shadow" />
			</div> ;
			
		const menu = this.state.menuOpen ? <MobileMenu onLinkClick={(destination) => {this.redirect(destination)}}/> : '';

		const fixedNavClass = this.state.menuOpen ? 'fixed-custom-nav' : '';

		const compensateForFixed = this.state.menuOpen ? <div id="navToContentBuffer"></div> : '';

		return (
			<div>

				<div id="custom-nav" className={fixedNavClass}>
					<div className="row">
						<div className="col-xs-4">
							<div onClick={this.toggleOpen.bind(this)}>
								{menuIcon}
							</div>
							
						</div>
						<div className="col-xs-4 text-center">
							<img src="/images/logo/logo4.png" />
						</div>
						<div className="col-xs-4 text-right">
							<img src="/images/logo/logo3.png" />
						</div>
					</div>
				</div>

				{compensateForFixed}

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

export default NavBar;