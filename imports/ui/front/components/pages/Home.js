import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { browserHistory, Link } from 'react-router';
import Scroll from 'react-scroll';

const scroll = Scroll.animateScroll;
const scroller = Scroll.scroller;

export default class Home extends Component {

	scrollToAnchor(id) {
		scroller.scrollTo(id, {'duration': 300, 'smooth': true});
	}

	render() {

		// const bookRoomFixed = (this.props.window.scroll > 320) ? 
		// 	<Link to='/secure'>
		// 		<div id="book-room-fixed">
		// 			<div className="text-center">
		// 				Book Rom
		// 			</div>
		// 		</div>
		// 	</Link> : '';

		return (
			<div>

				<div id="home-container">

					<div style={{minHeight: this.props.window.height - 108}} id="home-screen">

						<div className="container">
							<div className="row">
								<div className="col-xs-8">
									<h1>Olyp tilbyr gode øvingslokaler, et arbeidssted og knutepunkt for yrkesmusikere og band i Oslo.</h1>
								</div>
							</div>
						</div>

						<div id="book-room-button" className="container text-center">
							<Link to="/secure">
								<h1>Book Rom</h1>
							</Link>
						</div>

						<div className="container">
							<img 
								onClick={() => {this.scrollToAnchor('grey-container')}}
								className="arrow" 
								src="/images/arrow-down.png" 
							/>
						</div>

						<div className="spacer-50"></div>

					</div>

					<div id="grey-container">

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
							<h1>30kvm med direkte tilgang via garasje</h1>
						</div>

						<div className="container">
							<h1 style={{'textDecoration': 'underline'}}>Fellerarealer</h1>
							<h1>70 kvm</h1>
						</div>

						<div className="container">
							<img src="/images/promo1.jpg" className="img-responsive"/>
						</div>

						<div className="container">
							<img src="/images/promo2.jpg" className="img-responsive"/>
						</div>

					</div>

					<div id="contact-container">
						<div className="container">
							<div className="row">
								<div className="col-xs-12">
									<h1>Vi holder til på<br />Rosenhoff, mellom<br />Carl Berner og Sinsen.</h1>
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
				</div>
			</div>
		);
	};
}



