'use strict';

var api = exports.api = 'api.github.com';

var credentials = exports.credentials = function (uname, pwd) {
  return [uname, pwd].map(encodeURIComponent).join(':');
};

exports.hooks = function (uname, pwd, repo) {
  return 'https://' + credentials(uname, pwd) + '@' + api + '/repos/' + uname + '/' + repo + '/hooks';
};

exports.github = function (uname, repo) {
  return 'http://github.com/' + uname + '/' + repo;
};

exports.testling = 'http://git.testling.com';
