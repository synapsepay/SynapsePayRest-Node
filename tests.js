var headers = {
	client_id: 'RM7p64AfCh3cY74QV7CM',
	client_secret: '6Cymilqb2hfzlvEJyr8QD71lNJUQ4UZaJ8qUP4nr',
	oauth_key: '',
	fingerprint: '8263af189ed09c4ae792a923b821f5c8',
	ip_address: '24.130.174.164',
	development_mode: true
};

var SynapsePayClient = require('./SynapsePayClient.js');

var client = SynapsePayClient(headers);

var logCallback = function(response){
	console.log(response);
};

var createCallback = function(response){
	console.log("CREATED USER");
	console.log(response);
	refreshPayload = {
		refresh_token: response['refresh_token']
	};
	client.Users.refresh(refreshPayload, refreshCallback);

}

var refreshCallback = function(response){
	console.log("REFRESHED")
	console.log(response);
	var ssnPayload = {
		"doc":{
			"birth_day":4,
			"birth_month":2,
			"birth_year":1940,
			"name_first":"John",
			"name_last":"doe",
			"address_street1":"1 Infinite Loop",
			"address_postal_code":"95014",
			"address_country_code":"US",
			"document_value":"3333",
			"document_type":"SSN"
		}
	};

	client.Users.addDoc(ssnPayload, addDocCallback);
}

var addDocCallback = function(response){
	console.log('ADDED DOC');
	console.log(response);
	var kbaPayload = {
		"doc":{
			"question_set_id":"557520ad343463000300005a",
			"answers":[
				{ "question_id": 1, "answer_id": 1 },
				{ "question_id": 2, "answer_id": 1 },
				{ "question_id": 3, "answer_id": 1 },
				{ "question_id": 4, "answer_id": 1 },
				{ "question_id": 5, "answer_id": 1 }
			]
		}
	};
	client.Users.answerKBA(kbaPayload, answerKBACallback);

};

var util = require("util");
var mime = require("mime");
var fs = require('fs');

var answerKBACallback = function(response){
	console.log("ANSWERED KBA");
	console.log(response);
	client.Users.attachFile('https://s3.amazonaws.com/synapse_django/static_assets/marketing/images/synapse_dark.png', uploadFileCallback);
};

var uploadFileCallback = function(response){
	console.log('UPLOADED FILE');
	console.log(response);
	var manualPayload = {
		"type":"ACH-US",
		"info":{
			"nickname":"Python Library Savings Account",
			"name_on_account":"Python Library",
			"account_num":"72347235423",
			"routing_num":"051000017",
			"type":"PERSONAL",
			"class":"CHECKING"
		},
		"extra":{
			"supp_id":"123sa"
		}
	};
	client.Nodes.add(manualPayload, achManCallback);
};

var achManCallback = function(response){
	console.log("ADDED MANUAL NODE");
	console.log(response);
	var options = {node_id: response['nodes'][0]['_id']};
	var verManPayload = {
		"micro":[0.1,0.1]
	};
	client.Nodes.verify(options, verManPayload, verManCallback);
};

var verManCallback = function(response){
	console.log("VERIFIED MANUAL NODE");
	console.log(response);
	var loginPayload = {
		"type":"ACH-US",
		"info":{
			"bank_id":"synapse_good",
			"bank_pw":"test1234",
			"bank_name":"bofa"
		}
	};
	client.Nodes.add(loginPayload, addLoginCallback);
};

var addLoginCallback = function(response){
	console.log("ADDED LOGIN NODE");
	console.log(response);
	var options = {};
	var mfaPayload = {
		"access_token":response['mfa']['access_token'],
		"mfa_answer":"test_answer"
	}

	client.Nodes.verify(options, mfaPayload, verLoginCallback);
};

var verLoginCallback = function(response){
	console.log("VERIFIED LOGIN NODE");
	console.log(response);
	client.Nodes.delete(response['nodes'][0]['_id'], nodeDeleteCallback);
};

var nodeDeleteCallback = function(response){
	console.log("NODE DELETED");
	console.log(response);
	client.Nodes.get({}, nodeGetCallback);
};

var nodeGetCallback = function(response){
	console.log("NODE GOT");
	console.log(response);
	var transPayload = {
		"to":{
			"type":response['nodes'][0]['type'],
			"id":response['nodes'][0]['_id']
		},
		"amount":{
			"amount":1.10,
			"currency":"USD"
		},
		"extra":{
			"supp_id":"1283764wqwsdd34wd13212",
			"note":"Deposit to bank account",
			"webhook":"http://requestb.in/q94kxtq9",
			"process_on":1,
			"ip":"192.168.0.1",
		}
	};

	client.Trans.create(response['nodes'][1]['_id'], transPayload, transCreateCallback);
}

var transCreateCallback = function(response){
	console.log("CREATED TRANSACTION");
	console.log(response);
	var updatePayload = {
		'comment': 'sup'
	};
	var nodeId = response['to']['id'];
	var transId = response['_id'];
	client.Trans.update(nodeId, transId, updatePayload, transUpdateCallback);
};

var transUpdateCallback = function(response){
	console.log("UPDATED TRANSACTION");
	console.log(response);
	var nodeId = response['trans']['from']['id'];
	var transId = response['trans']['_id'];
	client.Trans.delete(nodeId, transId, transDeleteCallback);
};

var transDeleteCallback = function(response){
	console.log("DELETED TRANSACTION");
	console.log(response);
	// client.Trans.get(nodeId, null, transGetCallback);
};

var transGetCallback = function(response){
	console.log("GOT TRANSACTIONS");
	console.log(response);
};

var createPayload = {
	"logins" : [
		{
			"email" : "test_node2@synapsepay.com",
			"password" : "test1234",
			"read_only":false
		}
	],
	"phone_numbers" : [
		"901.111.1111"
	],
	"legal_names" : [
		"Node Test User 2"
	],
	"extra" : {
		"note" : "Interesting user",
		"supp_id" : "122eddfgbeafrfvbbb",
		"is_business" : false
	}
};

client.Users.create(createPayload, createCallback);