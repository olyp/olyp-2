import React, {Component} from 'react';
import moment from "moment-timezone";
import { Glyphicon } from 'react-bootstrap';

export default class CalendarGridAgenda extends Component {
    render() {
        const props = this.props;

		return <div className='calendar-grid-agenda'>
			{props.days.map((dayValue) => {
				var day = moment(dayValue).tz("Europe/Oslo");
				var dayStart = day.clone();
				var dayEnd = day.clone().endOf("day");
				var label = day.format("ddd");

				var dayStartVal = dayStart.valueOf();
				var dayEndVal = dayEnd.valueOf();

				var reservationsForDay = props.reservations
					.filter((reservation) => {
						var reservationFromVal = moment(reservation.from).valueOf();
						var reservationToVal = moment(reservation.to).valueOf();

						return reservationFromVal < dayEndVal && reservationToVal > dayStartVal;
					})
					.sort((a, b) => a.from - b.from);

				return <div key={"day-" + label}>
					<h2 style={{borderBottom: "1px solid #ccc"}}>{day.format("dddd, DD.MM")}</h2>
					{reservationsForDay.length === 0 && <div
						style={{
							color: "#999",
							fontStyle: "italic",
							textAlign: "center",
							padding: "1em"
						}
						}
					>No bookings</div>}
					{reservationsForDay.map((reservation) => {
						var from = moment(Math.max(moment(reservation.from).valueOf(), dayStartVal));
						var to = moment(Math.min(moment(reservation.to).valueOf(), dayEndVal + 1000));
						const userId = reservation.booking.userId;
						const profileName = props.getProfileNameById(userId);
						const deleteButton = (props.currentUserId == userId) ? <Glyphicon glyph="remove" onClick={() => props.deleteReservation(reservation["_id"])}/> : null;

						return (
							<div key={"reservation-" + reservation["_id"]}
								 className='row'
								 style={{marginBottom: "1em", paddingBottom: "1em", borderBottom: "1px solid #eee"}}>
								<div className='col-xs-3'>
									<div>{from.format("HH:mm")}</div>
									<div>{to.format("HH:mm")}</div>
								</div>
								<div className='col-xs-7'>
									<div style={{fontWeight: "bold", fontSize: 16, lineHeight: 1.2}}>{profileName}</div>
									<div style={{ fontStyle: "italic", color: "#666", fontSize: 11}}>{reservation.comment}</div>
								</div>
								<div className="col-xs-2">
									{deleteButton}
								</div>

							</div>
						)
					})}
				</div>
			})}
		</div>
    }
}