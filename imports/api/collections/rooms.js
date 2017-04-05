import { Mongo } from 'meteor/mongo';

const Rooms = new Mongo.Collection( 'rooms' );

Rooms.allow({
	insert: () => false,
	update: () => false,
	remove: () => false
});

Rooms.deny({
	insert: () => true,
	update: () => true,
	remove: () => true
});


const RoomsSchema = new SimpleSchema({
	"name": {
		type: String
	},
	"access": {
		type: [Object],
		optional: true
	},
	"canBook": {
		type: [String],
		optional: true
	},
	"canAccess": {
		type: [String],
		optional: true
	}
});

Rooms.attachSchema( RoomsSchema );

export default Rooms;