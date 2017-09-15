import React, { Component } from 'react';
import moment from 'moment-timezone';
import { createContainer } from 'meteor/react-meteor-data';

import InvoicesCollection from '../../../../api/collections/invoices';
// import InvoicesFiltered from './InvoicesFiltered';
import InvoicesTable from './InvoicesTable';

class Invoices extends Component {
	constructor() {
		super();
		this.state = {
			// currentMonth: moment().tz("Europe/Oslo").isoWeekday(1).startOf("month"),
			currentPage: 1,
			pageSize: 100,
			numberOfPages: 0,
			sortField: 'createdAt',
			sortDirection: -1
		}
	}

	componentWillReceiveProps(nextProps) {
		this.setState({
			numberOfPages: Math.ceil(nextProps.numberOfInvoices / 100)
		});
	}

	changeMonth(inc) {
		this.setState({currentMonth: this.state.currentMonth.clone().add(inc, "month")});
	}

	changePage(inc) {

		const newPage = this.state.currentPage + inc;

		if (newPage > 0 && newPage <= this.state.numberOfPages) {
			this.setState({currentPage: newPage});
		}
	}

	reOrder (field) {
		console.log('changing order by: ' + field);
	}

	render() {

		const previousButtonStyle = (this.state.currentPage > 1) ? 'hover room-selector-active' : '';
		const nextButtonStyle = (this.state.currentPage < this.state.numberOfPages) ? 'hover room-selector-active' : '';

		return (
			<div>
				
				<InvoicesTable 
					pageSize={this.state.pageSize} 
					currentPage={this.state.currentPage}
					sortField={this.state.sortField}
					sortDirection={this.state.sortDirection}
					reOrder={this.reOrder}
				/>
		
				<div className="row" style={{marginTop: '10px'}}>
					<div className="col-xs-4">
						<div className={`room-selector ${previousButtonStyle}`} onClick={this.changePage.bind(this, -1)}>Previous</div>
					</div>
					<div className="col-xs-4 text-center">
						<div className="room-selector room-selector-active">{this.state.currentPage} of {this.state.numberOfPages}</div>
					</div>
					<div className="col-xs-4 text-right">
						<div className={`room-selector ${nextButtonStyle}`} onClick={this.changePage.bind(this, 1)}>Next</div>
					</div>
				</div>
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

export default createContainer(() => {

	Meteor.subscribe('allInvoices');

	return {
		numberOfInvoices: InvoicesCollection.find().count()
	}
}, Invoices);