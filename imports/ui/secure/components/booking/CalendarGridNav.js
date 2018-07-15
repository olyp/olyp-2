import React, {Component} from 'react';
import moment from "moment-timezone";
import { Link } from 'react-router';

function currentWeekSummary(baseDayVal, firstDayVal, lastDayVal) {
	var firstDay = moment(firstDayVal);
	var lastDay = moment(lastDayVal);

	var firstMonth = firstDay.format("MMM");
	var lastMonth = lastDay.format("MMM");

	// return (
	//   <span>
	//     {firstMonth} {firstDay.format("DD")} - {(firstMonth === lastMonth ? "" : (lastMonth + " ")) + lastDay.format("DD")}, {moment(baseDayVal).format("YYYY")}
	//   </span>
	// );

	return (
	  <span>
		{moment(baseDayVal).format("YYYY")}
	  </span>
	);

	// return React.DOM.span(null,
	//     firstMonth + " " + firstDay.format("DD")
	//     + " - "
	//     + (firstMonth === lastMonth ? "" : (lastMonth + " ")) + lastDay.format("DD")
	//     + ", " + moment(baseDayVal).format("YYYY"));
}

export default class CalendarGridNav extends Component {
	render() {
		const props = this.props;

		return (
			<div className='calendar-grid-header' style={{marginBottom: 14}}>
				<a className='btn btn-default' onClick={props.gotoToday}>Today</a>
				{' '}
				<div className='btn-group' style={{marginRight: 10}}>
					<a className='btn btn-default' onClick={(e) => props.gotoWeek(-1)}>
						<span className='glyphicon glyphicon-chevron-left' />
					</a>
					<a className='btn btn-default' onClick={(e) => props.gotoWeek(1)}>
						<span className='glyphicon glyphicon-chevron-right' />
					</a>
				</div>
				{currentWeekSummary(props.baseDay, props.days[0], props.days[props.days.length - 1])}
			</div>
		);
	}
}