import React, {Component} from 'react';
// import bcrypt from 'bcrypt';

// const saltRounds = 10;

export default class CreateCode extends Component {

	handleSubmit(event) {
		event.preventDefault();


		// bcrypt.genSalt(saltRounds, (err, salt) => {
		//     bcrypt.hash(this.refs.code.value, salt, (err, hash) => {
		       
		// 		Meteor.call('addCode', hash, (err, res) => {
		// 			if (err) {
		// 				console.log(err);
		// 			} else {
		// 				Bert.alert('Code added', 'success', 'growl-bottom-right', 'fa-smile-o');
		// 				this.refs.code.value = '';
		// 			}
		// 		});

		//     });
		// });

		Meteor.call('doorCode.add', this.refs.code.value, (err, res) => {
			if (err) {
				console.log(err);
			} else {
				Bert.alert('Code added', 'success', 'growl-bottom-right', 'fa-smile-o');
				this.refs.code.value = '';
			}
		});



	}

	render() {
		return(
			<div>
				<form onSubmit={this.handleSubmit.bind(this)}>
					<input
						type="number"
						min="100000"
						max="999999"
						ref="code"
					/>
				</form>
			</div>
		);
	}
}