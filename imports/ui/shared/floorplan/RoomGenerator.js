import React, { Component } from 'react';

import VivusContainer from './VivusContainer.js';

const roomsSVG = {
	one: {
		viewBox: "0 0 127.2 149",
		path: "M126.2,148H1V1H126.2Z"
		
	},
	two: {
		viewBox: "0 0 132.8 149",
		path: "M131.8,148H1V1H131.8Z"
		
	},
	three: {
		viewBox: "0 0 113.2 149",
		path: "M112.2,148H1V1H112.2Z"
		
	},
	four: {
		viewBox: "0 0 248.7 149",
		path: "M1,1H247.7V148H204.3V107.4H1Z"

	},
	five: {
		viewBox: "0 0 182.8 292",
		path: "M1,1H181.8V238.8H131V291H1Z"

	},
	six: {
		viewBox: "0 0 182.9 156.9",
		path: "M181.9,155.9H1V1H181.9Z"
		
	},
	seven: {
		viewBox: "0 0 179.1 160.5",
		path: "M178.1,159.5H1V1H178.1Z"
		
	},
	eight: {
		viewBox: "0 0 108.1 160.5",
		path: "M107.1,159.5H1V1H107.1Z"
		
	},
	nine: {
		viewBox: "0 0 158.8 160.5",
		path: "M157.8,159.5H1V1H157.8Z"
		
	},
	ten: {
		viewBox: "0 0 158.8 160.5",
		path: "M157.8,159.5H1V1H157.8Z"
		
	},
	storage: {
		viewBox: "0 0 140.7 149",
		path: "M139.7,148H1V1H139.7Z"
		
	},
	toilet: {
		viewBox: "0 0 123.1 149",
		path: "M122.1,148H1V1H122.1Z"
	},
	'wall-one': {
		viewBox: "0 0 459.6 263.7",
		path: "M458.6,0V157.4L318.6,262.7H0"

	},
	'wall-two': {
		viewBox: "0 0 16.2 138.6",
		path: "M0,1H15.2V138.6"

	}
}

class RoomGenerator extends Component {

	constructor(props) {
		super(props);
		this.state = {
			room: {}
		}
	}

	componentDidMount() {

		const room = roomsSVG[this.props.room];

		this.setState({
			room: room
		});
	}

	render () {

		const room = this.state.room;
		const path = room.path;

		const viewBox = room.viewBox;

		const strokeWidth = this.props.strokeWidth ? this.props.strokeWidth : "2";
		const color = this.props.color ? this.props.color : "#ea2427";

		if (!room.path) {
			return <p>Loading</p>
		}

		const randomId = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)


		const svgElement = 
			<svg id={randomId} xmlns="http://www.w3.org/2000/svg" viewBox={viewBox}>
				<path 
					d={room.path}
					fill="none" 
					stroke={color}
					strokeMiterlimit="10"
					strokeWidth={strokeWidth}
					data-delay={this.props.delay}
				/>
			</svg>

		if (this.props.animate) {

			return (
				<VivusContainer svgId={randomId} duration={this.props.duration}>
					{svgElement}
				</VivusContainer>

			);

		}

		return (
			<div>
				{svgElement}
			</div>
		);

	}
}

export default RoomGenerator;