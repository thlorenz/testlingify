module.exports = {
    github: {
        username: ''    // please provide your github username here
      , password: ''    // please provide your github password here (same you use to log into github)
    }
  , testling: {
      files: 'test/*.js'
      , browsers: [
          'ie/8..latest'
        , 'firefox/16..latest'
        , 'firefox/nightly'
        , 'chrome/22..latest'
        , 'chrome/canary'
        , 'opera/12..latest'
        , 'opera/next'
        , 'safari/5.1..latest'
        , 'ipad/6.0..latest'
        , 'iphone/6.0..latest'
        , 'android-browser/4.2..latest'
      ]
    }
};
