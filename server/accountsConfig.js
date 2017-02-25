Accounts.config({
	forbidClientAccountCreation : true
});

Accounts.onCreateUser(function (options, user) {

	if (user.services.facebook) {

		// Check if there is already a user with this email in the db
		var userWithSameEmail = Meteor.users.findOne({'emails.address': user.services.facebook.email});

		if (userWithSameEmail) {

			// Todo: only alow this if email is validated
			// It the email already exists, update that user with facebook-integration

			userWithSameEmail.services.facebook = user.services.facebook;

			Meteor.users.remove({_id: userWithSameEmail._id});

			return userWithSameEmail;

		} else {

			// Keep creating the user

			user.profile = {
				name: user.services.facebook.first_name + ' ' + user.services.facebook.last_name,
				firstName: user.services.facebook.first_name,
				lastName: user.services.facebook.last_name
			}

			user.emails = [{
				'address': user.services.facebook.email,
				'verified': true
			}];

			return user;
		}


	} else if (user.services.google) {


		// Check if there is already a user with this email in the db
		var userWithSameEmail = Meteor.users.findOne({'emails.address': user.services.google.email});

		if (userWithSameEmail) {

			// Todo: only alow this if email is validated
			// It the email already exists, update that user with google-integration

			userWithSameEmail.services.google = user.services.google;

			Meteor.users.remove({_id: userWithSameEmail._id});

			return userWithSameEmail;


		} else {

			// Keep creating the user

			user.profile = {
				name: user.services.google.given_name + ' ' + user.services.google.family_name,
				firstName: user.services.google.given_name,
				lastName: user.services.google.family_name
			};

			user.emails = [{
				'address': user.services.google.email,
				'verified': true
			}];

			return user;
		}

		
	} else {

		// If Accounts.createUser sends a profile option
		if (options.profile) {
			user.profile = options.profile;
		}

		return user;
	}

});