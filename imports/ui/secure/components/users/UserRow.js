import React, {Component} from 'react';
import { Link } from 'react-router';
import swal from 'sweetalert2';

class UserRow extends Component {

	render () {
		const user = this.props.user;
		const profile = user.profile;
		const email = (user && user.emails && user.emails[0]) ? user.emails[0].address : '';
		const url = '/secure/users/' + user._id;
		const name = (user && user.profile && user.profile.firstName && user.profile.lastName) ? user.profile.firstName + ' ' + user.profile.lastName : null;

		// const awsKey = (user && user.profile && user.profile.image && user.profile.image.awsKey);

		const image = (user && user.profile && user.profile.image) ? 
			<img 
				src={`/images/${user.profile.image.localId}?size=100x100`}
				className="img-responsive"
			/> :
			<img 
				src="/images/default_avatar_100x100.jpg" 
				className="img-responsive"
			/>;


		const isOnline = (user && user.status && user.status.online) ? <p>online</p> : null;
		const isAdmin = (user && Roles.userIsInRole(user._id, ['super-admin', 'admin'], 'olyp')) ? <p>admin</p> : null;

		return (
			<Link to={url}>
				<div className="row">
					<div className="col-xs-4">

						{image}

					</div>
					<div className="col-xs-8">
						<h4>{name}</h4>
						<p>{email}</p>
						<div className="user-status">
							{isOnline}
							{isAdmin}
						</div>
					</div>
					
				</div>
			</Link>
		);
	}
}

export default UserRow;