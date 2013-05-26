'use strict';

var uris = require('./uris')
  , request = require('request')
  , getHook = require('./get-testling-hook');

var post = module.exports = function (uname, pwd, owner, repo, cb) {
  var uri = uris.hooks(uname, pwd, owner, repo);
  getHook(uname, pwd, owner, repo, function (err, hook) {
    if (err) return cb(err);
    if (hook) return cb(null, { created: false, message: 'testling hook for ' + uname + '/' + repo + ' already exists' });

    var body = {
        name   :  'web'
      , active :  true
      , events :  [ 'push', 'pull_request' ]
      , config :  {
          url          :  uris.testling
        , content_type :  'form'
        , insecure_ssl :  '1'
      }
    };

    var opts = {
        uri     :  uri
      , json    :  true
      , body    :  body
      , headers :  { 'user-agent': 'testlingify' }
    };

    request.post(opts, function (err, res, body) {
      if (err) return cb(err);
      if (!/^2\d\d$/.test(res.statusCode)) return cb({ err: body, statusCode: res.statusCode });
      
      cb(null, { created: true, message: 'testling hook for ' + owner + '/' + repo + ' successfully created' });
    });
  });
};
