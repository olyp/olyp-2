import React, { Component } from 'react';

import Storage from './rooms/Storage.js';
import Toilet from './rooms/Toilet.js';
import Room1 from './rooms/Room1.js';
import Room2 from './rooms/Room2.js';
import Room3 from './rooms/Room3.js';
import Room4 from './rooms/Room4.js';
import Room5 from './rooms/Room5.js';
import Room6 from './rooms/Room6.js';
import Room7 from './rooms/Room7.js';
import Room8 from './rooms/Room8.js';
import Room9 from './rooms/Room9.js';
import Room10 from './rooms/Room10.js';

class FloorPlan extends Component {
	render () {
		return (
			<div id="floor-plan-wrapper">
					
				<div id="floor-plan">

					<div id="fp-room-4-position" className="fp-room-position">
						<Room4 />
					</div>

					<div id="fp-room-3-position" className="fp-room-position">
						<Room3 />
					</div>

					<div id="fp-room-2-position" className="fp-room-position">
						<Room2 />
					</div>

					<div id="fp-room-1-position" className="fp-room-position">
						<Room1 />
					</div>

					<div id="fp-room-toilet-position" className="fp-room-position">
						<Toilet />
					</div>

					<div id="fp-room-storage-position" className="fp-room-position">
						<Storage />
					</div>

					<div id="fp-room-5-position" className="fp-room-position">
						<Room5 />
					</div>

					<div id="fp-room-6-position" className="fp-room-position">
						<Room6 />
					</div>

					<div id="fp-room-7-position" className="fp-room-position">
						<Room7 />
					</div>

					<div id="fp-room-8-position" className="fp-room-position">
						<Room8 />
					</div>

					<div id="fp-room-9-position" className="fp-room-position">
						<Room9 />
					</div>

					<div id="fp-room-10-position" className="fp-room-position">
						<Room10 />
					</div>

					<div id="fp-wall-1-position" className="fp-room-position">
						<div className="fp-room-wrapper">
							<div id="fp-wall-1" className="fp-room"></div>
						</div>
					</div>

					<div id="fp-wall-2-position" className="fp-room-position">
						<div className="fp-room-wrapper">
							<div id="fp-wall-2" className="fp-room"></div>
						</div>
					</div>

					<div id="fp-wall-3-position" className="fp-room-position">
						<div className="fp-room-wrapper">
							<div id="fp-wall-3" className="fp-room"></div>
						</div>
					</div>

					<div id="fp-wall-4-position" className="fp-room-position">
						<div className="fp-room-wrapper">
							<div id="fp-wall-4" className="fp-room"></div>
						</div>
					</div>

				</div>

			</div>
		);
	}
}

export default FloorPlan;