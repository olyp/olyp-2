import { Mongo } from 'meteor/mongo';

const Files = new Mongo.Collection( 'files' );

Files.allow({
	insert: () => false,
	update: () => false,
	remove: () => false
});

Files.deny({
	insert: () => true,
	update: () => true,
	remove: () => true
});


const FilesSchema = new SimpleSchema({
	"name": {
		type: String
	},
	"awsKey": {
		type: String
	},
	"size": {
		type: Number
	},
	"type": {
		type: String
	},
	"dateAdded": {
		type: Date
	},
	"addedBy": {
		type: String
	},
	"inTrash": {
		type: Boolean,
		optional: true
	},
	"dateTrashed": {
		type: Date,
		optional: true
	},
	"trashedBy": {
		type: String,
		optional: true
	},
	"deletedFromS3": {
		type: Boolean,
		optional: true
	},
	"dateDeleted": {
		type: Date,
		optional: true
	}
});

Files.attachSchema( FilesSchema );

export default Files;