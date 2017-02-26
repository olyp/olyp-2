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

        return React.DOM.div({className: "calendar-grid-week"},
            React.DOM.div({className: "calendar-grid-week-hours"},
                React.DOM.div({className: "calendar-grid-week-hours-header"}),
                hours.map(function (hour) {
                    var classNames = ["calendar-grid-week-hour-cell"];
                    if (hour % 2 === 0)
                        classNames.push("calendar-grid-week-hour-cell-colored-row");


                    return React.DOM.div({
                        key: "hour-" + hour, className: classNames.join(" ")
                    }, formatHour(hour));
                })),
            React.DOM.div({className: calendarGridClassNames.join(" ")},
                props.days.map(function (dayValue) {
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

                    return React.DOM.div({key: "day-" + label, className: "calendar-grid-week-column"},
                        React.DOM.div({className: "calendar-grid-week-day-header"}, label + " " + day.format("DD.MM")),
                        React.DOM.div({className: "calendar-grid-week-day-reservations"},
                            hours.map(function (hour) {
                                var classNames = ["calendar-grid-week-hour-cell"];
                                if (hour % 2 === 0)
                                    classNames.push("calendar-grid-week-hour-cell-colored-row");

                                return React.DOM.div({key: "hour-" + hour, className: classNames.join(" ")});
                            }),
                            reservationsForDay.map(function (reservation) {
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

                                return React.DOM.div(
                                    {
                                        key: "reservation-" + topOffset + "-" + bottomOffset,
                                        className: classNames.join(" "),
                                        title: reservation.comment,
                                        style: {
                                            top: Math.max(topOffset, 0) + "px",
                                            bottom: ((HOUR_HEIGHT * 24) - bottomOffset) + "px"
                                        }
                                    },
                                    React.DOM.div({className: "calendar-grid-week-reservation-user-name"}, profileName),
                                    React.DOM.div({className: "calendar-grid-week-reservation-comment"}, reservation.comment),
                                    props.currentUserId === userId && React.DOM.span(
                                        {className: "calendar-grid-week-reservation-buttons"},
                                        React.DOM.a({
                                        	style: {cursor: "pointer"},
                                            onClick: function () { props.deleteReservation(reservation["_id"]) }
                                        }, React.DOM.span({className: "glyphicon glyphicon-trash"})))
                                );
                            })
                        ));
                })));

    }
}