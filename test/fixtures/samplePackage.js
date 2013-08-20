'use strict';

var go = module.exports = 
  { name: 'sample-package',
  version: '0.2.3',
  description: 'Does stuff.',
  repository:
   { type: 'git',
     url: 'git://github.com/thlorenz/sample-package.git' },
  homepage: 'https://github.com/thlorenz/sample-package',
  dependencies:
   { request: '~2.21.0',
     'resolve-git-remote': '~0.1.0',
     'find-parent-dir': '~0.1.0',
     'json-file-plus': '~0.1.0' },
  devDependencies: { tap: '~0.4.3' },
  keywords:
   [ 'testling', 'browserling' ],
  author:
   { name: 'Thorsten Lorenz',
     email: 'thlorenz@gmx.de',
     url: 'http://thlorenz.com' },
  license: 'MIT',
  engine: { node: '>=0.6' } };
