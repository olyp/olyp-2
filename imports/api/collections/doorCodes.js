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
	"dateCreated": {
		type: Date
	},
	"addedBy": {
		type: String
	},
	"uses": {
		type: [Object],
		optional: true
	},
	"uses.$.date": {
		type: Date
	},
	"uses.$.photo": {
		type: String,
		optional: true
	}
});

DoorCodes.attachSchema( DoorCodesSchema );

export default DoorCodes;