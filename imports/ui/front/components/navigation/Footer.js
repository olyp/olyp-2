import React, {Component} from 'react';
import Scroll from 'react-scroll';

const scroll = Scroll.animateScroll;

export default class Footer extends Component {

	render() {
		return (
			<div id="home-footer" className="container-fluid">
				<img 
					onClick={() => {scroll.scrollTo(0, {'duration': 600})}}
					className="arrow" 
					src="/images/arrow-up.png" 
				/>
			</div>
		);
	}
}