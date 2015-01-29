'use strict';

var wspawn = require('win-spawn');
var thunkify = require('thunkify');
var co = require('co');

module.exports = function(scripts, cmd, fn) {
  var cmds = [];

  if (scripts['pre'+cmd]) cmds.push(scripts['pre'+cmd]);
  cmds.push(scripts[cmd] || fn);
  if (scripts['post'+cmd]) cmds.push(scripts['post'+cmd]);

  return co(function *() {
    var c;
    while (c = cmds.shift()) {
      if (typeof c === 'function') {
        if (generator(c)) yield c;
        else yield thunkify(c)();
      }
      else if (typeof c === 'string') yield spawn(c);
    }
  });
};

var spawn = thunkify(function(cmd, cb) {
  var args = cmd.split(/\s+/);
  cmd = args.shift();
  var s = wspawn(cmd, args, {stdio: 'inherit'});
  s.on('close', cb);
});

function generator(value){
  return value
    && value.constructor
    && 'GeneratorFunction' == value.constructor.name;
}
