import React, { Component } from 'react';
import moment from 'moment-timezone';

// import InvoicesFiltered from './InvoicesFiltered';
import InvoicesTable from './InvoicesTable';

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
			<div>
				<InvoicesTable />
			</div>
		);

		return (
			<div className="container">
				<div className="row">
					<div className="col-xs-6">
						<div className="btn-group">
							<div className="room-selector room-selector-active hover" onClick={this.changeMonth.bind(this, -1)}>
								<span className="glyphicon glyphicon-chevron-left"></span>
							</div>
							<div className="room-selector room-selector-active hover" onClick={this.changeMonth.bind(this, 1)}>
								<span className="glyphicon glyphicon-chevron-right"></span>
							</div>
						</div>
					</div>
					<div className="col-xs-6 text-right">
						<div className="room-selector room-selector-active">
							{this.state.currentMonth.format("MMMM 'YY")}
						</div>
					</div>
					
				</div>
			</div>
		);
	}
}

export default Invoices;