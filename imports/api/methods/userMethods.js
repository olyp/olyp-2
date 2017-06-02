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
			Roles.addUsersToRoles( userId, 'user', 'olyp' );

			// Generate user door code
			Meteor.call('doorCode.add', userId);

			// Send verification mail
			Accounts.sendVerificationEmail(userId);

		} else {
			throw new Meteor.Error( 'bad-match', 'User aleady exists' );
		}
	},
	
	'user.delete' (userId) {

		// Validation
		check(userId, String);

		if (userId == Meteor.userId() || Roles.userIsInRole(Meteor.userId(), ['super-admin', 'admin'], 'olyp')) {

			// Delete user door code
			Meteor.call('doorCode.deleteByUserId', userId, (err, res) => {
				if (err) {
					console.log(err);
				} else {
					// Add to deleted users
					Meteor.call('deletedUsers.add', userId, (err, res) => {
						if (err) {
							console.log(err);
						} else {
							// Delete user
							Meteor.users.remove(userId);
						}
					});
				}
			});
		} 	
	},

	'user.toggleIsAdmin' (userId) {

		// Validation
		check(userId, String);

		// Check if logged in user has priveliges to manage users
		if ( Roles.userIsInRole(Meteor.userId(), ['super-admin', 'admin'], 'olyp')) {

			// Check if user already is in Role
			if (Roles.userIsInRole(userId, ['admin', 'super-admin'], 'olyp')) {

				// If in role, remove from role
				Roles.removeUsersFromRoles(userId, ['admin'], 'olyp');
  			} else {

  				// Else add to role
  				Roles.addUsersToRoles(userId, ['admin'], 'olyp');
  			}
		}

	},

	'user.changeName' (name) {
		check(name, String);

		Meteor.users.update({_id: Meteor.userId()}, {$set: {'profile.name': name}});
	},
	'user.addProfilePicture' (file) {
		check(file, Object);

		const currentUser = Meteor.users.findOne({_id: Meteor.userId()}, {fields: {profile: 1}});
		const existingPictureId = (currentUser && currentUser.profile && currentUser.profile.image && currentUser.profile.image.localId);

		if (existingPictureId) {
			Meteor.call('file.toTrash', existingPictureId, 'image', (err, res) => {
				if (err) {
					console.log(err);
				}
			});
		}

		Meteor.call('file.add', file, 'image', (err, res) => {
			if (err) {
				console.log(err);
			} else {
				Meteor.users.update({_id: Meteor.userId()}, {$set: {'profile.image.awsKey': res.awsKey, 'profile.image.localId': res.localId}});
			}
		});
		
	},
	sendVerificationEmail () {
		Accounts.sendVerificationEmail(Meteor.userId());
	},
	'user.addCustomer': (userId, customerId) => {
		check(userId, String);
		check(customerId, String);

		if (userId == Meteor.userId() || Roles.userIsInRole(Meteor.userId(), ['super-admin', 'admin'], 'olyp')) {
			Meteor.users.update({_id: userId}, {$push: {customers: customerId}});
		};
	}
});