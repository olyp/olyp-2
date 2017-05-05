import React, { Component } from 'react';
import { HTTP } from 'meteor/http';
import 'blueimp-file-upload';

class awsUpload extends Component {

	componentDidMount() {

		const id = '#' + this.props.elementId;

		$(id).fileupload({
			// acceptFileTypes: /(gif|jpe?g|png)$/i,
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

		$('#progress').css('display', 'block');

		const type = this.props.image ? 'image' : 'file';

		var params = [];

		data.files.map((file) => {

			const fileName = file.name;
			// const contentType = file.type;

			Meteor.call('file.generateUploadTicket', fileName, type, (err, res) => {
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
	}

	s3Done (e, data) {

		$('#progress').css('display', 'none');

		const type = this.props.image ? 'image' : 'file';

		const file = {
			awsKey: data.formData.key,
			name: data.files[0].name,
			size: data.files[0].size,
			type: data.files[0].type
		};

		Meteor.call('file.registerFile', file, type, (err, res) => {
			if (err) {
				console.log(err);
				$('#progress .progress-bar').css('width','0%');
			} else {
				Bert.alert('File uploaded', 'success', 'growl-bottom-right', 'fa-smile-o');
				$('#progress .progress-bar').css('width','0%');
			}
		});
	}

	render () {

		const accept = this.props.image ? "image/*" : '*';

		return (
			<div>
				<form>
					<input 
						id={this.props.elementId}
						type="file"
						accept={accept} 
						style={{display: 'none'}}
						multiple
					/>
				</form>
				<div id="progress" className="progress" style={{display: 'none'}}>
					<div className="progress-bar progress-bar-success"></div>
				</div>
			</div>
		);
	}
}

export default awsUpload;