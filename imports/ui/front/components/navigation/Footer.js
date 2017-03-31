import React, {Component} from 'react';
import Scroll from 'react-scroll';

const scroll = Scroll.animateScroll;

export default class Footer extends Component {

	render() {
		return (
			<div id="home-footer" className="container-fluid">
				<div className="text-center row">
					<div className="col-xs-5">
						<p>Olaf Schous Vei 6</p>
					</div>
					<div className="col-xs-2">
						<img 
							onClick={() => {scroll.scrollTo(0, {'duration': 600})}}
							className="arrow" 
							src="/images/arrow-up.png" 
						/>
					</div>
					<div className="col-xs-5">
						<p>Rosenhoff</p>
					</div>
				</div>
			</div>
		);
	}
}