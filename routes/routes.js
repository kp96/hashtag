var express = require('express');
var router = express.Router();

const api = require('../api/hashtag');
const response = require('../api/constants').response;

router.get('/', function(req, res, next) {
	res.render('index', {title : 'HashTag'});
});
router.get('/api/messages', function(req, res, next) {
	const userName = req.query.userName;
	if (! userName)
		res.end(JSON.stringify(response.nullValues));
	else
		api.getMessagesByUser(res, userName);
});
router.get('/api/hashtags', function(req, res, next) {
	const hashTag = req.query.hashTag;
	if (! hashTag)
		res.end(JSON.stringify(response.nullValues));
	else
		api.getMessagesByHashTag(res, hashTag); 
});
router.get('/api/latest', function(req, res, next) {
	api.getLatestMessages(res); 
});

router.post('/api/store', function(req, res, next) {
	const message = req.body.message;
	const userID = req.body.userID;
	if (message.length() > 160 || userID.charAt(0) !== '_')
		res.end(JSON.stringify(response.nullValues));
	else
		api.savePost(res, message, userID);
});
module.exports = router;
