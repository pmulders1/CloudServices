var app;
var request;

function makeGetRequest(route, statusCode, done){
	request(app)
		.get(route)
		.set('Accept', 'application/json')
		.expect(statusCode)
		.end(function(err, res){

			done(null, res);
		});
	};

function makePostRequest(route, body, statusCode, done){
	request(app)
		.post(route)
		.set('Accept', 'application/json')
		.type('json')
		.send(body)
		.expect(statusCode)
		.end(function(err, res){
			done(null, res);
		});
};

function makePutRequest(route, body, statusCode, done){
	request(app)
		.put(route)
		.type('json')
		.send(body)
		.expect(statusCode)
		.end(function(err, res){
			done(null, res);
		});
};

function makeDeleteRequest(route, body, statusCode, done){
	request(app)
		.get(route)
		.expect(statusCode)
		.end(function(err, res){

			done(null, res);
		});
};

module.exports = function(req, application){
	request = req;
	app = application;
	return {
        "makeGetRequest" : makeGetRequest,
        "makePostRequest" : makePostRequest,
        "makePutRequest" : makePutRequest,
        "makeDeleteReqeust" : makeDeleteRequest
    }
}