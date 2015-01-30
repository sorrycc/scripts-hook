'use strict';

var exeq = require('exeq');
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
      else if (typeof c === 'string') yield exeq(c);
    }
  });
};

function generator(value){
  return value
    && value.constructor
    && 'GeneratorFunction' == value.constructor.name;
}
