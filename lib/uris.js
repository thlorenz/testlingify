'use strict';

var api = exports.api = 'api.github.com';

var credentials = exports.credentials = function (uname, pwd) {
  return [uname, pwd].map(encodeURIComponent).join(':');
};

exports.hooks = function (uname, pwd, owner, repo) {
  return 'https://' + credentials(uname, pwd) + '@' + api + '/repos/' + owner + '/' + repo + '/hooks';
};

exports.github = function (owner, repo) {
  return 'http://github.com/' + owner + '/' + repo;
};

exports.testling = 'http://git.testling.com';
