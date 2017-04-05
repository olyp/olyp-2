import React, { Component } from 'react';
import { createContainer } from 'meteor/react-meteor-data';

import Rooms from '../../../../api/collections/rooms.js'

import Preloader from '../../../shared/preloader/Preloader.js';

class UserSingle extends Component {


	toggleBookingAccessToRoom(roomId) {
		Meteor.call('room.toggleUserBookingAccess', roomId, this.props.user._id, (err, res) => {
			if (err) {
				console.log(err);
			} 
		});
	}

	toggleAccessToRoom(roomId) {
		Meteor.call('room.toggleUserAccess', roomId, this.props.user._id, (err, res) => {
			if (err) {
				console.log(err);
			} 
		});
	}

	render () {

		const user = (this.props.user) ? this.props.user : null;
		const name = (user && user.profile && user.profile.name);
		const email = (user && user.emails && user.emails[0] && user.emails[0].address);

		if (!user) {
			return (
				<Preloader />
			);
		}

		return (
			<div className="container">
				<div className="row">
					<div className="col-xs-4">
						<img className="img-responsive" src="http://eng.icrconference.org/wp-content/uploads/2016/04/blank.gif" />
					</div>
					<div className="col-xs-8">
						<h4>{name}</h4>
						<p>{email}</p>
					</div>
				</div>

				<hr />

				<h4>Can Book:</h4>

				<div className="row">

					{this.props.rooms.map((room) => {

						const userId = user._id;
						const activeClass = (room.canBook && room.canBook.indexOf(userId) != -1) ? 'room-selector-active' : '';

						return (
							<div 
								key={room._id} 
								className={`room-selector col-xs-4 ${activeClass}`}
								onClick={() => {this.toggleBookingAccessToRoom(room._id)}}
							>
								{room.name}
							</div>
						);
					})}
			
				</div>

				<hr />

				<h4>Can Access:</h4>

				<div className="row">

					{this.props.rooms.map((room) => {

						const userId = user._id;
						const activeClass = (room.canAccess && room.canAccess.indexOf(userId) != -1) ? 'room-selector-active' : '';

						return (
							<div 
								key={room._id} 
								className={`room-selector col-xs-4 ${activeClass}`}
								onClick={() => {this.toggleAccessToRoom(room._id)}}
							>
								{room.name}
							</div>
						);
					})}
			
				</div>

				<hr />
				
			</div>
		);
	}
}

export default createContainer((props) => {
	Meteor.subscribe('allUsers');
	Meteor.subscribe('rooms');

	const user = Meteor.users.find({_id: props.params.userId}).fetch();

	return {
		user: user[0],
		rooms: Rooms.find().fetch()
	};
}, UserSingle);