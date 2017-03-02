import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import {Link} from 'react-router';

// import AccountsUI from '../../../AccountsUI.js';

export default class Home extends Component {
	constructor(props) {
		super(props);

		this.state = {
			innerHeight: window.innerHeight,
			logoO: {top: 297, left: (window.innerWidth / 2) - 200},
			logoL: {top: 188, left: (window.innerWidth / 2) - 19},
			logoY: {top: 297, left: (window.innerWidth / 2) + 126},
			logoP: {top: 407, left: (window.innerWidth / 2) - 20},
			arrow: {top: 550, left: (window.innerWidth / 2) - 20}
		}
	}

	componentDidMount() {

		// Scrolling Logo
		$(window).scroll( (event) => {

			var scroll = $(window).scrollTop();
			var width = window.innerWidth;

			if (scroll >= 560) {
				$('#custom-nav').fadeIn();
			}

			if (scroll < 560) {
				$('#custom-nav').fadeOut();
			}

			if (scroll < 285) {

				this.setState({
					logoO: {left: (scroll * -1.4) + ((width / 2) - 200)},
					logoL: {top: (scroll * -0.65) + 188},
					logoY: {left: (scroll * 1.4) + ((width / 2) + 126)},
   					logoP: {top: (scroll * 1.3) + 407},
   					arrow: {top: scroll + 550},
				})
			}

			// Leave P at footer

			if (scroll > 3480) {

				this.setState({
   					logoP: {top: (284 * 1.3) + 407 - (scroll - 3480)}
				});
			}

			// if (scroll < 3190) {

			// 	$('#overlay-container').css({position: 'absolute'});
			// }

		});

		$(window).resize( (event) => {

			var width = window.innerWidth;
			
			this.setState({
				innerHeight: window.innerHeight,
				logoO: {left: (width / 2) - 200},
				logoL: {left: (width / 2) - 19},
				logoY: {left: (width / 2) + 126},
				logoP: {left: (width / 2) - 20},
				arrow: {left: (width / 2) - 20}
			})
		})
	}

