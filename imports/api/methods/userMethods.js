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
		profile.name = user.firstName + ' ' + user.lastName;

		// Check if user exists
		let userExists = Meteor.users.findOne( {'emails[0].address': user.email}, { fields: { "_id": 1 } } );

		if ( !userExists ) {
			// Create user
			let userId = Accounts.createUser( { profile: profile, email: user.email, password: user.password } );

			// Give user roles
			Roles.addUsersToRoles( userId, 'user', 'booking' );

			// Send verification mail
			Accounts.sendVerificationEmail(userId);

		} else {
			throw new Meteor.Error( 'bad-match', 'User aleady exists' );
		}
	},
	
	deleteUser (userId) {

		// Validation
		check(userId, String);

		if (userId == Meteor.userId()) {

			// Allow user to delete it self
			Meteor.users.remove(userId);
		} else {

			// Only allow deleting other users if has role admin or manage-users
			if ( Roles.userIsInRole(Meteor.userId(), ['super-admin', 'admin'], 'manage-users')) {

				Meteor.users.remove(userId);
			}
		}	
	},

	toggleManageUsers (userId) {

		// Validation
		check(userId, String);

		// Check if logged in user has priveliges to manage users
		if ( Roles.userIsInRole(Meteor.userId(), ['super-admin', 'admin'], 'manage-users')) {

			// Check if user already is in Role
			if (Roles.userIsInRole(userId, ['admin', 'super-admin'], 'manage-users')) {

				// If in role, remove from role
				Roles.removeUsersFromRoles(userId, ['admin'], 'manage-users');
  			} else {

  				// Else add to role
  				Roles.addUsersToRoles(userId, ['admin'], 'manage-users');
  			}
		}

	},

	toggleBookingAdmin (userId) {

		// Validation
		check(userId, String);

		// Check if logged in user has priveliges to manage users
		if ( Roles.userIsInRole(Meteor.userId(), ['super-admin', 'admin'], 'manage-users')) {

			// Check if user already is in Role
			if (Roles.userIsInRole(userId, ['admin', 'super-admin'], 'booking')) {

				// If in role, remove from role
				Roles.removeUsersFromRoles(userId, ['admin'], 'booking');
  			} else {

  				// Else add to role
  				Roles.addUsersToRoles(userId, ['admin'], 'booking');
  			}
		}

	},

	changeUserName (name) {
		Meteor.users.update({_id: Meteor.userId()}, {$set: {'profile.name': name}});
	},
	sendVerificationEmail () {
		Accounts.sendVerificationEmail(Meteor.userId());
	}
});