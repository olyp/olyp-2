import React, { Component } from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import { browserHistory } from 'react-router';
import swal from 'sweetalert2';

import Rooms from '../../../../api/collections/rooms.js'

import Preloader from '../../../shared/preloader/Preloader.js';
import UserRow from '../users/UserRow.js';

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
		}).then((result) => {
			if (result.value) {
				Meteor.call('room.delete', this.props.room._id, (err, res) => {
					if (err) {
						console.log(err);
						swal("Failed", "The room cound not be deleted.", "warning");
					} else {
						browserHistory.goBack();
						Bert.alert('Room deleted', 'success', 'growl-bottom-right', 'fa-smile-o');
					}
				});
			}
		});
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
			if (result.value) {
				Meteor.call('room.rename', this.props.room._id, result.value, (err, res) => {
					if (err) {
						console.log(err);
					} else {
						Bert.alert('Room renamed', 'success', 'growl-bottom-right', 'fa-smile-o');
					}
				});	
			}
		});
	}

	getUserById (userId) {
		const user = Meteor.users.find({_id: userId}).fetch();
		return user[0];
	}

	render () {

		if (this.props.loading) {
			return <Preloader />
		}

		const room = this.props.room;
		const name = (room && room.name);
		const usersWhoCanBook = (room && room.canBook) ? room.canBook : [];
		const usersWhoCanAccess = (room && room.canAccess) ? room.canAccess : [];

		return (
			<div className="container">
				<div className="row">
					<h4 onClick={this.renameRoom.bind(this)}>{name}</h4>
				</div>
				<hr />
				<h4>Can Book:</h4>

				{usersWhoCanBook.map((userId) => {

					const user = this.getUserById(userId);

					if (user) {
						return (
							<div className="user-list" key={user._id}>
								<UserRow user={user}/>
								<hr />
							</div>
						);
					}
	
				})}

				<h4>Can Access:</h4>

				{usersWhoCanAccess.map((userId) => {

					const user = this.getUserById(userId);

					if (user) {
						return (
							<div className="user-list" key={user._id}>
								<UserRow user={user}/>
								<hr />
							</div>
						);
					}
	
				})}
				
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

export default withTracker((props) => {
	const rommsHandle = Meteor.subscribe('allRooms');
	const usersHandle = Meteor.subscribe('allUsers');

	const loading = !rommsHandle.ready() && usersHandle.ready();

	let room = null;

	if (!loading) {
		room = Rooms.find({_id: props.params.roomId}).fetch()[0];
	}

	return {
		loading,
		room: room,
		users: Meteor.users.find().fetch()
	};
})(RoomSingle);