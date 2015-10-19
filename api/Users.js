var HelperFunctions = require('../HelperFunctions');
var request = require('request');
var fs = require('fs');
var mime = require('mime');

var Users = function(client){
	this.client = client;
};

Users.prototype.createUserPath = function(userId){
	var path = '/users';
	if(userId){
		path += '/' + userId.toString();
	}
	return path;
};

Users.prototype.get = function(options, callback){
	var path = this.createUserPath();
	var addUserId = false;
	if(options.user_id){
		addUserId = true;
		path = this.createUserPath(options.user_id);
	}else{
		if(options.query){
			path += '?query=' + options.query;
			if(options.page){
				path += '&page=' + options.page.toString();
			}
			if(options.per_page){
				path += '&per_page='+options.per_page;
			}
		}else if(options.page){
			path += '?page=' + options.page.toString();
			if(options.per_page){
				path += '&per_page='+options.per_page;
			}
		}else if(options.per_page){
			path += '?per_page'+options.per_page;
		}
	}
	this.client.get(path, callback, addUserId);
};

Users.prototype.refresh = function(payload, callback){
	var path = '/oauth/' + this.client.userId;
	this.client.post(path, payload, callback, false, true);
}

Users.prototype.update = function(payload, callback){
	var path = this.createUserPath(this.client.userId);
	this.client.patch(path, payload, callback);
}

Users.prototype.create = function(payload, callback){
	var path = this.createUserPath();
	this.client.post(path, payload, callback, true);
};

Users.prototype.addDoc = function(payload, callback){
	var path = this.createUserPath(this.client.userId);
	this.client.patch(path, payload, callback);
}

Users.prototype.answerKBA = function(payload, callback){
	var path = this.createUserPath(this.client.userId);
	this.client.patch(path, payload, callback);
};

Users.prototype.attachFile = function(filePath, callback){
	var path = this.createUserPath(this.client.userId);
	var self = this;
	try{
		fs.statSync(filePath);
		fs.readFile(filePath, function(err, original_data){
			var fileType = mime.lookup(filePath);
			var base64 = new Buffer(original_data, 'binary').toString('base64');
			var dataURI = 'data:' + fileType + ';base64,' + base64;
			var payload = {
				doc:{
					attachment: dataURI
				}
			};
			self.client.patch(path, payload, callback);
		});

	}catch(err){
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
	}
};


module.exports = Users;