import { WebApp } from 'meteor/webapp';
import ConnectRoute from 'connect-route';
import { http } from 'meteor/http';

import DoorCodes from '../imports/api/collections/doorCodes.js';
import DoorCodeLog from '../imports/api/collections/doorCodeLog.js';
import DoorCodeAttempts from '../imports/api/collections/doorCodeAttempts.js';


var url = '/code/' + Meteor.settings.private.doorToken + '/:code';
var openDoorUrl = 'http://maindoor.olyp.no/enu/trigger/' + Meteor.settings.private.doorToken;

function onRoute (req, res, next) {

	const numberCode = req.params.code;
	const existingCode = DoorCodes.findOne({code: numberCode});

	const openDoor = function () {

		HTTP.get(openDoorUrl);

		res.writeHead(200);
		res.end();
	};

	if (existingCode) {

		if (existingCode.validFrom || existingCode.validTo) {

			if (new Date () < existingCode.validFrom || new Date () >  existingCode.validTo) {

				// Code expired
				const attempt = {
					date: new Date,
					requestHeaders: req.headers,
					expiredCode: existingCode
				}

				DoorCodeAttempts.insert(attempt);
			} else {
				openDoor();
			}
		}

		if (existingCode.temporary == false) {
			// TODO: add photo

			const logEntry = {
				date: new Date(),
				code: numberCode,
				userId: existingCode.userId,
				photo: ''
			}

			DoorCodeLog.insert(logEntry);

			openDoor();
		}

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