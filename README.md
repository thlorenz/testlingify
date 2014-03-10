# testlingify [![build status](https://secure.travis-ci.org/thlorenz/testlingify.png)](http://travis-ci.org/thlorenz/testlingify)

Adds github hooks and browser config for [testling](https://ci.testling.com/).

Heavily inspired by [travisify](https://github.com/substack/travisify).

## Installation

    npm install -g testlingify

## Usage 

The very first time you run testlingify it will create a default config for you and ask you to fill in your github
username and password by editing the generated config.

We recommend that instead of using passwords you use the [Personal Access Token](https://help.github.com/articles/creating-an-access-token-for-command-line-use) feature of GitHub along with [Two Factor
Authentication](https://github.com/blog/1614-two-factor-authentication). You can enter in an access token in place of a password when using testlingify. Make sure to enable the
`write:repo_hook` scope option when creating the access token.

Assuming we did that and are now in the local repository of the project `github.com/thlorenz/foo`.

```sh
~/dev/js/projects/foo
➝  testlingify
info testlingify Adding testling config to your package and creating testling hook on your github repository
info testlingify Loaded testlingify config from /Users/thlorenz/.config/testlingify.js
info testlingify Successfully set testling property in package.json.
info testlingify Successfully created testling hook for thlorenz/foo as thlorenz
```

```sh
~/dev/js/projects/foo
➝  testlingify test
info testlingify Testing testling hook on your github repository
info testlingify Loaded testlingify config from /Users/thlorenz/.config/testlingify.js
info testlingify Successfully pushed to testling hook for thlorenz/foo
```

```sh
~/dev/js/projects/foo
➝  testlingify badge
[![testling badge](https://ci.testling.com/thlorenz/foo.png)](https://ci.testling.com/thlorenz/foo)
```

## Commands

### testlingify

Adds a github hook for [testling](https://ci.testling.com/) and adds the default testling config to the `package.json`

You can override the default testling config by editing `~/.config/testlingify.js`.

You can inspect the added hook inside your project settings under `WebHook URLs`.

### testlingify test

Triggers the testling hook to be tested which is the same as clicking the `Test Hook` button in the `WebHook Urls`
screen.

### testlingify badge

Returns the markdown for your testling badge that you can include in your readme.
