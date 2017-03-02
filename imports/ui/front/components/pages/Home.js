import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { browserHistory, Link } from 'react-router';

// import AccountsUI from '../../../AccountsUI.js';

export default class Home extends Component {

	constructor(props) {
		super(props);
		this.state = {
			window: {
				height: 0,
				width: 0,
				scroll: 0
			}
		}
	}

	componentWillMount () {
		this.updateDimensions();
	}
    componentDidMount () {
        window.addEventListener("resize", this.updateDimensions.bind(this));
        window.addEventListener("scroll", this.updateDimensions.bind(this));
    }
    componentWillUnmount () {
        window.removeEventListener("resize", this.updateDimensions.bind(this));
        window.removeEventListener("scroll", this.updateDimensions.bind(this));
    }

	updateDimensions () {
        this.setState({
        	window: {
        		width: $(window).width(), 
        		height: $(window).height(),
        		scroll: $(window).scrollTop()
        	}
        });
    }

	render() {

		const bookRoomFixed = (this.state.window.scroll > 320) ? 
			<Link to='/secure'>
				<div id="book-room-fixed">
					<div className="text-center">
						Book Rom
					</div>
				</div>
			</Link> : '';

		return (
			<div>

				<div id="custom-nav">		
					<div className="row">
						<div className="col-xs-4">
							<img onClick={() => {browserHistory.push('/mobileMenu')}} src="/images/menu-burger.png" />
						</div>
						<div className="col-xs-4 text-center">
							<img src="/images/logo/logo4.png" />
						</div>
						<div className="col-xs-4 text-right">
							<img src="/images/logo/logo3.png" />
						</div>
					</div>						    
				</div>

				{bookRoomFixed}

				<div id="home-container">

					<div style={{height: this.state.window.height}} id="home-screen">

						<div className="container">
							<div className="row">
								<div className="col-xs-8">
									<h1>Olyp tilbyr gode øvingslokaler, et arbeidssted og knutepunkt for yrkesmusikere og band i Oslo.</h1>
								</div>
							</div>
						</div>

						<div className="container">
							<Link to="/secure">
								<h1 style={{'textDecoration': 'underline'}}>Book Rom</h1>
							</Link>
						</div>

						<div className="container">
							<img className="arrow" src="/images/arrow-down.png" />
						</div>

					</div>

					<div className="grey-container">

						<div className="container">
							<div className="row">
								<div className="col-xs-4">
									<img className="img-responsive" src="/images/rooms-6.png" />
								</div>
							</div>
							<h1 style={{'textDecoration': 'underline'}}>6 Rom</h1>
							<h1>For solister og små ensembler</h1>
						</div>


						<div className="container">
							<div className="row">
								<div className="col-xs-4">
									<img className="img-responsive" src="/images/rooms-3.png" />
								</div>
							</div>
							<h1 style={{'textDecoration': 'underline'}}>3 Rom</h1>
							<h1>For mellomstore ensembler</h1>
						</div>


						<div className="container">
							<div className="row">
								<div className="col-xs-4">
									<img className="img-responsive" src="/images/rooms-1.png" />
								</div>
							</div>
							<h1 style={{'textDecoration': 'underline'}}>1 Rom</h1>
							<h1>For større ensembler</h1>
						</div>

						<div className="container">
							<h1 style={{'textDecoration': 'underline'}}>Drive-in-lager</h1>
							<h1>Direkte tilgang via garasje</h1>
						</div>

						<div className="container">
							<h1 style={{'textDecoration': 'underline'}}>Fellerarealer</h1>
							<h1>80 kvm</h1>
						</div>

						<div className="container">
							<img src="http://eastroom.ca/wp-content/uploads/2016/04/Photos-Desktop-2.jpg" className="img-responsive"/>
						</div>

						<div className="container">
							<img src="http://eastroom.ca/wp-content/uploads/2016/04/Photos-Desktop-1.jpg" className="img-responsive"/>
						</div>

					</div>

					
					<div className="container">
						<div className="row">
							<div className="col-xs-8">
								<h1>Vi holder til på Rosenhoff, mellom Carl Berner og Sinsen.</h1>
							</div>
						</div>
					</div>

					<div className="container">		
						<Link to="https://goo.gl/maps/6v3eMub7sTS2" target="blank">
							<img src="/images/map.jpg" className="img-responsive" />
						</Link>	
					</div>

					<div className="container">
						<h1 style={{'textDecoration': 'underline'}}>Booking og leie</h1>
						<h1>Jonas Barsten<br />jonas@olyp.no</h1>
					</div>

					<div className="container">
						<h1 style={{'textDecoration': 'underline'}}>Bygg og utstyr</h1>
						<h1>Haakon Mathisen<br />haakon@olyp.no</h1>
					</div>

					<div className="container">
						<h1 style={{'textDecoration': 'underline'}}>Kundeforhold</h1>
						<h1>Simen Solli Schøien<br />simen@olyp.no</h1>
					</div>

					<div className="container">
						<h1 style={{'textDecoration': 'underline'}}>Økonomi</h1>
						<h1>Alf Lund Godbolt<br />alf@olyp.no</h1>
					</div>

				</div>

				<div id="home-footer" className="container-fluid">
					<img className="arrow" src="/images/arrow-up.png" />
				</div>
				<div className="spacer-50"></div>
				<div className="spacer-10"></div>
			</div>
		);
	};
}



