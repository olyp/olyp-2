import {WebApp} from 'meteor/webapp';
import ConnectRoute from 'connect-route';
import {http} from 'meteor/http';

const url = '/files/:filePath';

function onRoute (req, res, next) {

	const cloudFrontUrl = process.env.CLOUDFRONT_URL;
	const filePath = req.params.filePath;

	console.log(filePath);
	console.log(cloudFrontUrl);

	res.writeHead(307, {'Location': 'https://' + cloudFrontUrl + '/' + filePath});
	res.end();

}

const middleware = ConnectRoute(function (router) {
	router.get(url, onRoute);
});

WebApp.connectHandlers.use(middleware);