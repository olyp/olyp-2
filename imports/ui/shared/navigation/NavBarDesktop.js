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

		// const scroll = $(window).scrollTop();

		// if (scroll < this.state.window.scroll) {
		// 	this.setState({
		// 		navBarVisible: true
		// 	});
		// } else if (scroll > 100) {
		// 	this.setState({
		// 		navBarVisible: false
		// 	});
		// }

		// 1 -> 0 based on one whole window-scroll
		var scrollFactor = $(window).scrollTop() / $(window).height();
		
		if (scrollFactor >= 1) {
			scrollFactor = 1;
		}

		if (scrollFactor <= 0) {
			scrollFactor = 0;
		}

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
		const logoOffsetTop = (overlayCenterY - 19) * this.state.window.scrollRev;
		const logoOffsetLeft = (overlayContainerCenterX - 57) * this.state.window.scrollRev;
		const logoWidth = (this.state.window.scrollRev > 0.7) ? '111px' : '100%';

		const logoWrapperStyle = {
			paddingLeft: logoOffsetLeft + 'px',
			paddingTop: logoOffsetTop + 'px'
		}

		const logoStyle = {
			width: logoWidth
		}

		// Logo letters

		// Follow the bootstrap container as outer border for the letters
		const sideOffset = (this.state.window.width - this.state.window.containerWidth) / 2;

		// All images are square, but only the "O" goes all the way out
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
								<div id="overlay-logo-wrapper" className="col-sm-6 text-center" style={logoWrapperStyle}>
									<div id="overlay-logo" style={logoStyle}>
										<h4>Oslo Lydproduksjon</h4>
									</div>
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