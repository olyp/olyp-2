Meteor.publish('doorCodes', function () {
	return DoorCodes.find();
});