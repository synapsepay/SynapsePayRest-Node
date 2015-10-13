var axios = require('axios');

var RestClient = function(options){

	var xSpGateway = options.client_id + '|' + options.client_secret;

	var xSpUser = '|' + options.fingerprint;
	if(options.oauth_key){
		xSpUser = options.oauth_key + xSpUser;
	}

	this.baseUrl = 'https://synapsepay.com/api/3';
	if(options.development_mode){
		if(options.development_mode){
			this.baseUrl = 'https://sandbox.synapsepay.com/api/3';
		}
	}

	var xSpLang = 'en';
	if('lang'.indexOf(options) > 0){
		xSpLang = options.lang;
	}
	this.headers = {
		'Content-Type':'application/json',
		'X-SP-USER': xSpUser,
		'X-SP-GATEWAY': xSpGateway,
		'X-SP-USER-IP': options.ip_address,
		'X-SP-PROD':'NO',
		'X-SP-LANG':xSpLang
	};

	this.userId = options.userId;

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

RestClient.prototype.get = function(path, callback, addUserId){
	console.log(this.baseUrl + path);
	var self = this;
	axios({
		url: this.baseUrl + path,
		method: 'get',
		headers: this.headers
	}).then(function(response){
		if(addUserId){
			self.userId = response.data._id;
		}
		callback(response.data);
	}).catch(function(response){
		callback(response)
	});
};

RestClient.prototype.post = function(path, payload, callback, addUserId, setOauth){
	console.log(this.baseUrl + path);
	var self = this;
	axios({
		url: this.baseUrl + path,
		method: 'post',
		data: payload,
		headers: this.headers
	}).then(function(response){
		if(addUserId){
			self.userId = response.data._id;
		}
		if(setOauth){
			self.headers['X-SP-USER'] = response.data.oauth_key + self.headers['X-SP-USER'];
		}
		callback(response.data)
	}).catch(function(response){
		callback(response)
	});
};

RestClient.prototype.patch = function(path, payload, callback){
	console.log(this.baseUrl + path);

	axios({
		url: this.baseUrl + path,
		method: 'patch',
		data: payload,
		headers: this.headers
	}).then(function(response){
		callback(response.data)
	}).catch(function(response){
		callback(response)
	});
};

RestClient.prototype.del = function(path, callback){
	console.log(this.baseUrl + path);

	axios({
		url: this.baseUrl + path,
		method: 'delete',
		headers: this.headers
	}).then(function(response){
		callback(response.data)
	}).catch(function(response){
		callback(response)
	});
};

RestClient.prototype.successHandler = function(r){
	return r.json()
}

RestClient.prototype.badRequestHandler = function(r){
	return r.json()
}

RestClient.prototype.unauthorizedHandler = function(r){
	return r.json()
}

RestClient.prototype.requestFailedHandler = function(r){
	report_error(r)
	return {
		"error": {
			"en": "An error has occured in this library."
		},
		"success": false
	}
}

RestClient.prototype.notFoundHandler = function(r){
	report_error(r)
	return {
		"error": {
			"en": "The url is not found."
		},
		"success": false
	}
}

RestClient.prototype.incorrectValuesHandler = function(r){
	return r.json()
}

RestClient.prototype.serverErrorHandler = function(r){
	report_error(r)
	return {
		"error": {
			"en": "Server Error."
		},
		"success": false
	}
}

module.exports = RestClient;
