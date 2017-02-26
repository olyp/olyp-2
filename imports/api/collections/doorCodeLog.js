import { Mongo } from 'meteor/mongo';

const DoorCodeLog = new Mongo.Collection( 'doorCodeLog' );

DoorCodeLog.allow({
	insert: () => false,
	update: () => false,
	remove: () => false
});

DoorCodeLog.deny({
	insert: () => true,
	update: () => true,
	remove: () => true
});

const DoorCodeLogSchema = new SimpleSchema({
	"code": {
		type: String
	},
	"userId": {
		type: String,
		optional: true
	},
	"date": {
		type: Date
	},
	"photo": {
		type: String,
		optional: true
	}
});

DoorCodeLog.attachSchema( DoorCodeLogSchema );

export default DoorCodeLog;