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

Trans.prototype.get = function(options, callback){
	var path = this.createTransactionPath(this.client.userId, options.node_id);
	if(options.trans_id){
		path += '/' + options.trans_id;
	}else if(options.page){
		path += '?page='+options.page;
		if(options.per_page){
			path += '&per_page='+options.per_page;
		}
	}else if(options.per_page){
		path += '?per_page='+options.per_page;
	}
	this.client.get(path, callback);
};

module.exports = Trans;