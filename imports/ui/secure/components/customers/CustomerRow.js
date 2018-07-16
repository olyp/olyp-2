import React  from 'react';
import { Glyphicon } from 'react-bootstrap';

const CustomerRow = (props) => {

	const customer = props.customer;
	const url = '/secure/customers/' + customer._id;
	const type = (customer && customer.type) ? <p>{customer.type}</p> : null;
	const glyph = (customer && customer.type == 'person') ? 'user' : 'briefcase';
	const hover = props.hover ? 'hover' : '';

	return (
		<div onClick={props.onClick} style={{paddingBottom: '14px'}}>
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

export default CustomerRow;