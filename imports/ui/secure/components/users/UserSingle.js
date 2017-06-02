import React, { Component } from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import { browserHistory } from 'react-router';
import swal from 'sweetalert2';

import Rooms from '../../../../api/collections/rooms.js'
import DoorCodes from '../../../../api/collections/doorCodes.js'

import Preloader from '../../../shared/preloader/Preloader.js';
import AwsImage from '../../../shared/files/awsImage.js';

class UserSingle extends Component {

	deleteUser () {

		swal({
			title: 'Are you sure?',
			text: "You will not be able to recover this user!",
			type: 'warning',
			showCancelButton: true,
			confirmButtonColor: '#3085d6',
			cancelButtonColor: '#d33',
			confirmButtonText: 'Yes, delete it!'
		}).then(() => {
			Meteor.call('user.delete', this.props.user._id, (err, res) => {
				if (err) {
					console.log(err);
					swal("Failed", "The user cound not be deleted.", "warning");
				} else {
					browserHistory.goBack();
					Bert.alert('User deleted', 'success', 'growl-bottom-right', 'fa-smile-o');
				}
			});
		// Since this is a promise, we have to catch "cancel" and say it is ok
		}).catch(swal.noop);

	}

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

	toggleIsAdmin() {
		Meteor.call('user.toggleIsAdmin', this.props.user._id, (err, res) => {
			if (err) {
				console.log(err);
			} 
		});
	}

	editDoorCode () {
		console.log('Editing door code ...');
	}

	render () {

		const user = (this.props.user) ? this.props.user : null;
		const name = (user && user.profile && user.profile.name);
		const email = (user && user.emails && user.emails[0] && user.emails[0].address);
		const doorCode = (this.props.doorCode) ? this.props.doorCode.code : 'Generate';
		const isAdminClass = (user && Roles.userIsInRole(user._id, ['super-admin', 'admin'], 'olyp')) ? 'room-selector-active': '';
		const awsKey = (user && user.profile && user.profile.image && user.profile.image.awsKey);

		if (!user) {
			return (
				<Preloader />
			);
		}

		return (
			<div className="container user-single">
				<div className="row">
					<div className="col-xs-4">
						<AwsImage 
							awsKey={awsKey}
							className="img-responsive"
							size='100x100'
						/>
					</div>
					<div className="col-xs-8">
						<h4>{name}</h4>
						<p>{email}</p>
					</div>
				</div>

				<hr />

				<h4>Code:</h4>

				<div className="row">

					<div 
						className="room-selector col-xs-4 hover room-selector-active"
						onClick={this.editDoorCode.bind(this)}
					>
						{doorCode}
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
								className={`room-selector col-xs-4 hover ${activeClass}`}
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
								className={`room-selector col-xs-4 hover ${activeClass}`}
								onClick={() => {this.toggleAccessToRoom(room._id)}}
							>
								{room.name}
							</div>
						);
					})}
			
				</div>

				<hr />

				<h4>Roles:</h4>

				<div className="row">
					<div 
						className={`room-selector col-xs-4 hover ${isAdminClass}`}
						onClick={() => {this.toggleIsAdmin(user._id)}}
					>
						Admin
					</div>
				</div>

				<hr />

				<div className="row">
					<div className="col-xs-12">
						<div className="delete-large" onClick={this.deleteUser.bind(this)}>
      						Delete User
    					</div>
					</div>
				</div>

				<hr />
				
			</div>
		);
	}
}

export default createContainer((props) => {
	Meteor.subscribe('allUsers');
	Meteor.subscribe('allRooms');
	Meteor.subscribe('allDoorCodes');

	const user = Meteor.users.find({_id: props.params.userId}).fetch();
	const doorCode = DoorCodes.find({userId: props.params.userId}).fetch()

	return {
		user: user[0],
		rooms: Rooms.find().fetch(),
		doorCode: doorCode[0]
	};
}, UserSingle);