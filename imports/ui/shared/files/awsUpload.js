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
			done: this.s3Done.bind(this),
			progressall: function (e, data) {
            	var progress = parseInt(data.loaded / data.total * 100, 10);
            	$('#progress .progress-bar').css(
                	'width',
                	progress + '%'
            	);
        	}
		});

	}

	s3Add (e, data) {

		var params = [];

		data.files.map((file) => {

			const fileName = file.name;
			const contentType = file.type;

			Meteor.call('file.generateUploadTicket', fileName, (err, res) => {
				if (err) {
					console.log(err);
				} else {
					data.url = res.endpoint_url;
					data.formData = res.params;

					// Upload file
					data.submit();
				}
			});

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
					<input id="fileInput" type="file" name="file" multiple/>
				</form>
				<div id="progress" className="progress">
					<div className="progress-bar progress-bar-success"></div>
				</div>
			</div>
		);
	}
}

export default awsUpload;