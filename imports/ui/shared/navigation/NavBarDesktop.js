import React, { Component } from 'react';
import { Link } from 'react-router';

class NavBarDesktop extends Component {

	constructor(props) {
		super(props);
		this.state = {
			window: {
				height: 0,
				width: 0,
				scroll: 0,
				scrollRev: 0
			}
		}
	}

    componentDidMount () {
    	this.updateDimensions();

        window.addEventListener("resize", this.updateDimensions.bind(this));
        window.addEventListener("scroll", this.updateDimensions.bind(this));
    }
    
    componentWillUnmount () {
        window.removeEventListener("resize", this.updateDimensions.bind(this));
        window.removeEventListener("scroll", this.updateDimensions.bind(this));
    }

	updateDimensions () {

		// 0 -> 1 based on one whole window-scroll
		var scrollFactor = $(window).scrollTop() / $(window).height();
		
		if (scrollFactor >= 1) {
			scrollFactor = 1;
		}

		if (scrollFactor <= 0) {
			scrollFactor = 0;
		}

		// 1 -> 0 based on one whole window-scroll
		const scrollFactorRev = (scrollFactor * -1) + 1;

		// TODO: NavBarDesktop-component seems to not unmount and keeps running the event listener after it should have been unmounted. When this is fixed, we can remove the followinf if-statement, but keep the setState.

		if (document.getElementById('desktop-nav')) {

	        this.setState({
	        	window: {
	        		containerWidth: document.getElementById('desktop-nav-container').offsetWidth,
	        		width: $(window).width(),
	        		height: $(window).height(),
	        		scrollRev: scrollFactorRev,
	        		scroll: scrollFactor
	        	}
	        });

		}


    }

	render () {

		const pathArray = window.location.pathname.split( '/' );
		const isHomePage = (pathArray[1] == "") ? true : false;

		const overlayCenterY = this.state.window.height / 2;
		const overlayCenterX = this.state.window.width / 2;
		const overlayContainerCenterX = this.state.window.containerWidth / 2;

		const containerEdgeOffset = overlayCenterX - overlayContainerCenterX;

		// Text logo

		// Both digits are the ending top margin
		const logoTextOsloOffsetTop = ((overlayCenterY - 90) * this.state.window.scrollRev) + 90;
		// The first digit is the end top margin minus the y distance from "Oslo", the last digit is the end top margin
		const logoTextLydproduksjonOffsetTop = ((overlayCenterY - 71) * this.state.window.scrollRev) + 90;

		const logoTextOsloOffsetLeftStart = overlayCenterX - 18;
		const logoTextOsloOffsetLeftEnd = containerEdgeOffset + 10;
		const logoTextOsloOffsetLeft = ((logoTextOsloOffsetLeftStart - logoTextOsloOffsetLeftEnd) * this.state.window.scrollRev) + logoTextOsloOffsetLeftEnd;
		
		const logoTextLydproduksjonOffsetLeftStart = overlayCenterX - 55;
		const logoTextLydproduksjonOffsetLeftEnd = containerEdgeOffset + 50;
		const logoTextLydproduksjonOffsetLeft = ((logoTextLydproduksjonOffsetLeftStart - logoTextLydproduksjonOffsetLeftEnd) * this.state.window.scrollRev) + logoTextLydproduksjonOffsetLeftEnd;

		const logoTextOslo = {
			top: logoTextOsloOffsetTop + 'px',
			left: logoTextOsloOffsetLeft + 'px'
		}

		const logoTextLydproduksjon = {
			top: logoTextLydproduksjonOffsetTop + 'px',
			left: logoTextLydproduksjonOffsetLeft + 'px'

		}

		// Logo letters

		// Follow the bootstrap container as outer border for the letters, last digit pushes the end position of "O" and "Y" towards the center
		const sideOffset = ((this.state.window.width - this.state.window.containerWidth) / 2) + 30;

		// All images are square, but only the "O" goes all the way out to the sides
		const oBuffer = 3;

		// First digit is starting point + last digit, last digit is end margin top
		const lOffsetTop = ((overlayCenterY - 170) * this.state.window.scrollRev) + 70;
		// To show P at bottom, change last digit to more than 100
		const pOffsetTop = (overlayCenterY + 105) + (this.state.window.scroll * (overlayCenterY - 230));

		const oOffsetLeft = ((overlayCenterX - 158 - sideOffset) * this.state.window.scrollRev) + sideOffset - oBuffer;
		const yOffsetLeft = (overlayCenterX + 108) + (this.state.window.scroll * (overlayCenterX - 154 - sideOffset));

		const letterStyles = {
			o: {
				top: (overlayCenterY + 7) + 'px',
				left: oOffsetLeft + 'px'
			},
			l: {
				top: lOffsetTop + 'px',
				left: (overlayCenterX - 25) + 'px'
			},
			y: {
				top: (overlayCenterY + 7) + 'px',
				left: yOffsetLeft + 'px',
				zIndex: -2
			},
			p: {
				top: pOffsetTop + 'px',
				left: (overlayCenterX - 25) + 'px',
				zIndex: -2
			}
		}

		if (isHomePage) {
			return (
				<div>

					<div id="desktop-nav">

						<div id="desktop-nav-homepage-margin"></div>

						<div id="desktop-nav-container" className="container">
							<div className="row">

								<div className="col-sm-6 col-sm-offset-6 text-right">
									<a href="https://me.olyp.no"><h4>Book rom</h4></a>
									<Link to="/#contact"><h4>Kontakt</h4></Link>
								</div>
							</div>
						</div>
					</div>

					<div className="overlay-letter" style={logoTextOslo}>
						<h4>Oslo</h4>
					</div>

					<div className="overlay-letter" style={logoTextLydproduksjon}>
						<h4>Lydproduksjon</h4>
					</div>

					<div className="overlay-letter" style={letterStyles.l}>
						<img src="/images/logo/logo-l.png" />
					</div>

					<div className="overlay-letter" style={letterStyles.p}>
						<img src="/images/logo/logo-p.png" />
					</div>

					<div className="overlay-letter" style={letterStyles.o}>
						<img src="/images/logo/logo-o.png" />
					</div>

					<div className="overlay-letter" style={letterStyles.y}>
						<img src="/images/logo/logo-y.png" />
					</div>

				</div>
			);
		}

		return (
			<div id="desktop-nav">
				<div id="desktop-nav-container" className="container">
					<div className="row">
						<div className="col-sm-6">
							<Link to="/">
								<h4>Oslo Lydproduksjon</h4>
							</Link>
						</div>
						<div className="col-sm-6 text-right">
							<a href="https://me.olyp.no"><h4>Book rom</h4></a>
							<Link to="/#contact"><h4>Kontakt</h4></Link>
						</div>
					</div>
				</div>
			</div>
		);
	}
}

export default NavBarDesktop;