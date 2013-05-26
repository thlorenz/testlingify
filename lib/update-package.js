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
        log.error('testlingify', 'cannot find a package.json in repository root: ' + dir);
        return cb(err);
      }

      var p = new jsonFile.JSONFile(data);
      p.set({ testling: config.testling });
      
      // cannot use built in p.save() here since it relies on process.cwd()
      var json = JSON.stringify(p.data, null, p.indent || 2);
      fs.writeFileSync(packageLocation + '.saved', json + (p.trailing ? '\n\n' : '\n'), 'utf-8');
      log.info('testlingify', 'Successfully set testling property in package.json.');
      cb();
    });
  });
};

