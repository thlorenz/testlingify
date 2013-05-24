'use strict';

var uris = require('./uris')
  , request = require('request');

var gett = module.exports = function (uname, pwd, repo, cb) {
  var uri = uris.hooks(uname, pwd, repo);
  console.error('uri: ', uri);
  
  var opts = {
      uri: uri
    , json: true
    , body: {
      }
    , headers: {
      'user-agent': 'testlingify'
      }
    };

  request.get(opts, function (err, res, body) {
    if (err) return cb(err);
    if (res.statusCode !== 200) return cb(body);
    cb(null, body);
  });
};


gett('thlorenz', process.env.githubpwd, 'brace', function (err, res) {
  console.error('err: ', err);
  console.error('res: ', res);
});
