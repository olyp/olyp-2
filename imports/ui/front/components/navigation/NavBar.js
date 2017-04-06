import React, { Component } from 'react';
import { Link, browserHistory } from 'react-router';
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
			<img src="/images/menu-square.png" /> : 
			<img src="/images/menu-burger.png" /> ;
			
		const menu = this.state.menuOpen ? <MobileMenu onLinkClick={(destination) => {this.redirect(destination)}}/> : '';

		return (
			<div>

				<div id="custom-nav">
					<div className="row">
						<div className="col-xs-4">
							<div onClick={this.toggleOpen.bind(this)}>
								{menuIcon}
							</div>
							
						</div>
						<div className="col-xs-4 text-center">
							<Link to="/">
								<img src="/images/logo/logo4.png" />
							</Link>
						</div>
						<div className="col-xs-4 text-right">
							<Link to="/">
								<img src="/images/logo/logo3.png" />
							</Link>
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

export default NavBar;