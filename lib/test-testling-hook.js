'use strict';

var uris = require('./uris')
  , request = require('request')
  , getHook = require('./get-testling-hook');

var test = module.exports = function (uname, pwd, repo, cb) {
  var uri = uris.hooks(uname, pwd, repo);

  getHook(uname, pwd, repo, function (err, hook) {
    if (err) return cb(err);
    if (!hook) return cb(new Error('No hook found for ' + uname + '/' + repo));

    var opts = {
        uri: uri + '/' + hook.id + '/test'
      , body: ''
      , headers: { 'user-agent': 'testlingify' }
      };

    request.post(opts, function (err, res, body) {
      if (err) return cb({ err: err });
      if (!/^2\d\d$/.test(res.statusCode)) return cb({ err: body, statusCode: res.stausCode });

      cb(null, { sent: true, message: 'successfully pushed to ' + uname + '/' + repo });
    });
  });
};

if (module.parent) return;
test('thlorenz', process.env.githubpwd, 'brace', function (err, res) {
  console.error('err: ', err);
  console.error('res: ', res);
});
