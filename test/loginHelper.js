var superagent = require('superagent');
var agent = superagent.agent();

exports.login = function (request, app, done, theAccount) {
    request(app)
        .post('/login')
        .send(theAccount)
        .end(function (err, res) {
            if (err) {
                throw err;
            }
            agent.saveCookies(res);
            done(agent);
        });
};