	render() {

		return (
			<div>

				<div id="custom-nav">
					<nav className="navbar navbar-default navbar-fixed-top">
						<div className="container">
							<div className="navbar-header">
								<a className="navbar-brand" href="#">
									<img alt="Brand" src="/images/logo/logo2.png" />
						 		</a>
						    </div>

						    <div className="navbar-right">
						    	<Link className="navbar-text" to="https://me.olyp.no">Book Rom</Link>
								<Link className="navbar-text" to="#home-footer">Kontakt</Link> 
						    </div>
						    
							
						</div>
					</nav>
				</div>

				<div id="overlay-container">
						
					<div className="logo-fragment-container" style={{top: this.state.logoL.top + 'px', left: this.state.logoL.left + 'px'}}>
						<img src="/images/logo/logo-l.png" />
					</div>
			
				
					<div className="logo-fragment-container" style={{top: this.state.logoO.top + 'px', left: this.state.logoO.left + 'px'}}>
						<img src="/images/logo/logo-o.png" style={{zIndex: 1}}/>
					</div>

					<div className="logo-fragment-container" style={{top: this.state.logoY.top + 'px', left: this.state.logoY.left + 'px'}}>
						<img src="/images/logo/logo-y.png" style={{zIndex: 3}}/>
					</div>
				
				
					<div className="logo-fragment-container" style={{top: this.state.logoP.top + 'px', left: this.state.logoP.left + 'px'}}>
						<img src="/images/logo/logo-p.png" />
					</div>
				

					<div id="arrow-container" className="logo-fragment-container" style={{top: this.state.arrow.top + 'px', left: this.state.arrow.left + 'px'}}>
						<img className="arrow-down" src="/images/arrow-down.png" />
					</div>
						
				</div>


				<div id="splash-screen" style={{height: this.state.innerHeight + 'px'}}>
					<img id="splash-screen-logo" src="/images/logo/logo.png" />
					<div id="splash-screen-logo-desktop">
						<img src="/images/logo/logo-oslo.png" />
						<div className="clearfix"></div>
						<img src="/images/logo/logo-lydproduksjon.png" />
					</div>
				</div>


				<div id="home-container" className="container page-container">

					<div className="jumbotron">
						<h1>Her kan du leie <br /> preprodrom på timesbasis, <br />eller leie deg inn i et av våre <br />9 lydkontor / øvingsrom.</h1>
					</div>

					<div className="row">

						<div className="col-md-8 col-md-offset-2">

							<div className="home-features">
								<div className="row">
									<div className="col-md-6">
										<p><u>6 rom</u><br />For solister og små ensembler <br /> (1-3 pers) 12-18 kvm</p>
									</div>
									<div className="col-md-6">
										<p><u>1 rom</u><br />For større ensembler på <br /> (5-7 pers) 34 kvm</p>
									</div>
								</div>
								<div className="row">
									<div className="col-md-6">
										<p><u>3 rom</u><br />For mellomstore ensembler <br /> (3-5 pers) ca 21 kvm</p>
									</div>
									<div className="col-md-6">
										<p><u>Drive-in-lager</u><br />(direkte tilgang via garasje) <br /> 34 kvm Fellesarealer</p>
									</div>
								</div>
							</div>

						</div>

					</div>

					<div className="spacer-50"></div>

					<div className="floor-plan">
						<img src="/images/planskisse.png" />
					</div>

					<div className="jumbotron">
						<h1><u>Book rom</u></h1>
					</div>

					<div className="spacer-50"></div>
					<div className="spacer-50"></div>
					<div className="spacer-10"></div>

					<div id="promo-images">
						<div className="col-md-12">
							<img src="http://eastroom.ca/wp-content/uploads/2016/04/Photos-Desktop-1.jpg" className="img-responsive"/>
						</div>

						<div className="col-md-12">
							<img src="http://eastroom.ca/wp-content/uploads/2016/04/Photos-Desktop-2.jpg" className="img-responsive"/>
						</div>
					</div>

					<div className="clearfix"> </div>

					<div className="spacer-50"></div>
					<div className="spacer-10"></div>
					<div className="spacer-10"></div>

					<div className="jumbotron">
						<h1>
							Vi holder til på
							<br />
							Rosenhoff, mellom
							<br />
							Carl Berner og Sinsen.
							<br />
							&mdash;
						</h1>
						<div className="home-features">
							<p>Vi er et godt øvingslokale, <br /> arbeidssted og knutepunkt <br /> for yrkesmusikere og band i Oslo.</p> 
						</div>
					</div>

					<div className="row">
						<div className="col-md-6">
							<img src="/images/map.jpg" className="img-responsive" />
						</div>

						<div className="col-md-6 home-features">
							<div className="row ">
								<div className="col-md-6">
									<p><u>Booking og leie</u><br />Jonas Barsten<br />jonas@olyp.no</p>
								</div>
								<div className="col-md-6">
									<p><u>Bygg og utstyr</u><br />Haakon Mathisen<br />haakon@olyp.no</p>
								</div>
							</div>
							<div className="row">
								<div className="col-md-6">
									<p><u>Økonomi og faktura</u><br />Alf Godbolt<br />alf@olyp.no</p>
								</div>
								<div className="col-md-6">
									<p><u>Andre henvendelser</u><br />Simen Schøien<br />simen@olyp.no</p>
								</div>
							</div>
						</div>
					</div>
				</div>

				<div className="spacer-50"></div>
				<div className="spacer-50"></div>
				<div className="spacer-50"></div>

				<div id="home-footer" className="container-fluid home-features">
					<div className="container">
						<div className="row">
							<div className="col-md-4">
								<p><u>Olyp</u><br />Olaf Schous vei 6 C<br />0572 Oslo</p>
							</div>
							<div className="text-center col-md-4">
								<img className="arrow-up" src="/images/arrow-up.png" />
							</div>
						</div>
					</div>
					
				</div>
			</div>
		);
	};
}



