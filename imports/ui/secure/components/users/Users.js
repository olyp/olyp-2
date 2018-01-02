import React, {Component} from 'react';
import { createContainer } from 'meteor/react-meteor-data';

import Preloader from '../../../shared/preloader/Preloader.js';

import UserRow from './UserRow.js';

class Users extends Component {

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

	render () {

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

		if (this.props.users.length == 0) {
			return (
				<div>
					<Preloader />
				</div>
			);
		}

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

					// if (user._id !== Meteor.userId()) {

						return (
							<div className="user-list" key={user._id}>
								<UserRow user={user}/>
								<hr />
							</div>
						);
					// }
					
				})}
			</div>
		);
	}
}

export default createContainer(() => {
	Meteor.subscribe('allUsers');

	return {
		users: Meteor.users.find().fetch()
	};
}, Users);
