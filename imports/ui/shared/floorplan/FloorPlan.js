import React, { Component } from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import Vivus from 'vivus';

class FloorPlan extends Component {

	componentDidMount() {

		const type = this.props.type ? this.props.type : 'oneByOne';
		const duration = this.props.duration ? this.props.duration : 200;

		new Vivus('vivus-hook', {
			duration: duration,
			type: type,
			reverseStack: false
		});
	}

	render () {

		const strokeWidth = this.props.strokeWidth ? this.props.strokeWidth : "2";
		const color = this.props.color ? this.props.color : "#ea2427";

		const overlayStyles = {
			roomOne: {
				top: 8 + '%',
				left: 57.5 + '%'
			},
			roomTwo: {
				top: 8 + '%',
				left: 42.5 + '%'
			},
			roomThree: {
				top: 8 + '%',
				left: 28.5 + '%'
			},
			roomFour: {
				top: 4 + '%',
				left: 9 + '%'
			},
			roomFive: {
				top: 43 + '%',
				left: 5 + '%'
			},
			roomSix: {
				top: 85 + '%',
				left: 5 + '%'
			},
			roomSeven: {
				top: 85 + '%',
				left: 25.5 + '%'
			},
			roomEight: {
				top: 85 + '%',
				left: 41.5 + '%'
			},
			roomNine: {
				top: 43 + '%',
				left: 24.5 + '%'
			},
			roomTen: {
				top: 43 + '%',
				left: 41.5 + '%'
			},
			storage: {
				top: 8 + '%',
				left: 86.5 + '%'
			},
			toilet: {
				top: 8 + '%',
				left: 71 + '%'
			},
			common: {
				top: 59 + '%',
				left: 72 + '%'
			},
			driveIn: {
				top: 40 + '%',
				left: 91 + '%'
			}
		}

		return (
			<div id="floor-plan-wrapper">

				<div className="floor-plan-overlay">
					<h4 style={overlayStyles.roomOne}>Rom 1</h4>
					<h4 style={overlayStyles.roomTwo}>Rom 2</h4>
					<h4 style={overlayStyles.roomThree}>Rom 3</h4>
					<h4 style={overlayStyles.roomFour}>Rom 4</h4>
					<h4 style={overlayStyles.roomFive}>Rom 5</h4>
					<h4 style={overlayStyles.roomSix}>Rom 6</h4>
					<h4 style={overlayStyles.roomSeven}>Rom 7</h4>
					<h4 style={overlayStyles.roomEight}>Rom 8</h4>
					<h4 style={overlayStyles.roomNine}>Rom 9</h4>
					<h4 style={overlayStyles.roomTen}>Rom 10</h4>
					<h4 style={overlayStyles.storage}>Lager</h4>
					<h4 style={overlayStyles.toilet}>Toalett</h4>
					<h4 style={overlayStyles.common}>Felles</h4>
					<h4 style={overlayStyles.driveIn}>Drive-in</h4>
				</div>
					
				<div id="floor-plan">

					<svg id="vivus-hook" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1014.9 591.1">
					  <title>Asset 15</title>
					  <g id="Layer_2" data-name="Layer 2">
					    <g id="Layer_1-2" data-name="Layer 1">
					      <path d="M66.5,288.2v-.8" fill="none"/>
					    </g>
					    <g id="Layer_3" data-name="Layer 3">
					      <path d="M1,1H247.7V148H204.3V107.4H1Z" fill="none" stroke={color} strokeMiterlimit="10" strokeWidth={strokeWidth}/>
					      <path d="M381.4,148H270.2V1H381.4Z" fill="none" stroke={color} strokeMiterlimit="10" strokeWidth={strokeWidth}/>
					      <path d="M534.7,148H403.9V1H534.7Z" fill="none" stroke={color} strokeMiterlimit="10" strokeWidth={strokeWidth}/>
					      <path d="M680.5,148H555.3V1H680.5Z" fill="none" stroke={color} strokeMiterlimit="10" strokeWidth={strokeWidth}/>
					      <path d="M819.2,148H698.1V1H819.2Z" fill="none" stroke={color} strokeMiterlimit="10" strokeWidth={strokeWidth}/>
					      <path d="M977.8,148H839.1V1H977.8Z" fill="none" stroke={color} strokeMiterlimit="10" strokeWidth={strokeWidth}/>
					      <path d="M998.7,42.2h15.2V179.7" fill="none" stroke={color} strokeMiterlimit="10" strokeWidth={strokeWidth}/>
					      <path d="M1013.9,327.4V484.8L874,590.1H555.3" fill="none" stroke={color} strokeMiterlimit="10" strokeWidth={strokeWidth}/>
					      <path d="M537.9,369.1H381.1V210.6H537.9Z" fill="none" stroke={color} strokeMiterlimit="10" strokeWidth={strokeWidth}/>
					      <path d="M360.8,369.1H203.9V210.6H360.8Z" fill="none" stroke={color} strokeMiterlimit="10" strokeWidth={strokeWidth}/>
					      <path d="M1,130.7H181.8V368.5H131v52.2H1Z" fill="none" stroke={color} strokeMiterlimit="10" strokeWidth={strokeWidth}/>
					      <path d="M182.3,590.1H1.4V435.3H182.3Z" fill="none" stroke={color} strokeMiterlimit="10" strokeWidth={strokeWidth}/>
					      <path d="M381.1,590.1H203.9V431.6H381.1Z" fill="none" stroke={color} strokeMiterlimit="10" strokeWidth={strokeWidth}/>
					      <path d="M508.2,590.1H402.1V431.6H508.2Z" fill="none" stroke={color} strokeMiterlimit="10" strokeWidth={strokeWidth}/>
					    </g>
					  </g>
					</svg>

				</div>

			</div>
		);
	}
}

