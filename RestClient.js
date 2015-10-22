var axios = require('axios');
var HelperFunctions = require('./HelperFunctions.js');
var crypto = require('crypto');

var RestClient = function(options, userId){

	this.clientOptions = options;

	this.baseUrl = 'https://synapsepay.com/api/3';
	if(options.development_mode){
		if(options.development_mode){
			this.baseUrl = 'https://sandbox.synapsepay.com/api/3';
		}
	}

	this.userId = userId;

	this.responseHandlers = {
		200: this.successHandler,
		400: this.badRequestHandler,
		401: this.unauthorizedHandler,
		402: this.requestFailedHandler,
		404: this.notFoundHandler,
		409: this.incorrectValuesHandler,
		500: this.serverErrorHandler
	};
};

RestClient.prototype.updateHeaders = function(options, userId){
	this.clientOptions = options;
	if(userId){
		this.userId = userId;
	}
};

RestClient.prototype.createHeaders = function(){

	var xSpGateway = this.clientOptions.client_id + '|' + this.clientOptions.client_secret;

	var xSpUser = '|' + this.clientOptions.fingerprint;
	if(this.clientOptions.oauth_key){
		xSpUser = this.clientOptions.oauth_key + xSpUser;
	}

	var xSpLang = 'en';
	if('lang'.indexOf(this.clientOptions) > 0){
		xSpLang = this.clientOptions.lang;
	}
	var headers = {
		'Content-Type':'application/json',
		'X-SP-USER': xSpUser,
		'X-SP-GATEWAY': xSpGateway,
		'X-SP-USER-IP': this.clientOptions.ip_address,
		'X-SP-PROD':'NO',
		'X-SP-LANG':xSpLang
	};
	return headers;
};

RestClient.prototype.get = function(path, callback, addUserId){
	var self = this;
	axios({
		url: this.baseUrl + path,
		method: 'get',
		headers: this.createHeaders()
	}).then(function(response){
		callback(response.data);
	}).catch(function(response){
		var message_object = self.handleError(response);
		callback(message_object);
	});
};

RestClient.prototype.post = function(path, payload, callback, addUserId, setOauth){
	var self = this;
	axios({
		url: this.baseUrl + path,
		method: 'post',
		data: payload,
		headers: this.createHeaders()
	}).then(function(response){
		if(addUserId){
			self.userId = response.data._id;
		}
		if(setOauth){
			if(response.data.oauth_key){
				self.clientOptions['oauth_key'] = response.data.oauth_key;
			}
		}
		callback(response.data);
	}).catch(function(response){
		console.log('what');
		console.log(response);
		var message_object = self.handleError(response);
		callback(message_object);
	});
};

RestClient.prototype.patch = function(path, payload, callback){
	var self = this;
	axios({
		url: this.baseUrl + path,
		method: 'patch',
		data: payload,
		headers: this.createHeaders()
	}).then(function(response){
		callback(response.data)
	}).catch(function(response){
		var message_object = self.handleError(response);
		callback(message_object);
	});
};

RestClient.prototype.del = function(path, callback){
	var self = this;
	axios({
		url: this.baseUrl + path,
		method: 'delete',
		headers: this.createHeaders()
	}).then(function(response){
		callback(response.data);
	}).catch(function(response){
		var message_object = self.handleError(response);
		callback(message_object);
	});
};

RestClient.prototype.successHandler = function(data){
	return data;
};

RestClient.prototype.badRequestHandler = function(data){
	return data;
};

RestClient.prototype.unauthorizedHandler = function(data){
	return data;
};

RestClient.prototype.requestFailedHandler = function(data){
	return {
		"error": {
			"en": "An error has occured in this library."
		},
		"success": false
	};
};

RestClient.prototype.notFoundHandler = function(data){
	return {
		"error": {
			"en": "The url is not found."
		},
		"success": false
	}
};

RestClient.prototype.incorrectValuesHandler = function(data){
	return data;
};

RestClient.prototype.serverErrorHandler = function(data){
	return {
		"error": {
			"en": "Server Error."
		},
		"success": false
	};
};

RestClient.prototype.handleError = function(response){
	if (response instanceof Error) {
		// Something happened in setting up the request that triggered an Error
		// console.log('Error', response.message);
		return HelperFunctions.createCustomError(response.message);
    } else {
		// The request was made, but the server responded with a status code
		// that falls out of the range of 2xx
		console.log(response.data);
		console.log(response.status);
		console.log(response.headers);
		console.log(response.config);
		if (this.responseHandlers.hasOwnProperty(response.status)){
			return this.responseHandlers[response.status](response.data);
		}else{
			var message = HelperFunctions.createCustomError(response.data);
			console.log(message);
		}
    }
};

RestClient.prototype.createHMAC = function(payload){
	var raw = payload._id.$oid+'+'+payload.recent_status.date.$date;
	var hash = new Buffer(crypto.createHmac('sha1', this.clientOptions.client_secret).update(raw).digest('hex')).toString('base64').replace('\n','');
	return hash;
};

module.exports = RestClient;
