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

		// Text logo
		const logoTextOsloOffsetTop = ((overlayCenterY - 19) * this.state.window.scrollRev) + 19;
		const logoTextOsloOffsetLeft = ( ((overlayCenterX - 18) - (overlayCenterX - (overlayContainerCenterX / 2) - 75)) * this.state.window.scrollRev) + (overlayCenterX - (overlayContainerCenterX / 2) - 75);

		const logoTextLydproduksjonOffsetTop = ((overlayCenterY) * this.state.window.scrollRev) + 19;
		const logoTextLydproduksjonOffsetLeft = ( ((overlayCenterX - 55) - (overlayCenterX - (overlayContainerCenterX / 2) - 34)) * this.state.window.scrollRev) + (overlayCenterX - (overlayContainerCenterX / 2) - 34);

		const logoTextOslo = {
			top: logoTextOsloOffsetTop + 'px',
			left: logoTextOsloOffsetLeft + 'px'
		}

		const logoTextLydproduksjon = {
			top: logoTextLydproduksjonOffsetTop + 'px',
			left: logoTextLydproduksjonOffsetLeft + 'px'

		}

		// Logo letters

		// Follow the bootstrap container as outer border for the letters
		const sideOffset = (this.state.window.width - this.state.window.containerWidth) / 2;

		// All images are square, but only the "O" goes all the way out to the sides
		const oBuffer = 3;

		const lOffsetTop = (overlayCenterY - 100) * this.state.window.scrollRev;
		// To show P at bottom, change 0 to more than 100
		const pOffsetTop = (overlayCenterY + 105) + (this.state.window.scroll * (overlayCenterY - 0));

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
				left: (overlayCenterX - 25) + 'px'
			}
		}

		if (isHomePage) {
			return (
				<div>

					<div id="desktop-nav">
						<div id="desktop-nav-container" className="container">
							<div className="row">
								<div className="col-sm-6 text-center">

								</div>
								<div className="col-sm-3 text-right">
									<a href="https://me.olyp.no">
										<h4><span className="red-border">Book rom</span></h4>
									</a>
								</div>
								<div className="col-sm-3">
									<h4>Kontakt</h4>
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
						<div className="col-sm-6 text-center"><h4>Oslo Lydproduksjon</h4></div>
						<div className="col-sm-3 text-right">
							<a href="https://me.olyp.no">
								<h4><span className="red-border">Book rom</span></h4>
							</a>
						</div>
						<div className="col-sm-3"><h4>Kontakt</h4></div>
					</div>
				</div>
			</div>
		);
	}
}

export default NavBarDesktop;