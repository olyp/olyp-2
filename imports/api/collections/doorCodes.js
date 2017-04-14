import { Mongo } from 'meteor/mongo';

const DoorCodes = new Mongo.Collection( 'doorCodes' );

DoorCodes.allow({
	insert: () => false,
	update: () => false,
	remove: () => false
});

DoorCodes.deny({
	insert: () => true,
	update: () => true,
	remove: () => true
});

const DoorCodesSchema = new SimpleSchema({
	"code": {
		type: String
	},
	"userId": {
		type: String,
		optional: true
	},
	"dateCreated": {
		type: Date
	},
	"addedBy": {
		type: String
	},
	"validFrom": {
		type: Date,
		optional: true
	},
	"validTo": {
		type: Date,
		optional: true
	},
	'temporary': {
		type: Boolean
	}
});

DoorCodes.attachSchema( DoorCodesSchema );

export default DoorCodes;