'use strict';

module.exports = function check2Factor(ghConfig){
  var gh = {
      user : ghConfig.user
    , pass : ghConfig.pass
  };

  if(ghConfig.token){
    gh.user = ghConfig.token;
    gh.pass = 'X-GitHub-OTP';
  }

  return gh;
}