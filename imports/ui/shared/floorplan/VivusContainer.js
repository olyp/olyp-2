import React, { Component } from 'react';
import Vivus from 'vivus';

class VivusContainer extends Component {

	componentDidMount() {

		const svgElement = this.refs.container.firstChild;

		new Vivus(svgElement, {
			// Duration in frames
			duration: this.props.duration,
			type: this.props.type
		});
	}

	render () {

		return (
			<div ref="container">
				{this.props.children}
			</div>
		);
	}
}

export default VivusContainer;