
## Initialization

```javascript
var SynapsePayClient = require('synapse_pay_rest');

var headers = {
	'ouath_key' : USER_OAUTH KEY, # Optional
	'fingerprint' : USER_FINGERPRINT,
	'client_id' :  YOUR_CLIENT_ID,
	'client_secret' :  YOUR_CLIENT_SECRET,
	'ip_address' :  USER_IP_ADDRESS,
	'development_mode' :  true #true will ping sandbox.synapsepay.com while false will ping synapsepay.com
};

var client = SynapsePayClient(headers);

```

## Function Callbacks

```javascript

# The callbacks should take a single response object for their parameter.

var callback = function(response){
	console.log(response);
};

```


## User API Calls

```javascript

#Create a User

var create_payload = {
	"logins" :  [
		{
			"email" :  "javascriptTest@synapsepay.com",
			"password" :  "test1234",
			"read_only" : false
		}
	],
	"phone_numbers" :  [
		"901.111.1111"
	],
	"legal_names" :  [
		"RUBY TEST USER"
	],
	"extra" :  {
		"note" :  "Interesting user",
		"supp_id" :  "122eddfgbeafrfvbbb",
		"is_business" :  false
	}
};

var create_response = client.User.create(create_payload, callback);

# Get User

var user_response = client.User.get(USER_ID, callback);

# Get All Users

var users_response = client.User.get({}, callback);

# Get Oauth Key

var oauth_payload = {
	"refresh_token" :  USER_REFRESH_TOKEN
};

var oauth_response = client.User.refresh(oauth_payload, callback);


# Add KYC Information

var ssn_payload = {
		"doc" : {
		"birth_day" : 4,
		"birth_month" : 2,
		"birth_year" : 1940,
		"name_first" : "John",
		"name_last" : "doe",
		"address_street1" : "1 Infinite Loop",
		"address_postal_code" : "95014",
		"address_country_code" : "US",
		"document_value" : "3333",
		"document_type" : "SSN"
	}
};

var ssn_response = client.User.add_doc(ssn_payload, callback);


# Answer KBA Questions

var kba_payload = {
	"doc" : {
		"question_set_id" : "557520ad343463000300005a",
		"answers" : [
			{ "question_id" :  1, "answer_id" :  1 },
			{ "question_id" :  2, "answer_id" :  1 },
			{ "question_id" :  3, "answer_id" :  1 },
			{ "question_id" :  4, "answer_id" :  1 },
			{ "question_id" :  5, "answer_id" :  1 }
		]
	}
};

var kba_response = client.User.answer_kba(kba_payload, callback);

# Attach File

var file_response = client.User.attachFile('https://s3.amazonaws.com/synapse_django/static_assets/marketing/images/synapse_dark.png', callback);

```


## Node API Calls

```javascript

# Get All Nodes

var nodes_response = client.Node.get(null, callback)

# Add Synapse Node

var synapse_node_payload = {
	"type" : "SYNAPSE-US",
	"info" : {
		"nickname" : "My Synapse Wallet"
	},
	"extra" : {
		"supp_id" : "123sa"
	}
};

var synapse_node_response = client.Node.add(synapse_node_payload, callback);

# Add ACH Node through Account and Routing Number Details

var acct_rout_payload = {
	"type" : "ACH-US",
	"info" : {
		"nickname" : "Ruby Library Savings Account",
		"name_on_account" : "Ruby Library",
		"account_num" : "72347235423",
		"routing_num" : "051000017",
		"type" : "PERSONAL",
		"class" : "CHECKING"
	},
	"extra" : {
		"supp_id" : "123sa"
	}
};

var acct_rout_response = client.Node.add(acct_rout_payload, callback);


# Verify Micro-Deposits on ACH Node

var micro_payload = {
	"micro" : [0.1,0.1]
};

micro_response = client.Node.verify(NODE_ID, micro_payload, callback);

# Add ACH node through account login

var login_payload = {
	"type" : "ACH-US",
	"info" : {
		"bank_id" : "synapse_good",
		"bank_pw" : "test1234",
		"bank_name" : "fake"
	}
};

var login_response = client.Node.add(login_payload, callback);


# Verify Login Node

var mfa_payload = {
	"access_token" : ACCESS_TOKEN_IN_LOGIN_RESPONSE,
	"mfa_answer" : "test_answer"
};

var mfa_response = client.Node.verify(mfa_payload, callback);

# Delete a Node

var delete_response = client.Node.delete(NODE_ID, callback);

```

## Transaction API Calls

```javascript

#Create a Transaction

var trans_payload = {
	"to" : {
		"type" : "SYNAPSE-US",
		"id" : "560adb4e86c27331bb5ac86e"
	},
	"amount" : {
		"amount" : 1.10,
		"currency" : "USD"
	},
	"extra" : {
		"supp_id" : "1283764wqwsdd34wd13212",
		"note" : "Deposit to bank account",
		"webhook" : "http : //requestb.in/q94kxtq9",
		"process_on" : 1,
		"ip" : "192.168.0.1"
	},
	"fees" : [{
		"fee" : 1.00,
		"note" : "Facilitator Fee",
		"to" : {
			"id" : "55d9287486c27365fe3776fb"
		}
	}]
};

var create_response = client.Trans.create(NODE_ID, trans_payload, callback);

# Get a Transaction

var transaction_response = client.Trans.get(NODE_ID, TRANS_ID, callback);

# Get All Transactions

var transactions_response = client.Trans.get(NODE_ID, callback);


# Update Transaction

var update_payload = {
	"comment" :  "hi"
};

update_response = client.Trans.update(NODE_ID, TRANS_ID, update_payload, callback);

# Delete Transaction

delete_trans_response = client.Trans.delete(NODE_ID, TRANS_ID, callback);

```