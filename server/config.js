Meteor.startup(function () {

	// Defining initial user credentials
	var initialUser = {};
	initialUser.email = Meteor.settings.private.initialUser.email;
	initialUser.password = Meteor.settings.private.initialUser.password;

	// Checking if initial user exists based on email
	var initialUserExists = Meteor.users.findOne({'emails.address': initialUser.email});

	if (!initialUserExists) {

		// If Initial user doesn't exist, create it

		const profile = {
			'name': 'Jonas Barsten',
			'firstName': 'Jonas',
			'lastName': 'Barsten'
		}

		let newUserId = Accounts.createUser( { profile: profile, email: initialUser.email, password: initialUser.password } );

		// Give initial user the role of admin
		Roles.addUsersToRoles( newUserId, 'super-admin', Roles.GLOBAL_GROUP );
	}

	// If user exists, but does not have super-admin, assign super-admin role
	if (!Roles.userIsInRole(initialUserExists._id, 'super-admin', Roles.GLOBAL_GROUP)) {
		Roles.addUsersToRoles( initialUserExists._id, 'super-admin', Roles.GLOBAL_GROUP );
	}

	// Set mail settings
	process.env.MAIL_URL = Meteor.settings.private.smtp;


	// Configure facebook-login
	ServiceConfiguration.configurations.upsert({
		service: "facebook"
	}, {
		$set: {
			appId: Meteor.settings.facebook.appId,
			loginStyle: "popup",
			secret: Meteor.settings.facebook.secret
		}
	});

	// Configure google-login
	ServiceConfiguration.configurations.upsert({
		service: "google"
	}, {
		$set: {
			clientId: Meteor.settings.google.clientId,
			secret: Meteor.settings.google.secret
		}
	});

});