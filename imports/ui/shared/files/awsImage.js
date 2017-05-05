import React, { Component } from 'react';

class awsImage extends Component {
	render () {

		const url = 'http://' + Meteor.settings.public.aws.imageBucket + '.s3-website-' + Meteor.settings.public.aws.region + '.amazonaws.com/';
		const size = this.props.size ? (this.props.size + '/') : '';
		const src = url + size + this.props.awsKey;

		return (
			<img 
				src={src} 
				onClick={this.props.onClick}
				className={this.props.className}
			/>
		);
	}
}

export default awsImage;