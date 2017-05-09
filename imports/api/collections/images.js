import { Mongo } from 'meteor/mongo';

const Images = new Mongo.Collection( 'images' );

Images.allow({
	insert: () => false,
	update: () => false,
	remove: () => false
});

Images.deny({
	insert: () => true,
	update: () => true,
	remove: () => true
});


const ImagesSchema = new SimpleSchema({
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

Images.attachSchema( ImagesSchema );

export default Images;