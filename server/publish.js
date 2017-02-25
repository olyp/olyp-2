Meteor.publish('doorCodes', function () {
	return DoorCodes.find();
});

Meteor.publish('profile', function () {
	return Meteor.users.find(
		{_id: this.userId}, 
		{fields: 
			{
				'services.password': 0, 
				'services.facebook.accessToken': 0, 
				'services.google.accessToken': 0, 
				'services.google.idToken': 0
			}
		}
	);
});

Meteor.publish('reservations', function () {
    return Reservations.find();
});

Meteor.publish('allProfiles', function () {
    return Meteor.users.find({}, {fields: {"profile": 1}});
});