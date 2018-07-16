import React from 'react';

const InvoiceLine = (props) => {

	const leftMargin = props.checkBox ? '38px' : '50px';
	const checkBox = props.checkBox ?
		<div>
			<input type="checkbox"
				checked={props.checked}
				onChange={props.onChange}
			/>
		</div> : null;

	return (
		<div 
			className="col-xs-12"
			style={{
				display: 'flex'
			}}
		>
			{checkBox}
			<div style={{marginLeft: leftMargin}}>
				{props.description}
			</div>
			<div style={{
				marginLeft: 'auto',
				marginRight: '8px'
			}}>
				{props.amount}
			</div>
		</div>
	);
}

export default InvoiceLine;