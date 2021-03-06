import React, { Component } from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import big from 'big.js';

import Rooms from '../../../../api/collections/rooms';

class RoomBookingAgreementRow extends Component {
	render () {

		const rooms = this.props.rooms;
		const agreement = this.props.agreement;

		const roomsById = {};
		rooms.forEach((room) => roomsById[room["_id"]] = room);

		const roomId = agreement.roomId;
		const room = roomsById[roomId];

		const unity = (agreement.type == 'hourlyRental') ? 'kr/t' : 'kr/mnd';
		const freeHours = (agreement.type == 'hourlyRental' && agreement.freeHours != 0) ? <div className='col-xs-4 text-right'>{agreement.freeHours}t inkl</div> : null;

		return (
			<div className="olyp-panel" onClick={this.props.onClick ? this.props.onClick : null}>
				<div className="row">
					<div className='col-xs-4'>{room ? room.name : null}</div>
					<div className='col-xs-4 text-center'>{big(agreement.price || agreement.hourlyPrice).toFixed(0)}{unity}</div>
					{freeHours}
				</div>
			</div>
		);
	}
}

export default withTracker((props) => {
	Meteor.subscribe('allRooms');

	return {
		rooms: Rooms.find().fetch()
	};

})(RoomBookingAgreementRow);