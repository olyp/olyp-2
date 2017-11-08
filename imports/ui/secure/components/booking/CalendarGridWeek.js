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

function formatHour(hour) {
    return padNum(hour) + ":00";
}

const HALF_HOUR_HEIGHT = 13;
const HOUR_HEIGHT = HALF_HOUR_HEIGHT * 2;

function getOffset(offset) {
    return (offset / 30) * HALF_HOUR_HEIGHT;
}

export default class CalendarGridWeek extends Component {
    render() {
        const props = this.props;

        var calendarGridClassNames = ["calendar-grid-week-content"];
        if (props.reservations === null) {
            calendarGridClassNames.push("calendar-grid-week-content-no-data");
        }

        return (
        	<div className='calendar-grid-week'>
				<div className='calendar-grid-week-hours'>
					<div className='calendar-grid-week-hours-header'></div>
					{hours.map((hour) => {
						var classNames = ["calendar-grid-week-hour-cell"];
						if (hour % 2 === 0)
							classNames.push("calendar-grid-week-hour-cell-colored-row");

						return <div key={"hour-" + hour} className={classNames.join(" ")}>{formatHour(hour)}</div>
					})}
				</div>

				<div className='calendar-grid-week'>
					<div className={calendarGridClassNames.join(" ")}>
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
								});

							return <div key={"day-" + label} className='calendar-grid-week-column'>
								<div className='calendar-grid-week-day-header'>{label + " " + day.format("DD.MM")}</div>
								<div className='calendar-grid-week-day-reservations'>
									{hours.map((hour) => {
										var classNames = ["calendar-grid-week-hour-cell"];
										if (hour % 2 === 0)
											classNames.push("calendar-grid-week-hour-cell-colored-row");

										return <div key={"hour-" + hour} className={classNames.join(" ")} />
									})}
									{reservationsForDay.map((reservation) => {
										var dayStartHourOffsetMinutes = (reservation.from.valueOf() - dayStartVal) / 1000 / 60;
										var reservationLengthOffsetMinutes = (reservation.to.valueOf() - reservation.from.valueOf()) / 1000 / 60;
										var classNames = ["calendar-grid-week-reservation"];

										var topOffset = getOffset(dayStartHourOffsetMinutes);
										var bottomOffset = topOffset + getOffset(reservationLengthOffsetMinutes);

										if (topOffset < 0) {
											classNames.push("calendar-grid-week-reservation-overlaps-previous");
										}

										if (bottomOffset > (HOUR_HEIGHT * 24)) {
											classNames.push("calendar-grid-week-reservation-overlaps-next");
										}

										const userId = reservation.booking.userId;
										const profileName = props.getProfileNameById(userId);

										return <div key={"reservation-" + topOffset + "-" + bottomOffset}
													className={classNames.join(" ")}
													title={reservation.comment}
													style={{
														top: Math.max(topOffset, 0) + "px",
														bottom: ((HOUR_HEIGHT * 24) - bottomOffset) + "px"
													}
													}>
											<div className='calendar-grid-week-reservation-user-name'>{profileName}</div>
											<div className='calendar-grid-week-reservation-comment'>{reservation.comment}</div>
											{props.currentUserId === userId && <span className='calendar-grid-week-reservation-buttons'>
												<a style={{cursor: "pointer"}} onClick={() => props.deleteReservation(reservation["_id"])}>
													<span className='glyphicon glyphicon-trash' />
												</a>
											</span>}
										</div>
									})}
								</div>
							</div>
						})}
					</div>
				</div>
			</div>
		);
    }
}