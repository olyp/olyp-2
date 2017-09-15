import React, { Component } from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import moment from 'moment-timezone';

import InvoicesFiltered from './InvoicesFiltered';

class Invoices extends Component {
	constructor() {
		super();
		this.state = {
			currentMonth: moment().tz("Europe/Oslo").isoWeekday(1).startOf("month")
		}
	}

	changeMonth(inc) {
		this.setState({currentMonth: this.state.currentMonth.clone().add(inc, "month")});
	}

	render() {

		return (
			<div className="row">
				<div className="col-xs-6">
					<div className="btn-group">
						<a className="btn btn-default" onClick={this.changeMonth.bind(this, -1)}>
							<span className="glyphicon glyphicon-chevron-left"></span>
						</a>
						<a className="btn btn-default" onClick={this.changeMonth.bind(this, 1)}>
							<span className="glyphicon glyphicon-chevron-right"></span>
						</a>
					</div>
				</div>
				<div className="col-xs-6 text-right">
					{this.state.currentMonth.format("YYYY-MM-DD")}
				</div>
				<InvoicesFiltered currentMonth={this.state.currentMonth} />
			</div>
		);
	}
}

export default Invoices;