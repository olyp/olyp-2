import React, { Component } from 'react';

import CustomerAddCompany from './CustomerAddCompany';
import CustomerAddPerson from './CustomerAddPerson';

class CustomerAdd extends Component {

	constructor(props) {
		super(props);
		this.state = {
			company: true
		}
	}

	toggleCompanyAndPerson () {
		this.setState({
			company: !this.state.company
		});
	}

	render () {

		const companyActiveClass = this.state.company ? 'room-selector-active' : '';
		const personActiveClass = !this.state.company ? 'room-selector-active' : '';

		const view = this.state.company ? <CustomerAddCompany userId={this.props.params.userId}/> : <CustomerAddPerson userId={this.props.params.userId} />;

		return (
			<div className="container">

				<div className="row">
					<div className={`col-xs-6 button-large hover room-selector ${companyActiveClass}`} onClick={this.toggleCompanyAndPerson.bind(this)}>
						Bedrift
					</div>
					<div className={`col-xs-6 button-large hover room-selector ${personActiveClass}`} onClick={this.toggleCompanyAndPerson.bind(this)}>
						Privat
					</div>
				</div>

				<hr />

				{view}
				
			</div>
		);
	}
}

export default CustomerAdd;