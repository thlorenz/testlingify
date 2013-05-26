'use strict';

var uris = require('./uris')
  , request = require('request')
  , getHook = require('./get-testling-hook');

var test = module.exports = function (uname, pwd, owner, repo, cb) {
  var uri = uris.hooks(uname, pwd, owner, repo);

  getHook(uname, pwd, owner, repo, function (err, hook) {
    if (err) return cb(err);
    if (!hook) return cb(new Error('No hook found for ' + owner + '/' + repo));

    var opts = {
        uri: uri + '/' + hook.id + '/tests'
      , body: ''
      , headers: { 'user-agent': 'testlingify' }
      };

    request.post(opts, function (err, res, body) {
      if (err) return cb({ err: err });
      if (!/^2\d\d$/.test(res.statusCode)) return cb({ err: body, statusCode: res.statusCode });

      cb(null, { sent: true, message: 'Successfully pushed to testling hook for ' + owner + '/' + repo });
    });
  });
};
