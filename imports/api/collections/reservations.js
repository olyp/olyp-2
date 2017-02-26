import { Mongo } from 'meteor/mongo';

const Reservations = new Mongo.Collection( 'reservations' );

Reservations.allow({
	insert: () => false,
	update: () => false,
	remove: () => false
});

Reservations.deny({
	insert: () => true,
	update: () => true,
	remove: () => true
});


const ReservationsSchema = new SimpleSchema({
	"type": {
		type: String
	},
	"booking": {
		type: Object
	},
    "booking.userId": {
        type: String
    },
    "booking.customerId": {
        type: String
    },
	"comment": {
		type: String
	},
    "from": {
        type: Date
    },
    "to": {
        type: Date
    },
    "roomId": {
        type: String
    }
});

Reservations.attachSchema( ReservationsSchema );

export default Reservations;