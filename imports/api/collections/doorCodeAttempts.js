import { Mongo } from 'meteor/mongo';

const DoorCodeAttempts = new Mongo.Collection( 'doorCodeAttempts' );

DoorCodeAttempts.allow({
	insert: () => false,
	update: () => false,
	remove: () => false
});

DoorCodeAttempts.deny({
	insert: () => true,
	update: () => true,
	remove: () => true
});

const DoorCodeAttemptsSchema = new SimpleSchema({
	"date": {
		type: Date
	},
	"requestHeaders": {
		type: Object,
		blackbox: true
	}
});

DoorCodeAttempts.attachSchema( DoorCodeAttemptsSchema );

export default DoorCodeAttempts;