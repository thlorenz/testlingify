'use strict';

var uris = require('./uris')
  , request = require('request')
  , getHook = require('./get-testling-hook');

var post = module.exports = function (uname, pwd, repo, cb) {
  var uri = uris.hooks(uname, pwd, repo);
  getHook(uname, pwd, repo, function (err, hook) {
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
      
      cb(null, { created: true, message: 'testling hook for ' + uname + '/' + repo + ' successfully created' });
    });
  });
};

if (module.parent) return;
post('thlorenz', process.env.githubpwd, 'test-api', function (err, res) {
  console.error('err: ', err);
  console.error('res: ', res);
});
