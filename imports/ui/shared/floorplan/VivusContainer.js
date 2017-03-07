import React, { Component } from 'react';
import Vivus from 'vivus';

class VivusContainer extends Component {

	componentDidMount() {
		new Vivus(this.props.svgId, {
			duration: this.props.duration
		});
	}

	render () {

		return (
			<div className="fp-room-wrapper">
				{this.props.children}
			</div>
		);
	}
}

export default VivusContainer;