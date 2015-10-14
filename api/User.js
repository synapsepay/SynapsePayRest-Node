var HelperFunctions = require('../HelperFunctions');
var axios = require('axios');
var util = require('util');

var User = function(client){
	this.client = client;
};

User.prototype.createUserPath = function(userId){
	var path = '/users';
	if(userId){
		path += '/' + userId.toString();
	}
	return path;
};

User.prototype.get = function(options, callback){
	var path = this.createUserPath();
	var addUserId = false;
	if(options.userId){
		addUserId = true;
		path = this.createUserPath(options.userId);
	}else{
		if(options.query){
			path += '?query=' + query.toString();
			if(options.page){
				path += '&page=' + options.page.toString();
			}
		}else if(options.page){
			path += '?page=' + options.page.toString();
		}
	}
	this.client.get(path, callback);
};

User.prototype.refresh = function(payload, callback){
	var path = '/oauth/' + this.client.userId;
	this.client.post(path, payload, callback, false, true);
}

User.prototype.update = function(payload, callback){
	var path = this.createUserPath(this.client.userId);
	this.client.patch(path, payload, callback);
}

User.prototype.create = function(payload, callback){
	var path = this.createUserPath();
	this.client.post(path, payload, callback, true);
};

User.prototype.addDoc = function(payload, callback){
	console.log(this.client);
	var path = this.createUserPath(this.client.userId);
	this.client.patch(path, payload, callback);
}

User.prototype.answerKBA = function(payload, callback){
	var path = this.createUserPath(this.client.userId);
	this.client.patch(path, payload, callback);
};

User.prototype.attachFile = function(filePath, callback){
	var path = this.createUserPath(this.client.userId);
	var self = this;
	axios({
		url: filePath,
		method: 'get'
	}).then(function(response){
		var data = new Buffer(response.data).toString('base64');
	    var base64File = util.format("data:%s;base64,%s", mime.lookup(src), data);
		var payload = {
			doc:{
				attachment: base64File
			}
		};
		self.client.patch(path, payload, callback);
	}).catch(function(response){
		callback(HelperFunctions.createCustomError('Could not download file.'));
	});
};


module.exports = User;