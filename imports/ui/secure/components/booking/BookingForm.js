import React, { Component } from 'react';
import BookingFormDateTimeFields from "./BookingFormDateTimeFields"

export default class BookingForm extends Component {
	render() {
		const props = this.props;

		return (
			<form onSubmit={(e) => { e.preventDefault(); props.onSubmit(); }}>
				<div className='form-group'>
					<label>From</label>
					<BookingFormDateTimeFields
						dispatch={props.dispatch}
						value={props.from}
						onChange={props.onFromChange}
						disabled={props.isSubmitting} />
				</div>
				<div className='form-group'>
					<label>To</label>
					<BookingFormDateTimeFields
						dispatch={props.dispatch}
						value={props.to}
						onChange={props.onToChange}
						disabled={props.isSubmitting} />
				</div>
				<div className='form-group'>
					<label>Comment</label>
					<input
						type='text'
						className='form-control input-lg'
						value={props.comment}
						onChange={(e) => props.onCommentChange(e.target.value)}
						disabled={props.isSubmitting}/>
				</div>
				<input
					type='submit'
					value='Book now!'
					className='btn btn-success btn-lg'
					disabled={props.isSubmitting}/>
			</form>
		);}
}