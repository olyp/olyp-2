import React, {Component} from 'react';
import { withTracker } from 'meteor/react-meteor-data';

import DoorCodes from '../../../../api/collections/doorCodes.js';

import Preloader from '../../../shared/preloader/Preloader.js';

import UserRow from './UserRow.js';

class Users extends Component {

	state = {
		query: '',
		result: []
	}

	search () {
		this.setState({
			query: this.refs.searchInput.value
		});
	}

	render () {

		if (this.props.loading) {
			return <Preloader />
		}

		const doorCodes = this.props.doorCodes;

		var filteredUsers = this.props.users.filter(
			(user) => {

				const query = this.state.query.toLowerCase();
				const userName = (user.profile && user.profile.firstName && user.profile.lastName) ? user.profile.firstName.toLowerCase() + ' ' + user.profile.lastName.toLowerCase() : '';
				const email = (user.emails && user.emails[0] && user.emails[0].address) ? user.emails[0].address : '';

				const userNameMatch = userName.indexOf(query) !== -1;
				const emailMatch = email.indexOf(query) !== -1;

				if (userNameMatch || emailMatch) {
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
					<div className="col-xs-2">
						<div className="search-counter pull-right"> {filteredUsers.length} </div>
					</div>
				</div>

				<hr />

				{filteredUsers.map((user, i) => {
					let hasDoorCode = false;

					for (const code of doorCodes) {
						if (code.userId == user._id) {
							hasDoorCode = true;
							break;
						}
					}

					return (
						<div key={user._id}>
							<UserRow user={user} hasDoorCode={hasDoorCode} />
							<hr />
						</div>
					);

				})}
			</div>
		);
	}
}

export default withTracker(() => {
	const usersHandle = Meteor.subscribe('allUsers');
	const doorCodesHandle = Meteor.subscribe('allDoorCodes');

	const loading = !usersHandle.ready() && !doorCodesHandle.ready();
	return {
		loading,
		users: Meteor.users.find().fetch(),
		doorCodes: DoorCodes.find().fetch()
	};
})(Users);
