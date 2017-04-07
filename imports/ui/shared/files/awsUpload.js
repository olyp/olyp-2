import React, { Component } from 'react';

class awsUpload extends Component {

	upload () {
		Meteor.call('file.upload', (err, res) => {
			if (err) {
				console.log(err);
			}
		})
	}

	render () {
		return (
			<div onClick={this.upload.bind(this)}>Upload lol</div>
		);
	}
}

export default awsUpload;