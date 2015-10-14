var HelperFunctions = require('../HelperFunctions');
var request = require('request');

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
	request({url: filePath, encoding: 'binary'}, function(error, response, body){
		if(error){
			callback(HelperFunctions.createCustomError('Could not download file.'));
		}else{
			var fileType = response.headers['content-type'];
			var base64 = new Buffer(body, 'binary').toString('base64');
			var dataURI = 'data:' + fileType + ';base64,' + base64;
			var payload = {
				doc:{
					attachment: dataURI
				}
			};
			self.client.patch(path, payload, callback);
		}
	})
};


module.exports = User;