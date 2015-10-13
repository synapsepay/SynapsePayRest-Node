var Node = function(client){
	this.client = client;
};

Node.prototype.createNodePath = function(nodeId){
	var path = '/users/' + this.client.userId + '/nodes';
	if(nodeId){
		path += '/' + nodeId;
	}
	return path;
};

Node.prototype.add = function(payload, callback){
	var path = this.createNodePath();
	this.client.post(path, payload, callback);
};

Node.prototype.get = function(options, callback){
	var path = this.createNodePath();
	if(options.node_id){
		path += '/' + options.node_id;
	}
	this.client.get(path, callback);
};

Node.prototype.verify = function(options, payload, callback){
	var path = this.createNodePath();
	if(options.node_id){
		path += '/' + options.node_id;
		this.client.patch(path, payload, callback);
	}else{
		this.client.post(path, payload, callback);
	}
};

Node.prototype.delete = function(nodeId, callback){
	var path = this.createNodePath(nodeId);
	this.client.del(path, callback);
};

module.exports = Node;