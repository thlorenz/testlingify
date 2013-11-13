'use strict';

var test         =  require('tap').test
  , check2Factor =  require('../lib/check-2factor')
  ;


test('return a username and a pass when the token is an empty string', function(t){
  var config = {
        user: 'test'
      , pass: 'test'
      , token: ''
      }
    , twoFactor = check2Factor(config);

    t.plan(1);
    t.notEqual('X-GitHub-OTP', twoFactor.pass, 'Should not equal X-GitHub-OTP');
});

test('return X-GitHub-OTP when the token field is set', function(t){
  var config = {
        user: 'test'
      , pass: 'test'
      , token: 'test'
      }
    , twoFactor = check2Factor(config);

    t.plan(1);

  t.equal('X-GitHub-OTP', twoFactor.pass, 'Should equal X-GitHub-OTP');
});