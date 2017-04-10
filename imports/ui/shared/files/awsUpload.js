import React, { Component } from 'react';
import { HTTP } from 'meteor/http';
import 'blueimp-file-upload';

class awsUpload extends Component {

	componentDidMount() {

		$('#fileInput').fileupload({
			// acceptFileTypes: acceptFileType,
			// maxFileSize: maxFileSize,
			paramName: 'file',
			add: this.s3Add.bind(this),
			dataType: 'xml',
			done: this.s3Done.bind(this)
		});

	}

	s3Add (e, data) {

		var filename = data.files[0].name;
		var contentType = data.files[0].type;
		var params = [];

		Meteor.call('file.generateUploadTicket', filename, (err, res) => {
			if (err) {
				console.log(err);
			} else {
				data.url = res.endpoint_url;
				data.formData = res.params;
				data.submit();
			}
		});

		return params;
	};

	s3Done (e, data) {
		console.log('Done ...');
	}

	render () {

		return (
			<div>
				<form>
					<input id="fileInput" type="file" name="file" />
				</form>
			</div>
		);
	}
}

export default awsUpload;