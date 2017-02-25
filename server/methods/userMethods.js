Meteor.methods({

	createStandardUser( user ) {
		check( user, {
			email: ValidEmail,
			firstName: String,
			lastName: String,
			password: Object
		});

		const profile = {};
		profile.firstName = user.firstName;
		profile.lastName = user.lastName;

		// Check if user exists
		let userExists = Meteor.users.findOne( {'emails[0].address': user.email}, { fields: { "_id": 1 } } );

		if ( !userExists ) {
			// Create user
			let userId = Accounts.createUser( { profile: profile, email: user.email, password: user.password } );

			// Give user roles
			Roles.addUsersToRoles( userId, 'user', 'booking' );

		} else {
			throw new Meteor.Error( 'bad-match', 'User aleady exists' );
		}
	},
	deleteUser (user) {

		// Validation
		check(user, Object);

		if (user._id == Meteor.userId()) {

			// Allow user to delete it self
			Meteor.users.remove(user._id);
		} else {

			// Only allow deleting other users if has role admin or manage-users
			if ( Roles.userIsInRole(Meteor.userId(), ['super-admin', 'admin'], 'booking')) {

				Meteor.users.remove(user._id);
			}
		}	
	},

	deleteUserFiles (user) {
		// Validation
		check(user, Object);

		if (user._id == Meteor.userId()) {

			// Allow user to delete it self
			UserFiles.remove({'meta.userId': user._id});
		} else {

			// Only allow deleting other users if has role admin or manage-users
			if ( Roles.userIsInRole(Meteor.userId(), ['super-admin', 'admin'], 'booking')) {

				UserFiles.remove({'meta.userId': user._id});
			}
		}
	},


	resetUserPassword () {
		Accounts.sendResetPasswordEmail(Meteor.userId());
	},

	toggleManageUsers (user) {

		// Validation
		check(user, Object);

		// Check if logged in user has priveliges to manage users
		if ( Roles.userIsInRole(Meteor.userId(), ['super-admin', 'admin', 'manage-users'])) {
			// Check if user already is in Role
			if (Roles.userIsInRole(user._id, 'manage-users')) {
				// If in role, remove from role
				Roles.removeUsersFromRoles(user._id, 'manage-users');
  			} else {
  				// Else add to role
  				Roles.addUsersToRoles(user._id, 'manage-users');
  			}
		}

	},
	toggleModerator (user) {

		// Validation
		check(user, Object);

		// Check if logged in user has priveliges to manage users
		if ( Roles.userIsInRole(Meteor.userId(), ['super-admin', 'admin', 'manage-users'])) {
			// Check if user already is in Role
			if (Roles.userIsInRole(user._id, 'moderator')) {
				// If in role, remove from role
				Roles.removeUsersFromRoles(user._id, 'moderator');
  			} else {
  				// Else add to role
  				Roles.addUsersToRoles(user._id, 'moderator');
  			}
		}
	}
});