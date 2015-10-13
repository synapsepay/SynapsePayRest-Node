var HelperFunctions = require('../HelperFunctions');

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

User.prototype.attachFile = function(base64File, callback){
	var path = this.createUserPath(this.client.userId);
	var payload = {
		doc:{
			attachment: base64File
		}
	};
	this.client.patch(path, payload, callback);
};


module.exports = User;