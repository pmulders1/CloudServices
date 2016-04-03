var app;
var request;
var agent;

function makeGetRequest(route, statusCode, done){
	var req = request(app).get(route);

	if(agent){
		agent.attachCookies(req);
	}
	
	req.set('Accept', 'application/json')
		.expect(statusCode)
		.end(function(err, res){

			done(null, res);
		});
	};

function makePostRequest(route, body, statusCode, done){
	var req = request(app)
		.post(route);

		if(agent){
			agent.attachCookies(req);
		}

		req.set('Accept', 'application/json')
		.type('json')
		.send(body)
		.expect(statusCode)
		.end(function(err, res){
			done(null, res);
		});
};

function makePutRequest(route, body, statusCode, done){
	var req = request(app)
		.put(route);

		if(agent){
			agent.attachCookies(req);
		}


		req.type('json')
		.send(body)
		.expect(statusCode)
		.end(function(err, res){
			done(null, res);
		});
};

function makeDeleteRequest(route, body, statusCode, done){
	var req = request(app)
		.delete(route);

		if(agent){
			agent.attachCookies(req);
		}

		req.set('Accept', 'application/json')
		.expect(statusCode)
		.end(function(err, res){

			done(null, res);
		});
};

module.exports = function(req, application, superagent){
	request = req;
	app = application;
	agent = superagent;
	return {
        "makeGetRequest" : makeGetRequest,
        "makePostRequest" : makePostRequest,
        "makePutRequest" : makePutRequest,
        "makeDeleteRequest" : makeDeleteRequest
    }
}