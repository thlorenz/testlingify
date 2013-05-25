'use strict';

var protocol = exports.protocol = 'https://';
var api = exports.api = 'api.github.com';

var credentials = exports.credentials = function (uname, pwd) {
  return [uname, pwd].map(encodeURIComponent).join(':');
};

exports.hooks = function (uname, pwd, repo) {
  return protocol + credentials(uname, pwd) + '@' + api + '/repos/' + uname + '/' + repo + '/hooks';
};
