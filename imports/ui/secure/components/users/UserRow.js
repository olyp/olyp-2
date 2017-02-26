import React, {Component} from 'react';
import swal from 'sweetalert2';

export default class UserRow extends Component {

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
			Meteor.call('deleteUser', this.props.user._id, (err, res) => {
				if (err) {
					console.log(err);
				} else {
					Bert.alert('User deleted', 'success', 'growl-bottom-right', 'fa-smile-o');
				}
			});
		// Since this is a promise, we have to catch "cancel" and say it is ok
		}).catch(swal.noop);
	}

	render () {
		const user = this.props.user;
		const profile = user.profile;

		return (
			<div>
				{profile.name}
				<button className="delete" onClick={this.deleteUser.bind(this)}>
          			&times;
        		</button>
			</div>
		);
	}
}