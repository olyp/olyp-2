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

	if (props.type == 'extraLine') {
		return (
			<div 
				className="col-xs-12"
				style={{display: 'flex'}}
			>
				<a className="btn btn-danger btn-xs"
					onClick={(e) => props.delClick(e)}
					style={{
						marginRight: '5px',
						padding: '6px 12px'
					}}
				>
					<span 
						className='glyphicon glyphicon-trash'
						style={{
							color: 'white'
						}}
					/>
				</a>
				<input 
					type="text"
					placeholder='Ekstra lager ...'
					value={props.description}
					onChange={(e) => props.descChange(e)}
					style={{
						textAlign: 'left',
						paddingLeft: '7px'
					}}
				/>
				<input type="text"
					placeholder='NOK'
					value={props.amount}
					style={{
						marginLeft: '5px',
						maxWidth: '75px'
					}}
					onChange={(e) => props.amountChange(e)}
				/>
			</div>
		);
	}

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