import React, { Component } from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import { browserHistory } from 'react-router';
import swal from 'sweetalert2';

import Rooms from '../../../../api/collections/rooms.js'

import Preloader from '../../../shared/preloader/Preloader.js';

class RoomSingle extends Component {

	deleteRoom () {
		swal({
			title: 'Are you sure?',
			text: "You will not be able to recover this room!",
			type: 'warning',
			showCancelButton: true,
			confirmButtonColor: '#3085d6',
			cancelButtonColor: '#d33',
			confirmButtonText: 'Yes, delete it!'
		}).then(() => {
			Meteor.call('room.delete', this.props.room._id, (err, res) => {
				if (err) {
					console.log(err);
					swal("Failed", "The room cound not be deleted.", "warning");
				} else {
					browserHistory.goBack();
					Bert.alert('Room deleted', 'success', 'growl-bottom-right', 'fa-smile-o');
				}
			});
		// Since this is a promise, we have to catch "cancel" and say it is ok
		}).catch(swal.noop);
	}

	renameRoom () {

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
			Meteor.call('room.rename', this.props.room._id, result, (err, res) => {
				if (err) {
					console.log(err);
				} else {
					Bert.alert('Room renamed', 'success', 'growl-bottom-right', 'fa-smile-o');
				}
			});
		}).catch(swal.noop);
	}

	render () {

		const room = (this.props.room);
		const name = (room && room.name);

		return (
			<div className="container">
				<div className="row">
					<h4 onClick={this.renameRoom.bind(this)}>{name}</h4>
				</div>
				<hr />
				<div className="row">
					<div className="col-xs-12">
						<div className="delete-large" onClick={this.deleteRoom.bind(this)}>
      						Delete Room
    					</div>
					</div>
				</div>
			</div>
		);
	}
}

export default createContainer((props) => {
	Meteor.subscribe('rooms');

	const room = Rooms.find({_id: props.params.roomId}).fetch();

	return {
		room: room[0]
	};
}, RoomSingle);