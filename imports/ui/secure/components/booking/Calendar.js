import React, {Component} from 'react';
import CalendarGridAgenda from "./CalendarGridAgenda"
import CalendarGridWeek from "./CalendarGridWeek"
import CalendarGridNav from "./CalendarGridNav"

export default class Calendar extends Component {
	render() {
		const props = this.props;

		return (
			<div>
				<CalendarGridNav
					baseDay={props.baseDay}
					days={props.days}
					gotoToday={props.gotoToday}
					gotoWeek={props.gotoWeek}
					roomId={props.roomId}/>
				<CalendarGridAgenda
					reservations={props.reservations}
					days={props.days}
					currentUserId={props.currentUserId}
					getProfileNameById={props.getProfileNameById}
					deleteReservation={props.deleteReservation}/>
				<CalendarGridWeek
					reservations={props.reservations}
					days={props.days}
					currentUserId={props.currentUserId}
					getProfileNameById={props.getProfileNameById}
					deleteReservation={props.deleteReservation}/>
			</div>
		);
	}
}