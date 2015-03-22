var EventEmitter = require('events').EventEmitter;
var _            = require('lodash');
var util         = require('util');

var Poller = function(opts) {
  this.opts = _.defaults(opts, {
    interval: 2000,
    immediate: true,
    poll: null
  });
  this._timeout = null;
};

util.inherits(Poller, EventEmitter);

Poller.prototype.start = function() {
  if(this._timeout) return this;

  this.emit('start');

  if(this.opts.immediate) {
    this._onPoll();
  } else {
    this._schedule();
  }

  return this;
};

Poller.prototype._schedule = function() {
  if(this._timeout) clearTimeout(this._timeout);
  var self = this;

  this._timeout = setTimeout(function(){
    self._onPoll();
  }, self.opts.interval);

  return this;
};

Poller.prototype.cancel = function() {
  self.emit('cancel');
  if(this._timeout) this.clearTimeout(this._timeout);
};

Poller.prototype._onPoll = function() {
  var self = this;
  this.opts.poll(function(err, res) {
    if(err) {
      self.emit('error', err);
    } else if(res.done) {
      if(res.status === 'Succeeded') {
        self.emit('done', res);
      } else {
        self.emit('error', res);
      }
    } else {
      self.emit('poll', res);
      self._schedule();
    }
  });
};

/* export factory function */

module.exports.create = function(opts) {
  return new Poller(opts);
};
