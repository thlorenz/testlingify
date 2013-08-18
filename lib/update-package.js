'use strict';
var log              =  require('npmlog')
  , path             =  require('path')
  , fs               =  require('fs')
  , findParentDir    =  require('find-parent-dir')
  , jsonFile         =  require('json-file-plus')
  ;

module.exports = function (config, cb) {
  findParentDir(process.cwd(), '.git', function (err, dir) {
    if (err) return cb(err);
    if (!dir) return cb(new Error('not sure what happened, but I cannot find your repository root'));

    var packageLocation = path.join(dir, 'package.json');
    fs.readFile(packageLocation, 'utf-8', function (err, data) {
      if (err) {
        log.error('testlingify', 'Cannot find a package.json in repository root: ' + dir);
        return cb(err);
      }

      var p = new jsonFile.JSONFile(data);
      if (typeof p.get('testling') === 'object') {
        log.warn('testlingify', 'Found existing testling config in package.json and am not overwriting it');
        log.warn('testlingify', 'If you want me to overwrite it, first remove it from the package.json');
        return cb();
      }

      p.set({ testling: config.testling });
      
      p.save(function (err) {
        if (err) { throw err; }
        log.info('testlingify', 'Successfully set testling property in package.json.');
        cb();
      });
    });
  });
};

