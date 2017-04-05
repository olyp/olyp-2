import { Mongo } from 'meteor/mongo';

const DeletedUsers = new Mongo.Collection( 'deletedUsers' );

DeletedUsers.allow({
	insert: () => false,
	update: () => false,
	remove: () => false
});

DeletedUsers.deny({
	insert: () => true,
	update: () => true,
	remove: () => true
});


const DeletedUsersSchema = new SimpleSchema({
	"name": {
		type: String,
		optional: true
	},
	"oldId": {
		type: String,
		optional: true
	},
	"email": {
		type: String,
		optional: true
	},
	"deletedDate": {
		type: Date,
		optional: true
	},
	"createdDate": {
		type: Date,
		optional: true
	}
});

DeletedUsers.attachSchema( DeletedUsersSchema );

export default DeletedUsers;