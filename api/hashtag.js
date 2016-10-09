'use strict';

const Promise = require("bluebird");
const db = require('./database');
const response = require('./constants').response;

const getHashTags = function(source) {
	const regex = /#[a-z\d-_]+/ig;
	const tags = [];
	let x;
	while (x = regex.exec(source))
		tags.push([x[0]]);
	return tags;
};
const getMessageQuery = function(message, user) {
	return {
		sql : "INSERT INTO `messages`(message, userID) VALUES (?, ?)",
		values : [message, user]
	};
};
const getHashTagsQuery = function(message) {
	return {
		sql : "INSERT IGNORE INTO `tags`(tag) VALUES ?",
		values : [getHashTags(message)]
	};
};
const getRelationsQuery = function(message, id) {
	const tags = getHashTags(message);
	const vals = [];
	for (let i in tags)
		vals.push([id, tags[i][0]]);
	return {
		sql : "INSERT INTO `message_tags`(messageID, tag) VALUES ?",
		values : [vals]
	};
};
const getMessagesByUserQuery = function(userId) {
	return {
		sql : "SELECT * FROM `messages` where `userID` = ?",
		values : [userId]
	};
};
const getMessagesByHashTagQuery = function(hashtag) {
	return {
		sql : "SELECT m.message, m.userId from messages m, message_tags c where m.messageID = c.messageID"
				+ " and c.tag = ? ",
		values: [hashtag]
	}
};
const getLatestMessagesQuery = function() {
	return {
		sql : "SELECT * FROM messages m ORDER BY m.messageID DESC LIMIT 10"
	};
};
const savePost = function (hres, message, user) {
	Promise.using (db(), function(connection) {
		return Promise.all([
				connection.queryAsync(getMessageQuery(message, user)),
				connection.queryAsync(getHashTagsQuery(message))
			]).spread(function (res) {
				return connection.queryAsync(getRelationsQuery(message, res.insertId));
			});
	}).then(function(done) {
		hres.end(response.success);
	}).catch(function(err) {
		hres.end(response.dbError);
	});
};
const getMessagesByUser = function(hres, userId) {
	Promise.using(db(), function(connection) {
		return connection.queryAsync(getMessagesByUserQuery(userId));
	}).then (function(res) {
		hres.end(JSON.stringify(res));
	}).catch(function(err) {
		hres.end(response.dbError);
	});
};
const getMessagesByHashTag = function(hres, hashtag) {
	Promise.using(db(), function(connection) {
		return connection.queryAsync(getMessagesByHashTagQuery(hashtag));
	}).then (function(res) {
		hres.end(JSON.stringify(res));
	}).catch(function(err) {
		hres.end(response.dbError);
	});
};
const getLatestMessages = function(hres) {
	console.log("maama");
	Promise.using(db(), function(connection) {
		return connection.queryAsync(getLatestMessagesQuery());
	}).then (function(res) {
		console.log(res);
		hres.end(JSON.stringify(res));
	}).catch(function(err) {
		hres.end(response.dbError);
	});
}
module.exports = {
	getMessagesByUser : getMessagesByUser,
	getMessagesByHashTag : getMessagesByHashTag,
	getLatestMessages : getLatestMessages,
	savePost : savePost
}