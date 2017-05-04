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
	}
});

Images.attachSchema( ImagesSchema );

export default Images;