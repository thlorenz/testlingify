'use strict';
var log              =  require('npmlog')
  , path             =  require('path')
  , fs               =  require('fs')
  , findParentDir    =  require('find-parent-dir')
  , jsonFile         =  require('json-file-plus')
  ;

exports = module.exports = function (dir, config, cb) {
  findParentDir(dir, '.git', function (err, dir) {
    if (err) return cb(err);
    if (!dir) return cb(new Error('not sure what happened, but I cannot find your repository root'));

    var packageLocation = path.join(dir, 'package.json');

    jsonFile(packageLocation, function (err, file) {
      if (err) {
        log.error('testlingify', 'Cannot find a package.json in repository root: ' + dir);
        return cb(err);
      }

      var testling = file.get('testling');
      if (typeof testling === 'object') {
        log.warn('testlingify', 'Found existing testling config in package.json and am not overwriting it');
        log.warn('testlingify', 'If you want me to overwrite it, first remove it from the package.json');
        return cb();
      }

      file.set({ testling: config.testling });

      file.save(packageLocation, function (err) {
        if (err) { throw err; }
        log.info('testlingify', 'Successfully set testling property in package.json.');
        cb();
      });
    });
  });
};

