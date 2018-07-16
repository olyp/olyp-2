import React, { Component } from 'react';
import { Link } from 'react-router';
import { withTracker } from 'meteor/react-meteor-data';
import swal from 'sweetalert2';

import Preloader from '../../../shared/preloader/Preloader.js';
import RoomsCollection from '../../../../api/collections/rooms.js';

class Rooms extends Component {

	constructor(props) {
		super(props);
		this.state = {
			query: '',
			result: []
		}
	}

	search () {
		this.setState({
			query: this.refs.searchInput.value
		});
	}

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
			if (result.value) {
				Meteor.call('room.add', result.value, (err, res) => {
					if (err) {
						console.log(err);
					} else {
						Bert.alert('Room added', 'success', 'growl-bottom-right', 'fa-smile-o');
					}
				});
			}
		});
	}

	render () {

		if (this.props.loading) {
			return <Preloader />
		}

		var filteredRooms = this.props.rooms.filter(
			(room) => {

				const query = this.state.query.toLowerCase();
				const roomName = (room && room.name) ? room.name.toLowerCase() : '';

				const roomNameMatch = roomName.indexOf(query) !== -1;

				if (roomNameMatch) {
					return true
				}
			}
		);

		return (
			<div className="container">
				<div className="row">
					<div className="col-xs-10">
						<input 
							type="text" 
							ref="searchInput" 
							placeholder="Search ..." 
							className="search-bar"
							onChange={this.search.bind(this)}
						/>
					</div>
					<div className="col-xs-2 text-right">
						<span onClick={this.addRoom.bind(this)} className="glyphicon glyphicon-plus hover add-room-button"></span>
					</div>
				</div>
				<hr />
				{filteredRooms.map((room) => {
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

export default withTracker(() => {
	const roomsHandle = Meteor.subscribe('allRooms');
	const loading = !roomsHandle.ready();
	return {
		loading,
		rooms: RoomsCollection.find().fetch()
	};
})(Rooms);

