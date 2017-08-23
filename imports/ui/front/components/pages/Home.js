import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { browserHistory, Link } from 'react-router';
import Scroll from 'react-scroll';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
// import { Helmet } from 'react-helmet';

import VivusContainer from '../../../shared/floorplan/VivusContainer.js';

const scroll = Scroll.animateScroll;
const scroller = Scroll.scroller;

import FloorPlan from '../../../shared/floorplan/FloorPlan.js';

class Home extends Component {

	constructor(props) {
		super(props);
		this.state = {
			window: {
				height: 0
			}
		}
	}

    componentDidMount () {
    	this.updateDimensions();

        window.addEventListener("resize", this.updateDimensions.bind(this));
    }
    componentWillUnmount () {
        window.removeEventListener("resize", this.updateDimensions.bind(this));
    }

	updateDimensions () {

        this.setState({
        	window: {
        		height: $(window).height()
        	}
        });
    }


	scrollToAnchor(id) {
		scroller.scrollTo(id, {'duration': 300, 'smooth': true});
	}

	render() {
		return (
			<div>

				<div id="home-container">

					<div id="home">

						<div id="grey-background" className="desktop"></div>

						<div className="desktop">

							<div className="container">
								<div style={{minHeight: this.state.window.height - 200}}></div>
								<div className="text-center">
									<img 
										onClick={() => {this.scrollToAnchor('desktop-content')}}
										className="arrow" 
										src="/images/arrow-down.png" 
									/>
								</div>

							</div>

						</div>

						<div id="desktop-content" className="desktop">

							<div className="spacer-50"></div>
							<div className="spacer-50"></div>
							<div className="spacer-50"></div>


							<div className="row">
								<div className="col-xs-8 col-xs-offset-2 text-center">
									<h1>Hos oss kan du leie øverom. Både fast og på timesbasis.</h1>
								</div>
							</div>


							<div className="spacer-50"></div>
							<div className="spacer-50"></div>
							<div className="spacer-50"></div>

							<div className="row">
								
								<div className="col-sm-6 text-center">
									<h4><u>4 rom</u></h4>
									<h4>For solister og små ensembler</h4>
									<h4>12 - 18 kvm</h4>
								</div>
								<div className="col-sm-6 text-center">
									<h4><u>1 rom</u></h4>
									<h4>For større ensembler</h4>
									<h4>34 kvm</h4>
								</div>

								<div className="row">
									<div className="col-sm-6 text-center">
										<h4><u>5 rom</u></h4>
										<h4>For mellomstore ensembler</h4>
										<h4>ca 21kvm</h4>
									</div>
									<div className="col-sm-6 text-center">
										<h4><u>Drive-in-lager</u></h4>
										<h4>Direkte tilgang via garasje</h4>
										<h4>80 kvm</h4>
									</div>
								</div>
							</div>

							<div className="spacer-50"></div>
							<div className="spacer-50"></div>
							<div className="spacer-50"></div>

							<div className="row">
								<div className="col-sm-12">
									<FloorPlan type='delayed' duration={50}/>
								</div>
							</div>

							<div className="spacer-50"></div>

							<div className="row">
								<div className="text-center">
									<a href="https://goo.gl/maps/6v3eMub7sTS2" target="blank">
										<h4>Olaf Schous Vei 6</h4>
									</a>
								</div>
							</div>

							<div className="spacer-50"></div>
							<div className="spacer-50"></div>
							<div className="spacer-50"></div>
							<div className="spacer-50"></div>
							<div className="spacer-50"></div>

							<div className="row">
								<img className="img-responsive full-width" src="/images/art-christina.jpg" />
							</div>


							<div className="spacer-50"></div>
							<div className="spacer-50"></div>
							<div className="spacer-50"></div>
							<div className="spacer-50"></div>
							<div className="spacer-50"></div>


							<div className="row">
								<div className="col-xs-8 col-xs-offset-2 text-center">
									<h1>Vi holder til på Rosenhoff, mellom Carl Berner og Sinsen.<br /></h1>
								</div>
							</div>

							

							<div id="contact" className="row">


								<div className="spacer-50"></div>
								<div className="spacer-50"></div>
								<div className="spacer-50"></div>
								<div className="spacer-50"></div>
								<div className="spacer-50"></div>
								<div className="spacer-50"></div>

								<div className="col-sm-6">
									<Link to="https://goo.gl/maps/6v3eMub7sTS2" target="blank">
										<img src="/images/map.jpg" className="img-responsive" />
									</Link>	
								</div>
								<div className="col-sm-6">
									<div className="row">
										<div className="col-sm-6">
											<h4><u>Booking og leie</u></h4>
											<h4>
												Jonas Barsten
											<br />
												<a href="mailto:jonas@olyp.no">
													jonas@olyp.no
												</a>
											<br />
												<a href="tel:004741547798">
													415 47 798
												</a>
											</h4>
										</div>
										<div className="col-sm-6">
											<h4><u>Bygg og utstyr</u></h4>
											<h4>Haakon Mathisen
											<br />
												<a href="mailto:haakon@olyp.no">
													haakon@olyp.no
												</a>
											<br />
												<a href="tel:004795445314">
													954 45 314
												</a>
											</h4>
										</div>
									</div>
									<div className="row">
										<div className="col-sm-6">
											<h4><u>Kundeforhold</u></h4>
											<h4>Simen Solli Schøien
											<br />
												<a href="mailto:simen@olyp.no">
													simen@olyp.no
												</a>
											<br />
												<a href="tel:004740881349">
													408 81 349
												</a>
											</h4>
										</div>
										<div className="col-sm-6">
											<h4><u>Økonomi</u></h4>
											<h4>Alf Lund Godbolt
											<br />
												<a href="mailto:alf@olyp.no">
													alf@olyp.no
												</a>
											<br />
												<a href="tel:004798428663">
													984 28 663
												</a>
											</h4>
										</div>
									</div>
								</div>
							</div>

							<div className="spacer-50"></div>
							<div className="spacer-50"></div>
							<div className="spacer-50"></div>
							<div className="spacer-50"></div>
							<div className="spacer-50"></div>
							<div className="spacer-50"></div>

						</div>

						<div className="mobile">

							<ReactCSSTransitionGroup
								transitionName='page-content'
								transitionEnterTimeout={300}
								transitionLeaveTimeout={300}
								transitionAppear={true}
								transitionAppearTimeout={300}
							>

								<div style={{minHeight: this.state.window.height - 250}}>

									<div className="container">

										<div className="row">
											<div className="col-xs-8 col-xs-offset-2 text-center">
												<h1>Hos oss kan du leie øverom både fast og på timesbasis.</h1>
											</div>
										</div>

										<div className="container mobile">
											<div id="book-room-button" className="text-center">
												<a href="https://me.olyp.no">
													<h1>Book Rom</h1>
												</a>
											</div>
										</div>

									</div>

								</div>

							</ReactCSSTransitionGroup>
						</div>

						<div id="mobile-content" className="mobile">

							<div className="container text-center">
								<img 
									onClick={() => {this.scrollToAnchor('mobile-content')}}
									className="arrow" 
									src="/images/arrow-down.png" 
								/>
							</div>

							<div className="container text-center">
								<div className="row">
									<div className="col-xs-4 col-xs-offset-4">

										<VivusContainer duration={300}>
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
								<h1><u>6 Øverom</u></h1>
								<h1>Fast leie<br />1 til 3 pers</h1>
							</div>


							<div className="container text-center">
								<div className="row">
									<div className="col-xs-4 col-xs-offset-4">
										
										<VivusContainer duration={200}>
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
								<h1><u>3 Øverom</u></h1>
								<h1>Fast leie<br />1 til 5 pers</h1>
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
								<h1><u>1 Preprodrom</u></h1>
								<h1>Timesleie<br />1 til 8 pers</h1>
							</div>

							<div className="container text-center">
								<div className="row">
									<div className="col-xs-10 col-xs-offset-1">

										<VivusContainer duration={200}>
											<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 277.3 36.2">
											    <path 
											    	d="M277.3,35.6H0M115.1,21a7.3,7.3,0,1,0,7.3,7.3A7.3,7.3,0,0,0,115.1,21Zm0,4.9a2.3,2.3,0,1,0,2.3,2.3A2.3,2.3,0,0,0,115.1,26Zm44.9,0a2.3,2.3,0,1,0,2.3,2.3A2.3,2.3,0,0,0,159.9,26Zm0-4.9a7.3,7.3,0,1,0,7.3,7.3A7.3,7.3,0,0,0,159.9,21Zm7.1,8.2h7.2l1.5-4.3V16.6c-.9-5.8-8.6-5.8-8.6-5.8H153.6L145.4.6H112.7L101.3,11.9V23.4s-.7,5.9,6,5.9m-4.8-18.5h44s.4-2,1.9-2h3.5m-5.4,2.3s.2,1.7,1.7,1.7h2.1s1.1,0,1.1-1.8v-.2h2.1M130.3.6V10.8M118.9.6l-9.5,10.2m-3.6,3h-4.5v7.8h4.5Zm8.2.9h4.7m15.1,0h4.7M121.9,27h31.7m-.9,2.3H121.9"
											    	fill="none" 
											    	stroke="#ea2427" 
											    	strokeMiterlimit="10"
											    />											
											</svg>
										</VivusContainer>

									</div>
								</div>
								<h1><u>Drive-in-lager</u></h1>
								<h1>Direkte tilgang via garasje</h1>
							</div>

							<div className="container text-center">
								<div>
									<img className="img-responsive" src="/images/art-christina.jpg" />
								</div>
								<h1>70 m2 Fellesarealer</h1>
							</div>

							<div className="spacer-30"></div>

							<div className="container">
								<div className="row">
									<div className="col-xs-10 col-xs-offset-1">
										<img src="/images/art-dereck.png" className="img-responsive"/>
									</div>
								</div>
							</div>

						
							<div className="container text-center">
								<div className="row">
									<div className="col-xs-12">
										<h1>Vi holder til på<br />Rosenhoff, mellom<br />Carl Berner og Sinsen.</h1>
									</div>
								</div>
							</div>

							<div id="contact-mobile" className="container">		
								<Link to="https://goo.gl/maps/6v3eMub7sTS2" target="blank">
									<img src="/images/map.jpg" className="img-responsive" />
								</Link>	
							</div>

							<div className="container text-center">

								<h4><u>Booking og leie</u></h4>
								<h4>
									Jonas Barsten
								<br />
									<a href="mailto:jonas@olyp.no">
										jonas@olyp.no
									</a>
								<br />
									<a href="tel:004741547798">
										415 47 798
									</a>
								</h4>

								<br />

								<h4><u>Bygg og utstyr</u></h4>
								<h4>Haakon Mathisen
								<br />
									<a href="mailto:haakon@olyp.no">
										haakon@olyp.no
									</a>
								<br />
									<a href="tel:004795445314">
										954 45 314
									</a>
								</h4>

								<br />

								<h4><u>Kundeforhold</u></h4>
								<h4>Simen Solli Schøien
								<br />
									<a href="mailto:simen@olyp.no">
										simen@olyp.no
									</a>
								<br />
									<a href="tel:004740881349">
										408 81 349
									</a>
								</h4>

								<br />

								<h4><u>Økonomi</u></h4>
								<h4>Alf Lund Godbolt
								<br />
									<a href="mailto:alf@olyp.no">
										alf@olyp.no
									</a>
								<br />
									<a href="tel:004798428663">
										984 28 663
									</a>
								</h4>


							</div>
						</div>

					</div>

				</div>
			</div>
		);
	};
}

export default Home;

