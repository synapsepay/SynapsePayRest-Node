var RestClient = require('./RestClient');
var Users = require('./api/Users');
var Nodes = require('./api/Nodes');
var Trans = require('./api/Trans');

var SynapsePayClient = function(options){

	var client = new RestClient(options);

	return {
		Client: client,
		Users: new Users(client),
		Nodes: new Nodes(client),
		Trans: new Trans(client)
	}
};

module.exports = SynapsePayClient;