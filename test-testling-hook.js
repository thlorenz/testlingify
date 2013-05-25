'use strict';

var uris = require('./uris')
  , request = require('request')
  , getHook = require('./get-testling-hook');

var test = module.exports = function (uname, pwd, repo, cb) {
  var uri = uris.hooks(uname, pwd, repo);
  getHook(uname, pwd, repo, function (err, hook) {
    if (err) return cb(err);
    if (!hook) return cb(new Error('No hook found for ' + uname + '/' + repo));
     
    var user = {
        email: 'some@todo.com'
      , name: 'Some Todo'
      , username: uname
    };
    var owner = {
        email: 'some@todo.com'
      , name: uname
    };
    var commitId = '212e5c71505ddefa45625e231cbb20a3b6a77668';
    var body = {
        after   :  commitId
      , commits :  []
      , created :  false
      , deleted :  false
      , forced  :  false
      , head_commit: {
            added: []
          , author: user
          , commiter: user
          , distinct: true
          , id: commitId
          , message: 'testing testlingify commit hook'
          , modified: []
          , removed: []
          , timeStamp: '2013-03-12T08:14:29-07:00'
        }
      , ref:'refs/heads/master'
      , repository: {
            master_branch: 'master'
          , name: repo
          , owner: owner
          , private: false
          , url : uris.github(uname, repo)
        }
    };
   
    var opts = {
        uri: uris.testling
      , json: true
      , body: body 
    };

    request.get(opts, function (err, res, body) {
      if (err) return cb(err);
      if (res.statusCode !== 200) return cb(body);

      cb(null, body);
    });
  });
};

test('thlorenz', process.env.githubpwd, 'brace', function (err, res) {
  console.error('err: ', err);
  console.error('res: ', res);
});
