import React, { Component } from 'react';
import { Glyphicon } from 'react-bootstrap';
// import { Link } from 'react-router';
// import swal from 'sweetalert2';

// import AwsImage from '../../../shared/files/awsImage.js';

class CustomerRow extends Component {

	render () {
		const customer = this.props.customer;
		// const profile = user.profile;
		// const email = (user && user.emails && user.emails[0]) ? user.emails[0].address : '';
		const url = '/secure/customers/' + customer._id;
		// const awsKey = (user && user.profile && user.profile.image && user.profile.image.awsKey);

		// const isInternal = this.state.internalPrice ? <p>internal</p> : null;
		const type = (customer && customer.type) ? <p>{customer.type}</p> : null;
		const glyph = (customer && customer.type == 'person') ? 'user' : 'briefcase';
		const hover = this.props.hover ? 'hover' : '';
		// const isAdmin = (user && Roles.userIsInRole(user._id, ['super-admin', 'admin'], 'olyp')) ? <p>admin</p> : null;

		return (
			<div onClick={this.props.onClick}>
				<div className={`row customer-row ${hover}`}>
					<div className="col-xs-4 text-center">
						<Glyphicon 
							glyph={glyph}
							style={{fontSize: 'xx-large', marginTop: '16px'}}
						/>
					</div>
					<div className="col-xs-8">
						<h4>{customer.name}</h4>
						<div className="customer-status">
							{type}
						</div>
					</div>
					
				</div>
			</div>
		);
	}
}

export default CustomerRow;