export default FloorPlan;


					// <div id="fp-room-4-position" className="fp-room-position">
					// 	<RoomGenerator room="four"  duration={200}/>
					// </div>

					// <div id="fp-room-3-position" className="fp-room-position">
					// 	<RoomGenerator room="three" duration={100} />
					// </div>

					// <div id="fp-room-2-position" className="fp-room-position">
					// 	<RoomGenerator room="two" duration={300} />
					// </div>

					// <div id="fp-room-1-position" className="fp-room-position">
					// 	<RoomGenerator room="one" duration={400} />
					// </div>

					// <div id="fp-room-toilet-position" className="fp-room-position">
					// 	<RoomGenerator room="toilet" duration={500} />
					// </div>

					// <div id="fp-room-storage-position" className="fp-room-position">
					// 	<RoomGenerator room="storage" duration={100} />
					// </div>

					// <div id="fp-room-5-position" className="fp-room-position">
					// 	<RoomGenerator room="five" duration={300} />
					// </div>

					// <div id="fp-room-6-position" className="fp-room-position">
					// 	<RoomGenerator room="six" duration={200} />
					// </div>

					// <div id="fp-room-7-position" className="fp-room-position">
					// 	<RoomGenerator room="seven" duration={400} />
					// </div>

					// <div id="fp-room-8-position" className="fp-room-position">
					// 	<RoomGenerator room="eight" animate duration={600} />
					// </div>

					// <div id="fp-room-9-position" className="fp-room-position">
					// 	<RoomGenerator room="nine" animate={400} duration={700} />
					// </div>

					// <div id="fp-room-10-position" className="fp-room-position">
					// 	<RoomGenerator room="ten" animate duration={100} />
					// </div>

					// <div id="fp-wall-1-position" className="fp-room-position">
					// 	<RoomGenerator room="wall-one" animate={1000} duration={600} />
					// </div>

					// <div id="fp-wall-2-position" className="fp-room-position">
					// 	<RoomGenerator room="wall-two" animate={100} duration={400} />
					// </div>