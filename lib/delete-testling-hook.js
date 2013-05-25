'use strict';

var uris = require('./uris')
  , request = require('request')
  , getHook = require('./get-testling-hook');

var post = module.exports = function (uname, pwd, repo, cb) {
  var uri = uris.hooks(uname, pwd, repo);
  getHook(uname, pwd, repo, function (err, hook) {
    if (err) return cb(err);
    if (!hook) return cb(null, { created: false, message: 'testling hook for ' + uname + '/' + repo + ' does not exist' });
    
    var opts = {
        uri     :  uri + '/' + hook.id
      , json    :  true
      , body    :  ''
      , headers :  { 'user-agent': 'testlingify' }
    };

    request.del(opts, function (err, res, body) {
      if (err) return cb(err);
      if (!/^2\d\d$/.test(res.statusCode)) return cb({ err: body, statusCode: res.statusCode });
      
      cb(null, { deleted: true, message: 'testling hook for ' + uname + '/' + repo + ' successfully deleted' });
    });
  });
};

if (module.parent) return;
post('thlorenz', process.env.githubpwd, 'test-api', function (err, res) {
  console.error('err: ', err);
  console.error('res: ', res);
});
