import React, { Component } from 'react';

import HomeMobile from './HomeMobile.js';
import FloorPlan from '../../../shared/floorplan/FloorPlan.js';

class Home extends Component {
	render() {
		return (
			<div>	

				<div id="home-container">

					<div id="mobile-home">
						<HomeMobile window={this.props.window}/>
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

