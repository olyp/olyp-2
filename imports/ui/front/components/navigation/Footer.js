import React, {Component} from 'react';
import Scroll from 'react-scroll';

const scroll = Scroll.animateScroll;

export default class Footer extends Component {

	render() {
		return (
			<div id="home-footer" className="container-fluid">
				<div className="text-center row">
					<div className="col-xs-5">
						<a href="https://goo.gl/maps/6v3eMub7sTS2" target="blank">
							<p>Olaf Schous Vei 6</p>
						</a>
					</div>
					<div className="col-xs-2">
						<img 
							onClick={() => {scroll.scrollTo(0, {'duration': 600})}}
							className="arrow" 
							src="/images/arrow-up.png" 
						/>
					</div>
					<div className="col-xs-5">
						<a href="https://goo.gl/maps/6v3eMub7sTS2" target="blank">
							<p>Rosenhoff</p>
						</a>
					</div>
				</div>
			</div>
		);
	}
}