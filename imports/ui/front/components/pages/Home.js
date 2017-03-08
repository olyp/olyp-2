import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { browserHistory, Link } from 'react-router';
import Scroll from 'react-scroll';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

import FloorPlan from '../../../shared/floorplan/FloorPlan.js';
import VivusContainer from '../../../shared/floorplan/VivusContainer.js';

const scroll = Scroll.animateScroll;
const scroller = Scroll.scroller;

class Home extends Component {

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

						<div id="mobile-home">

							<ReactCSSTransitionGroup
								transitionName='page-content'
								transitionEnterTimeout={300}
								transitionLeaveTimeout={300}
								transitionAppear={true}
								transitionAppearTimeout={300}
							>

								<div style={{minHeight: this.props.window.height - 250}}>

									<div className="container">
										<div className="row">
											<div className="col-xs-12 text-center">
												<h1>Olyp tilbyr gode øvingslokaler, et arbeidssted og knutepunkt for yrkesmusikere og band i Oslo.</h1>
											</div>
										</div>
									</div>

									<div id="book-room-button" className="container text-center shadow">
										<Link to="/secure">
											<h1>Book Rom</h1>
										</Link>
									</div>

								</div>

							</ReactCSSTransitionGroup>

							<div id="grey-container">

								<div className="container text-center">
									<img 
										onClick={() => {this.scrollToAnchor('grey-container')}}
										className="arrow" 
										src="/images/arrow-down.png" 
									/>
								</div>

								<div className="container text-center">
									<div className="row">
										<div className="col-xs-4 col-xs-offset-4">

											<VivusContainer>
												<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 106.1 26.2">
													<path 
														d="M.5,25.7V.5H13.6V25.7Zm18.4,0V.5H32V25.7Zm18.4,0V.5H50.4V25.7Zm18.4,0V.5H68.8V25.7Zm18.4,0V.5H87.2V25.7Zm18.4,0V.5h13.1V25.7Z" 
														fill="none" 
														stroke="#ea2427" 
														strokeMiterlimit="10"
													/>
												</svg>
											</VivusContainer>
											
										</div>
									</div>
									<h1><u>6 Rom</u></h1>
									<h1>For solister og små ensembler</h1>
								</div>


								<div className="container text-center">
									<div className="row">
										<div className="col-xs-4 col-xs-offset-4">
											
											<VivusContainer>
												<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 104.8 46.1">
												    <path 
												    	d="M.5,45.6V.5H30.2V45.6Zm66.4,0V.5H37.2V45.6Zm37.3,0V.5H74.5V45.6Z" 
												    	fill="none" 
												    	stroke="#ea2427" 
												    	strokeMiterlimit="10"
												    />											
												</svg>
											</VivusContainer>

										</div>
									</div>
									<h1><u>3 Rom</u></h1>
									<h1>For mellomstore ensembler</h1>
								</div>


								<div className="container text-center">
									<div className="row">
										<div className="col-xs-4 col-xs-offset-4">

											<VivusContainer duration={75}>
												<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 105 64.6">
												    <path 
												    	d="M.5,64.1V.5h104V64.1Z" 
												    	fill="none" 
												    	stroke="#ea2427" 
												    	strokeMiterlimit="10"
												    />											
												</svg>
											</VivusContainer>

										</div>
									</div>
									<h1><u>1 Rom</u></h1>
									<h1>For større ensembler</h1>
								</div>

								<div className="container text-center">
									<h1><u>Drive-in-lager</u></h1>
									<h1>30kvm med direkte tilgang via garasje</h1>
								</div>

								<div className="container text-center">
									<h1><u>Fellerarealer</u></h1>
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
								<div className="container text-center">
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

								<div className="container text-center">
									<h1><u>Booking og leie</u></h1>
									<h1>Jonas Barsten<br />jonas@olyp.no</h1>
								</div>

								<div className="container text-center">
									<h1><u>Bygg og utstyr</u></h1>
									<h1>Haakon Mathisen<br />haakon@olyp.no</h1>
								</div>

								<div className="container text-center">
									<h1><u>Kundeforhold</u></h1>
									<h1>Simen Solli Schøien<br />simen@olyp.no</h1>
								</div>

								<div className="container text-center">
									<h1><u>Økonomi</u></h1>
									<h1>Alf Lund Godbolt<br />alf@olyp.no</h1>
								</div>
							</div>
						</div>

					


					<div id="desktop-home">
						<div className="container text-center">
							<FloorPlan />
						</div>
					</div>


				</div>
			</div>
		);
	};
}

export default Home;

