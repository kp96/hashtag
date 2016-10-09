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

module.exports = router;
