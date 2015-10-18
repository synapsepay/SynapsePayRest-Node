var RestClient = require('./RestClient');
var Users = require('./api/Users');
var Nodes = require('./api/Nodes');
var Trans = require('./api/Trans');

var SynapsePayClient = function(options, userId){

	var client = new RestClient(options, userId);

	return {
		Client: client,
		Users: new Users(client),
		Nodes: new Nodes(client),
		Trans: new Trans(client)
	}
};

module.exports = SynapsePayClient;