import React, {Component} from 'react';
import moment from "moment-timezone";

function currentWeekSummary(baseDayVal, firstDayVal, lastDayVal) {
    var firstDay = moment(firstDayVal);
    var lastDay = moment(lastDayVal);

    var firstMonth = firstDay.format("MMM");
    var lastMonth = lastDay.format("MMM");

    return React.DOM.span(null,
        firstMonth + " " + firstDay.format("DD")
        + " - "
        + (firstMonth === lastMonth ? "" : (lastMonth + " ")) + lastDay.format("DD")
        + ", " + moment(baseDayVal).format("YYYY"));
}

export default class CalendarGridNav extends Component {
    render() {
        const props = this.props;

        return React.DOM.div({style: {marginBottom: 14}, className: "calendar-grid-header"},
            React.DOM.a({
                className: "btn btn-default", onClick: props.gotoToday
            }, "Today"),
            " ",
            React.DOM.div({className: "btn-group", style: {marginRight: 10}},
                React.DOM.a({
                    className: "btn btn-default",
                    onClick: function () {
                        props.gotoWeek(-1);
                    }
                }, React.DOM.span({className: "glyphicon glyphicon-chevron-left"})),
                React.DOM.a({
                    className: "btn btn-default",
                    onClick: function () {
                        props.gotoWeek(1);
                    }
                }, React.DOM.span({className: "glyphicon glyphicon-chevron-right"}))),
            " ",
            currentWeekSummary(props.baseDay, props.days[0], props.days[props.days.length - 1]))
    }
}