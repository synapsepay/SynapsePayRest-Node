var Trans = function(client){
	this.client = client;
};

Trans.prototype.createTransactionPath = function(userId, nodeId, transId){
	var path = '/users/' + userId.toString() + '/nodes/' + nodeId + '/trans';
	if(transId){
		path += '/' + transId;
	}
	return path;
};

Trans.prototype.create = function(nodeId, payload, callback){
	var path = this.createTransactionPath(this.client.userId, nodeId);
	this.client.post(path, payload, callback);
};

Trans.prototype.update = function(nodeId, transId, payload, callback){
	var path = this.createTransactionPath(this.client.userId, nodeId, transId);
	this.client.patch(path, payload, callback);
};

Trans.prototype.delete = function(nodeId, transId, callback){
	var path = this.createTransactionPath(this.client.userId, nodeId, transId);
	this.client.del(path, callback);
};

Trans.prototype.get = function(nodeId, transId, callback){
	var path = this.createTransactionPath(this.client.userId, nodeId);
	if(transId){
		path += '/' + transId;
	}
	this.client.get(path, callback);
};

module.exports = Trans;