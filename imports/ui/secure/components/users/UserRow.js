import React, {Component} from 'react';
import { Link } from 'react-router';
import swal from 'sweetalert2';

import AwsImage from '../../../shared/files/awsImage.js';

class UserRow extends Component {

	render () {
		const user = this.props.user;
		const profile = user.profile;
		const email = (user && user.emails && user.emails[0]) ? user.emails[0].address : '';
		const url = '/secure/users/' + user._id;
		const awsKey = (user && user.profile && user.profile.image && user.profile.image.awsKey);

		const isOnline = (user && user.status && user.status.online) ? <p>online</p> : null;
		const isAdmin = (user && Roles.userIsInRole(user._id, ['super-admin', 'admin'], 'olyp')) ? <p>admin</p> : null;

		return (
			<Link to={url}>
				<div className="row">
					<div className="col-xs-4">
						<AwsImage 
							awsKey={awsKey}
							className="img-responsive"
							size='100x100'
						/>
					</div>
					<div className="col-xs-8">
						<h4>{profile.name}</h4>
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