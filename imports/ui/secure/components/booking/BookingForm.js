import React, { Component } from 'react';
import BookingFormDateTimeFields from "./BookingFormDateTimeFields"

export default class BookingForm extends Component {
	render() {
		const props = this.props;

		return React.DOM.form(
			{
				onSubmit(e) {
					e.preventDefault();
					props.onSubmit();
				}
			},
			React.DOM.div({className: "form-group"},
				React.DOM.label(null, "From"),
				React.createElement(BookingFormDateTimeFields, {
					dispatch: props.dispatch,
					value: props.from,
					onChange: props.onFromChange,
					disabled: props.isSubmitting
				})),
			React.DOM.div({className: "form-group"},
				React.DOM.label(null, "To"),
				React.createElement(BookingFormDateTimeFields, {
					dispatch: props.dispatch,
					value: props.to,
					onChange: props.onToChange,
					disabled: props.isSubmitting
				})),
			React.DOM.div({className: "form-group"},
				React.DOM.label(null, "Comment"),
				React.DOM.input({
					type: "text",
					className: "form-control input-lg",
					value: props.comment,
					onChange (e) { props.onCommentChange(e.target.value); },
					disabled: props.isSubmitting
				})),
			React.DOM.input({type: "submit", value: "Book now!", className: "btn btn-success btn-lg", disabled: props.isSubmitting}));
	}
}