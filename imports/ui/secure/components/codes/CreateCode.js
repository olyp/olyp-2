import React, {Component} from 'react';
import DateTime from 'react-datetime';
import moment from 'moment';

export default class CreateCode extends Component {

	constructor(props) {
		super(props);
		this.state = {
			validFrom: '',
			validTo: ''
		}
	}

	generateDoorCode () {

		if (!this.state.validFrom || !this.state.validTo) {
			Bert.alert('Add time range', 'warning', 'growl-bottom-right', 'fa-frown-o');

		} else {

			const validFrom = this.state.validFrom.toISOString();
			const validTo = this.state.validTo.toISOString();

			if (validFrom >= validTo) {
				Bert.alert('Valid from is higher than or equal to valid to', 'warning', 'growl-bottom-right', 'fa-frown-o');

			} else {

				Meteor.call('doorCode.add', 'no user', validFrom, validTo, (err, res) => {
					if (err) {
						console.log(err);
					} else {
						Bert.alert('Code added', 'success', 'growl-bottom-right', 'fa-smile-o');
					}
				});

			}
		}
	}

	render() {
		return(
			<div className="row">
				<div className="col-sm-3">
					<DateTime
						timeFormat="DD/MM/YY HH:mm"
						inputProps={{'placeholder': 'Valid from ...'}}
						onChange={(date) => {this.setState({validFrom: date})}} 
					/>
				</div>
				<div className="col-sm-3">
					<DateTime 
						timeFormat="DD/MM/YY HH:mm"
						inputProps={{'placeholder': 'Valid to ...'}}
						onChange={(date) => {this.setState({validTo: date})}}
					/>
				</div>
				<div className="col-sm-6">
					<button onClick={this.generateDoorCode.bind(this)}>Generate temporary door code</button>
				</div>
			</div>
		);
	}
}