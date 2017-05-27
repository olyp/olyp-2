import React, { Component } from 'react';

class NavBarDesktop extends Component {

	constructor(props) {
		super(props);
		this.state = {
			loading: false,
			window: {
				height: 0,
				width: 0,
				scroll: 0,
				scrollRev: 0
			},
			navBarVisible: true
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

	render () {

		const pathArray = window.location.pathname.split( '/' );
		const isHomePage = (pathArray[1] == "") ? true : false;

		const overlayCenterY = this.state.window.height / 2;
		const overlayCenterX = this.state.window.width / 2;
		const overlayContainerCenterX = this.state.window.containerWidth / 2;

		console.log(this.state.window.scrollRev);
		// console.log(overlayCenterX);

		// Text logo
		const logoTextOsloOffsetTop = ((overlayCenterY - 19) * this.state.window.scrollRev) + 19;
		const logoTextOsloOffsetLeft = ( ((overlayCenterX - 18) - (overlayCenterX - (overlayContainerCenterX / 2) - 37)) * this.state.window.scrollRev) + (overlayCenterX - (overlayContainerCenterX / 2) - 37);

		const logoTextLydproduksjonOffsetTop = ((overlayCenterY) * this.state.window.scrollRev) + 19;
		const logoTextLydproduksjonOffsetLeft = ( ((overlayCenterX - 55) - (overlayCenterX - (overlayContainerCenterX / 2) + 4)) * this.state.window.scrollRev) + (overlayCenterX - (overlayContainerCenterX / 2) + 4);
		// const logoWidth = (this.state.window.scrollRev > 0.7) ? '111px' : '100%';

		console.log(overlayContainerCenterX);

		const logoTextOslo = {
			top: logoTextOsloOffsetTop + 'px',
			left: logoTextOsloOffsetLeft + 'px'
		}

		const logoTextLydproduksjon = {
			top: logoTextLydproduksjonOffsetTop + 'px',
			left: logoTextLydproduksjonOffsetLeft + 'px'
			// marginTop: -29 + 'px',
			// marginLeft: (overlayContainerCenterX - 179) + 'px',
			// width: 111 + 'px'
		}

		// const logoStyle = {
		// 	width: logoWidth
		// }

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
				left: yOffsetLeft + 'px'
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
									<h4>Book rom</h4>
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

					<div style={{minHeight: $(window).height()}}>
					</div>

				</div>
			);
		}

		return (
			<div id="desktop-nav">
				<div className="container">
					<div className="row">
						<div className="col-sm-6 text-center">Oslo Lydproduksjon</div>
						<div className="col-sm-3 text-right">Book rom</div>
						<div className="col-sm-3">Kontakt</div>
					</div>
				</div>
			</div>
		);
	}
}

export default NavBarDesktop;