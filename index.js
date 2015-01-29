'use strict';

var wspawn = require('win-spawn');
var thunkify = require('thunkify');

module.exports = function* (scripts, cmd, fn) {
  var cmds = [];

  if (scripts['pre'+cmd]) cmds.push(scripts['pre'+cmd]);
  cmds.push(scripts[cmd] || fn);
  if (scripts['post'+cmd]) cmds.push(scripts['post'+cmd]);

  var c;
  while (c = cmds.shift()) {
    if (typeof c === 'function') yield c;
    else if (typeof c === 'string') yield spawn(c);
  }
};

var spawn = thunkify(function(cmd, cb) {
  var args = cmd.split(/\s+/);
  cmd = args.shift();
  var s = wspawn(cmd, args, {stdio: 'inherit'});
  s.on('close', cb);
});
