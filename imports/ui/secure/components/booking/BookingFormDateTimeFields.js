import React, {Component} from 'react';
import moment from "moment-timezone";

const hours = [];
for (let i = 0; i < 24; i++) {
	hours.push(i);
}

function padNum(num) {
	if (num < 10) {
		return "0" + num;
	} else {
		return num.toString();
	}
}

export default class BookingFormDateTimeFields extends React.Component {
	componentDidMount () {
		var calendarInput = this.refs["calendarInput"];

		jQuery(calendarInput)
			.datepicker({
				dateFormat: "dd.mm.yy",
				firstDay: 1,
				onSelect: function (dateText) {
					this.datePickerDate = dateText;
					this.updateDate();
				}.bind(this)
			})
			.datepicker("setDate", moment(this.props.value).toDate());
		this.setDatePickerDate();
	}

	updateDate () {
		var hourSelect = this.refs["hourSelect"];
		var newDate = moment(this.datePickerDate + " " + hourSelect.value, "DD.MM.YYYY HH:mm");
		this.props.onChange(newDate.valueOf());
	}

	onHourSelectChange () {
		this.updateDate();
	}

	decrementTime () {
		if (this.props.disabled) return;

		var newDate = moment(this.props.value);
		newDate.subtract(30, "minutes");
		this.props.onChange(newDate.valueOf());
	}

	incrementTime () {
		if (this.props.disabled) return;

		var newDate = moment(this.props.value);
		newDate.add(30, "minutes");
		this.props.onChange(newDate.valueOf());
	}

	decrementDate () {
		if (this.props.disabled) return;

		var newDate = moment(this.props.value);
		newDate.subtract(1, "days");
		this.props.onChange(newDate.valueOf());
	}

	incrementDate () {
		if (this.props.disabled) return;

		var newDate = moment(this.props.value);
		newDate.add(1, "days");
		this.props.onChange(newDate.valueOf());
	}

	componentDidUpdate () {
		// If the date is set from the outside, we need to update the date picker internal state here.
		var calendarInput = this.refs["calendarInput"];
		jQuery(calendarInput)
			.datepicker("setDate", moment(this.props.value).toDate());

		this.setDatePickerDate();
	}

	setDatePickerDate () {
		var calendarInput = this.refs["calendarInput"];
		this.datePickerDate = moment(jQuery(calendarInput).datepicker("getDate")).format("DD.MM.YYYY");
	}

	render () {
		var date = moment(this.props.value);

		return React.DOM.div(null,
			React.DOM.div({className: "form-group"},
				React.DOM.div({className: "input-group input-group-lg"},
					React.DOM.div({className: "input-group-btn"},
						React.DOM.a({className: "btn btn-default", disabled: this.props.disabled, onClick: this.decrementTime.bind(this), onTouchEnd: function (e) { e.preventDefault(); this.decrementTime(); }.bind(this)},
							React.DOM.span({className: "glyphicon glyphicon-minus"}))),
					React.DOM.select({className: "form-control", value: date.format("HH:mm"), ref: "hourSelect", onChange: this.onHourSelectChange, disabled: this.props.disabled},
						hours.map(function (hour) {
							return [
								React.DOM.option({key: "hour-" + hour + "-0"}, padNum(hour) + ":00"),
								React.DOM.option({key: "hour-" + hour + "-30"}, padNum(hour) + ":30")
							];
						})),
					React.DOM.div({className: "input-group-btn"},
						React.DOM.a({className: "btn btn-default", disabled: this.props.disabled, onClick: this.incrementTime.bind(this), onTouchEnd: function (e) { e.preventDefault(); this.incrementTime(); }.bind(this)},
							React.DOM.span({className: "glyphicon glyphicon-plus"}))))),
			React.DOM.div({className: "form-group"},
				React.DOM.div({className: "input-group input-group-lg"},
					React.DOM.div({className: "input-group-btn"},
						React.DOM.a({className: "btn btn-default", disabled: this.props.disabled, onClick: this.decrementDate.bind(this), onTouchEnd: function (e) { e.preventDefault(); this.decrementDate(); }.bind(this)},
							React.DOM.span({className: "glyphicon glyphicon-minus"}))),
					React.DOM.input({ref: "calendarInput", type: "text", className: "form-control", readOnly: true, size: 10, disabled: this.props.disabled}),
					React.DOM.div({className: "input-group-btn"},
						React.DOM.a({className: "btn btn-default", disabled: this.props.disabled, onClick: this.incrementDate.bind(this), onTouchEnd: function (e) { e.preventDefault(); this.incrementDate(); }.bind(this)},
							React.DOM.span({className: "glyphicon glyphicon-plus"}))))));
	}
}