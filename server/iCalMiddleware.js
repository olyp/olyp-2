// import { WebApp } from 'meteor/webapp';
// import ConnectRoute from 'connect-route';
// import { http } from 'meteor/http';
// import ical from 'ical-generator';

// import Rooms from '../imports/api/collections/rooms';
// import Reservations from '../imports/api/collections/reservations';

// const url = '/ical/:roomId';

// function onRoute (req, res, next) {

// 	const room = Rooms.findOne({_id: req.params.roomId});

// 	if (!room) {
// 		response.writeHead(404);
// 		response.end();
// 	}

// 	const calendar = ical({name: `${room.name} @ OLYP`});
// 	const events = Reservations.find({roomId: room._id});

// 	events.forEach((event) => {

// 		const user = Meteor.users.findOne({_id: event.booking.userId});
// 		const userString = user.profile.firstName + " " + user.profile.lastName;

// 		calendar.createEvent({
// 			uid: event._id,
// 			start: event.from,
// 			end: event.to,
// 			summary: userString,
// 			location: room.name,
// 			description: event.comment || '',
// 			url: ''
// 		});
// 	});

// 	const calendarstring = calendar.toString();

// 	response.writeHead(200, {
// 		'Content-Type': 'text/calendar; charset=UTF-8',
// 		'Content-Disposition': 'attachment; filename="' + dname + '"'
// 	});

// 	response.write(calendarstring);
// 	response.end();

// }

// const middleware = ConnectRoute(function (router) {
// 	router.get(url, onRoute);
// });

// WebApp.connectHandlers.use(middleware);