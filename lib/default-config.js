module.exports = {
    github: {
        username: ''    // please provide your github username here
      , password: ''    // please provide your github password here (same you use to log into github)
    }
  , testling: {
      files: 'test/*.js'
      , browsers: [
          'ie/8..latest'
        , 'firefox/3.6'
        , 'firefox/4'
        , 'firefox/17..latest'
        , 'firefox/nightly'
        , 'chrome/4'
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
