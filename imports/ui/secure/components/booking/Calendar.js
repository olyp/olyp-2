import React, {Component} from 'react';
import CalendarGridAgenda from "./CalendarGridAgenda"
import CalendarGridWeek from "./CalendarGridWeek"
import CalendarGridNav from "./CalendarGridNav"

export default class Calendar extends Component {
	render() {
		const props = this.props;

		return React.DOM.div(null,
			React.createElement(CalendarGridNav, {
				baseDay: props.baseDay,
				days: props.days,
				gotoToday: props.gotoToday,
				gotoWeek: props.gotoWeek
			}),
			React.createElement(CalendarGridAgenda, {
				reservations: props.reservations,
				days: props.days,
				currentUserId: props.currentUserId,
				getProfileNameById: props.getProfileNameById,
				deleteReservation: props.deleteReservation
			}),
			React.createElement(CalendarGridWeek, {
				reservations: props.reservations,
				days: props.days,
				currentUserId: props.currentUserId,
				getProfileNameById: props.getProfileNameById,
				deleteReservation: props.deleteReservation
			}));
	}
}