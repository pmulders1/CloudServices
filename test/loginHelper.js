var superagent = require('superagent');
var agent = superagent.agent();
var theAccount = {
    "email": "admin@admin.com",
    "password": "admin"
};

exports.login = function (request, app, done) {
    request(app)
        .post('/login')
        .send(theAccount)
        .end(function (err, res) {
            if (err) {
                throw err;
            }
            //console.log(res)
            agent.saveCookies(res);
            done(agent);
        });
};