import {WebApp} from 'meteor/webapp';
import ConnectRoute from 'connect-route';
import {http} from 'meteor/http';

var url = '/code/' + Meteor.settings.private.doorToken + '/:code';

var getUrl = 'http://maindoor.olyp.no/enu/trigger/' + Meteor.settings.private.doorToken;

function onRoute (req, res, next) {

	// TODO: encrypt door code in db

	const numberCode = req.params.code;

	var existingCode = DoorCodes.findOne({code: numberCode});

	if (existingCode) {

		HTTP.get(getUrl);

		res.writeHead(200);
		res.end();

		// TODO: add photo

		DoorCodes.update({_id: existingCode._id}, {$push: {uses: {date: new Date, photo: ''}}});

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