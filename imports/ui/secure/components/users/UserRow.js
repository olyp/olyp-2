import React from 'react';
import { Link } from 'react-router';

const UserRow = (props) => {

	const user = props.user;
	const profile = user.profile;
	const email = (user && user.emails && user.emails[0]) ? user.emails[0].address : '';
	const url = '/secure/users/' + user._id;
	const doorCode = props.hasDoorCode ? <p>code</p> : null;
	let name = (user && user.profile && user.profile.firstName && user.profile.lastName) ? user.profile.firstName + ' ' + user.profile.lastName : null;

	if (name == null && email) {
		name = email;
	};

	let imageSource = "/images/default_avatar_100x100.jpg";

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

	const isOnline = (user && user.status && user.status.online) ? <p>online</p> : null;
	const isAdmin = (user && Roles.userIsInRole(user._id, ['super-admin', 'admin'], 'olyp')) ? <p>admin</p> : null;

	return (
		<Link to={url}>
			<div className="row user-row">
				<div className="col-xs-4">

					{image}

				</div>
				<div className="col-xs-8">
					<h4>{name}</h4>
					<div className="user-status">
						{doorCode}
						{isOnline}
						{isAdmin}
					</div>
				</div>
				
			</div>
		</Link>
	);
}

export default UserRow;