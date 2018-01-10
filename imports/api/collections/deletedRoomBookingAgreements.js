import { Mongo } from 'meteor/mongo';

const DeletedRoomBookingAgreements = new Mongo.Collection( 'deletedRoomBookingAgreements' );

DeletedRoomBookingAgreements.allow({
	insert: () => false,
	update: () => false,
	remove: () => false
});

DeletedRoomBookingAgreements.deny({
	insert: () => true,
	update: () => true,
	remove: () => true
});


const DeletedRoomBookingAgreementsSchema = new SimpleSchema({
	"agreement": {
		type: Object,
		blackbox: true
	},
	"customer": {
		type: Object,
		blackbox: true
	},
	"deletedDate": {
		type: Date,
		optional: true
	},
	"deletedBy": {
		type: String,
		optional: true
	}
});

DeletedRoomBookingAgreements.attachSchema( DeletedRoomBookingAgreementsSchema );

export default DeletedRoomBookingAgreements;