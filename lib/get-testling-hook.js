'use strict';

var uris = require('./uris')
  , request = require('request');

var get = module.exports = function (uname, pwd, repo, cb) {
  var uri = uris.hooks(uname, pwd, repo);
  
  var opts = {
      uri: uri
    , json: true
    , body: { }
    , headers: { 'user-agent': 'testlingify' }
    };

  request.get(opts, function (err, res, body) {
    if (err) return cb(err);
    if (res.statusCode !== 200) return cb(body);
    if (!Array.isArray(body)) return cb('expecting array response, but got: ' + JSON.stringify(body));

    var testlingHook = body
      .filter(function (x) {
        var c = x.config;
        return c && c.url === 'http://git.testling.com';
      })[0];

    cb(null, testlingHook);
  });
};

if (module.parent) return;

get('thlorenz', process.env.githubpwd, 'brace', function (err, res) {
  console.error('err: ', err);
  console.error('res: ', res);
});
