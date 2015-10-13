var RestClient = require('./RestClient');
var User = require('./api/User');
var Node = require('./api/Node');
var Trans = require('./api/Trans');

var SynapsePayClient = function(options){

	var client = new RestClient(options);

	return {
		Client: client,
		User: new User(client),
		Node: new Node(client),
		Trans: new Trans(client)
	}
};

module.exports = SynapsePayClient;