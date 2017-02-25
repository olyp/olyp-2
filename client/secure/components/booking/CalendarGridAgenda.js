import React, {Component} from 'react';
import moment from "moment-timezone";

export default class CalendarGridAgenda extends Component {
    render() {
        const props = this.props;

        return React.DOM.div({className: "calendar-grid-agenda"},
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
                    })
                    .sort((a, b) => a.from - b.from);

                return React.DOM.div({key: "day-" + label},
                    React.DOM.h2({
                        style: {borderBottom: "1px solid #ccc"}
                    }, day.format("dddd, DD.MM")),
                    reservationsForDay.length === 0 && React.DOM.div({
                        style: {
                            color: "#999",
                            fontStyle: "italic",
                            textAlign: "center",
                            padding: "1em"
                        }
                    }, "No bookings"),
                    reservationsForDay.map(function (reservation) {
                        var from = moment(Math.max(moment(reservation.from).valueOf(), dayStartVal));
                        var to = moment(Math.min(moment(reservation.to).valueOf(), dayEndVal + 1000));
                        const userId = reservation.booking.userId;
                        const profileName = props.getProfileNameById(userId);

                        return React.DOM.div(
                            {
                                key: "reservation-" + reservation["_id"],
                                className: "row",
                                style: {marginBottom: "1em", paddingBottom: "1em", borderBottom: "1px solid #eee"}
                            },
                            React.DOM.div({className: "col-xs-3"},
                                React.DOM.div(null, from.format("HH:mm")),
                                React.DOM.div(null, to.format("HH:mm"))),
                            React.DOM.div({className: "col-xs-9"},
                                React.DOM.div({style: {fontWeight: "bold", fontSize: 16, lineHeight: 1.2}}, profileName),
                                React.DOM.div({
                                    style: {
                                        fontStyle: "italic",
                                        color: "#666",
                                        fontSize: 11
                                    }
                                }, reservation.comment),
                                props.currentUserId === userId && React.DOM.a({
                                    onClick: function () {
                                        props.deleteReservation(reservation["_id"]);
                                    },
                                    className: "btn btn-danger",
                                    style: {marginTop: "1em"}
                                }, React.DOM.span({className: "glyphicon glyphicon-trash"})))
                        );
                    })
                );
            }));
    }
}