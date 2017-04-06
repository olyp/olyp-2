import React, { Component } from 'react';
import { Link } from 'react-router';
import { createContainer } from 'meteor/react-meteor-data';
import swal from 'sweetalert2';

// import Preloader from '../../../shared/preloader/Preloader.js';

import RoomsCollection from '../../../../api/collections/rooms.js';

class Rooms extends Component {

	addRoom () {

		swal({
			title: 'Room name',
			text: 'Choose a name',
			input: 'text',
			showCancelButton: true,
			inputValidator: function (value) {
				return new Promise(function (resolve, reject) {
					if (value) {
						resolve()
					} else {
						reject('You need to write something!')
					}
				})
			}
		}).then((result) => {
			Meteor.call('room.add', result, (err, res) => {
				if (err) {
					console.log(err);
				} else {
					Bert.alert('Room added', 'success', 'growl-bottom-right', 'fa-smile-o');
				}
			});
		}).catch(swal.noop);
	}

	render () {

		return (
			<div className="container">
				<div className="row">
					<div className="text-right">
						<span onClick={this.addRoom.bind(this)} className="glyphicon glyphicon-plus hover"></span>
					</div>
				</div>
				<hr />
				{this.props.rooms.map((room) => {
					const url = '/secure/rooms/' + room._id;

					return (
						<div className="room-list" key={room._id}>
							<Link to={url}>
								<div className="row">
									<div className="col-xs-12">
										<h4>{room.name}</h4>
									</div>
								</div>
							</Link>
							<hr />
						</div>
					);
				})}
			</div>
		);
	}
}

export default createContainer(() => {
	Meteor.subscribe('rooms');

	return {
		rooms: RoomsCollection.find().fetch()
	};
}, Rooms);

