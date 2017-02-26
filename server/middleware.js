import {WebApp} from 'meteor/webapp';
import ConnectRoute from 'connect-route';
import {http} from 'meteor/http';

import DoorCodes from '../imports/api/collections/doorCodes.js';
import DoorCodeLog from '../imports/api/collections/doorCodeLog.js';
import DoorCodeAttempts from '../imports/api/collections/doorCodeAttempts.js';


var url = '/code/' + Meteor.settings.private.doorToken + '/:code';
var getUrl = 'http://maindoor.olyp.no/enu/trigger/' + Meteor.settings.private.doorToken;

function onRoute (req, res, next) {

	const numberCode = req.params.code;

	var existingCode = DoorCodes.findOne({code: numberCode});

	if (existingCode) {

		HTTP.get(getUrl);

		res.writeHead(200);
		res.end();

		// TODO: add photo

		const logEntry = {
			date: new Date(),
			code: numberCode,
			userId: existingCode.userId,
			photo: ''
		}

		DoorCodeLog.insert(logEntry);

	} else {

		var attempt = {
			date: new Date,
			requestHeaders: req.headers
		}

		// TODO: insert photo/video
		// TODO: filter out bruteforce attempts

		DoorCodeAttempts.insert(attempt);

		res.writeHead(307, {'Location': Meteor.settings.public.url});
		res.end();
	}

}

const middleware = ConnectRoute(function (router) {
	router.get(url, onRoute);
});

WebApp.connectHandlers.use(middleware);