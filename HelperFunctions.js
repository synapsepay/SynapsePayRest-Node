
var HelperFunctions = function(){};

HelperFunctions.prototype.isBase64 = function(string){
	try {
		window.atob(str);
		return true;
	} catch(e) {
		return false;
	}
};

HelperFunctions.prototype.convertToBase64 =  function(file, callback){
	var reader = new FileReader();
	reader.onload = function(readerEvt) {
		var binaryString = readerEvt.target.result;
		callback(btoa(binaryString), callback);
	}
	reader.readAsBinaryString(file);
};

HelperFunctions.prototype.base64_encode = function(file) {
    // read binary data
    var file = fs.readFileSync(file);
    // convert binary data to base64 encoded string
    return new Buffer(bitmap).toString('base64');
}


HelperFunctions.prototype.createCustomError = function(errorMessage){
	return {
		success: false,
		error: {
			en: errorMessage
		}
	}
};

module.exports = HelperFunctions;