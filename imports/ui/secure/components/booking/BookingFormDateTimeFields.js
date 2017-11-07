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

		return (
			<div>
				<div className='form-group'>
					<div className='input-group input-group-lg'>
						<div className='input-group-btn'>
							<a className='btn btn-default'
							   disabled={this.props.disabled}
							   onClick={(e) => this.decrementTime()}
							   onTouchEnd={(e) => { e.preventDefault(); this.decrementTime() }}>
								<span className='glyphicon glyphicon-minus' />
							</a>
						</div>
						<select className='form-control'
								value={date.format("HH:mm")}
								ref='hourSelect'
								onChange={(e) => this.onHourSelectChange()}>
							{hours.map((hour) => {
								return [
									<option key={"hour-" + hour + "-0"}>{padNum(hour) + ":00"}</option>,
									<option key={"hour-" + hour + "-30"}>{padNum(hour) + ":30"}</option>
								]
							})}
						</select>
						<div className='input-group-btn'>
							<a className='btn btn-default'
							   disabled={this.props.disabled}
							   onClick={(e) => this.incrementTime()}
							   onTouchEnd={(e) => { e.preventDefault(); this.incrementTime() }}>
								<span className='glyphicon glyphicon-plus' />
							</a>
						</div>
					</div>
				</div>

				<div className='form-group'>
					<div className='input-group input-group-lg'>
						<div className='input-group-btn'>
							<a className='btn btn-default'
							   disabled={this.props.disabled}
							   onClick={(e) => this.decrementDate() }
							   onTouchEnd={(e) => { e.preventDefault(); this.decrementDate(); }}
							>
								<span className='glyphicon glyphicon-minus' />
							</a>
						</div>
						<input className='form-control'
							   ref='calendarInput'
							   type='text'
							   readOnly={true}
							   size={10}
							   disabled={this.props.disabled}/>
						<div className='input-group-btn'>
							<a className='btn btn-default'
							   disabled={this.props.disabled}
							   onClick={(e) => this.incrementDate() }
							   onTouchEnd={(e) => { e.preventDefault(); this.incrementDate(); }}
							>
								<span className='glyphicon glyphicon-plus' />
							</a>
						</div>
					</div>
				</div>
			</div>
		);
	}
}