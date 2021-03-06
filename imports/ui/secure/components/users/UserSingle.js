import React, { Component } from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import { browserHistory } from 'react-router';
import swal from 'sweetalert2';
import { Glyphicon } from 'react-bootstrap';

import Rooms from '../../../../api/collections/rooms.js'
import DoorCodes from '../../../../api/collections/doorCodes.js'
import CustomersCollection from '../../../../api/collections/customers.js';

import Preloader from '../../../shared/preloader/Preloader.js';
// import AwsImage from '../../../shared/files/awsImage.js';

class UserSingle extends Component {

	deleteUser () {

		swal({
			title: 'Delete user?',
			text: "You will not be able to recover this user!",
			type: 'warning',
			showCancelButton: true,
			confirmButtonColor: '#3085d6',
			cancelButtonColor: '#d33',
			confirmButtonText: 'Yes, delete it!'
		}).then((result) => {
			if (result.value) {
				Meteor.call('user.delete', this.props.user._id, (err, res) => {
					if (err) {
						console.log(err);
						swal("Failed", "The user cound not be deleted.", "warning");
					} else {
						browserHistory.goBack();
						Bert.alert('User deleted', 'success', 'growl-bottom-right', 'fa-smile-o');
					}
				});
			}
		});

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

	revokeDoorCode () {
		swal({
			title: 'Revoke door code?',
			text: "You will not be able to recover this door code!",
			type: 'warning',
			showCancelButton: true,
			confirmButtonColor: '#3085d6',
			cancelButtonColor: '#d33',
			confirmButtonText: 'Yes, revoke it!'
		}).then((result) => {
			if (result.value) {
				Meteor.call('doorCode.deleteById', this.props.doorCode._id, (err, res) => {
					if (err) {
						console.log(err);
					} else {
						Bert.alert('Door code revoked', 'success', 'growl-bottom-right', 'fa-smile-o');
					}
				});
			}
		});
	}

	generateDoorCode () {
		// console.log(this.props.user._id);
		Meteor.call('doorCode.add', this.props.user._id, (err, res) => {
			if (err) {
				console.log(err);
			} else {
				Bert.alert('Door code generated', 'success', 'growl-bottom-right', 'fa-smile-o');
			}
		})
	}

	render () {

		if (this.props.loading) {
			return (
				<Preloader />
			);
		}

		const user = this.props.user;

		const name = (user && user.profile && user.profile.firstName && user.profile.lastName) ? user.profile.firstName + ' ' + user.profile.lastName : null;
		const email = (user && user.emails && user.emails[0] && user.emails[0].address);
		const doorCode = (this.props.doorCode) ? 
			<div onClick={this.revokeDoorCode.bind(this)} className="room-selector col-xs-4 hover room-selector-active">{this.props.doorCode.code}</div> : 
			<div onClick={this.generateDoorCode.bind(this)} className="room-selector col-xs-4 hover room-selector-active">Generate</div>;

		const isAdminClass = (user && Roles.userIsInRole(user._id, ['super-admin', 'admin'], 'olyp')) ? 'room-selector-active': '';
		// const awsKey = (user && user.profile && user.profile.image && user.profile.image.awsKey);
		let imageSource = "/images/default_avatar_100x100.jpg"

		if (user.services && user.services.google) {
			imageSource = user.services.google.picture;
		}


		if (user.services && user.services.facebook) {
			imageSource = `http://graph.facebook.com/${user.services.facebook.id}/picture?type=square`;
				
		}

		if (user.profile && user.profile.image) {
			imageSource = `/images/${user.profile.image.localId}?size=100x100`;
				
		}

		const image = <img 
				src={imageSource}
				className="img-responsive"
			/>
			
		return (
			<div className="container user-single">
				<div className="row">
					<div className="col-xs-4">
						{image}
					</div>
					<div className="col-xs-8">
						<h4>{name}</h4>
						<a href={`mailto:${email}`}><Glyphicon glyph="envelope" /> Send email</a>
					</div>
				</div>

				<hr />

				<h4>Code:</h4>

				<div className="row">
					{doorCode}
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

export default withTracker((props) => {
	const usersHandle = Meteor.subscribe('allUsers');
	const roomsHandle = Meteor.subscribe('allRooms');
	const doorCodesHandle = Meteor.subscribe('allDoorCodes');
	const customersHandle = Meteor.subscribe('userCustomers');

	const loading = !usersHandle.ready() && !roomsHandle.ready() && !doorCodesHandle.ready() && !customersHandle.ready();

	return {
		loading,
		user: Meteor.users.find({_id: props.params.userId}).fetch()[0],
		rooms: Rooms.find().fetch(),
		doorCode: DoorCodes.find({userId: props.params.userId}).fetch()[0],
		customers: CustomersCollection.find().fetch()
	};
})(UserSingle);