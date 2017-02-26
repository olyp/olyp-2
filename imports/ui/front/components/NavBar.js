import React, {Component} from 'react';
import {Link} from 'react-router';

export default class NavBar extends Component {
	render() {
		return (
			<nav className="navbar navbar-default">
				<div className="container-fluid">

					<div className="navbar-header">
						<button type="button" className="navbar-toggle collapsed" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1" aria-expanded="false">
							<span className="sr-only">Toggle navigation</span>
							<span className="icon-bar"></span>
							<span className="icon-bar"></span>
							<span className="icon-bar"></span>
						</button>
						<Link className="navbar-brand" to="/">
							<img alt="Brand" src="/images/logo-horizontal.png" />
						</Link>
					</div>

					<div className="collapse navbar-collapse" id="bs-example-navbar-collapse-1">


						<ul className="nav navbar-nav navbar-right">
							<li><Link to="/artists">Artists</Link></li>
							<li><Link to="/releases">Releases</Link></li>
							<li><a href="#">Upcoming</a></li>
							<li><a href="#">About</a></li>
							<li><a href="#">Store</a></li>
						</ul>
					</div>
				</div>
			</nav>
		);
	}

}