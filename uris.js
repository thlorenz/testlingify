'use strict';

var protocol = exports.protocol = 'https://';
var api = exports.api = 'api.github.com';
exports.hooks = function (uname, pwd, repo) {
  return protocol + uname + ':' + pwd + '@' + api + '/repos/' + uname + '/' + repo + '/hooks';
};
