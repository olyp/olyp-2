import { WebApp } from 'meteor/webapp';
import ConnectRoute from 'connect-route';
import request from 'request';

const url = '/images/:localImageId';

function onRoute (req, res, next) {

	const localImageId = req.params.localImageId;
	const size = req.query.size;

	const localImage = Images.findOne({_id: localImageId}, {fields: {awsKey: 1}});

	if (localImage) {

		const awsKey = localImage.awsKey;
		const baseUrl = 'http://' + Meteor.settings.public.aws.imageBucket + '.s3-website-' + Meteor.settings.public.aws.region + '.amazonaws.com/';
		const newSize = size ? (size + '/') : '';

		const awsUrl = baseUrl + newSize + awsKey;

		request.get(awsUrl).on('error', function(err) {
			console.log(err);
		}).pipe(res);
	} else {
		res.writeHead(404);
		res.end();
	}
}

const middleware = ConnectRoute(function (router) {
	router.get(url, onRoute);
});

WebApp.connectHandlers.use(middleware);