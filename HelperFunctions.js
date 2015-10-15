
var HelperFunctions = function(){};

HelperFunctions.isBase64 = function(string){
	try {
		window.atob(str);
		return true;
	} catch(e) {
		return false;
	}
};


HelperFunctions.createCustomError = function(errorMessage){
	return {
		success: false,
		error: {
			en: errorMessage
		}
	}
};

module.exports = HelperFunctions;