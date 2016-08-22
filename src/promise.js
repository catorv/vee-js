DEBUG && console.time('promise');
(function(v) {
  'use strict';
  
  var PENDING = 0;
  var FULFILLED = 1;
  var REJECTED = 2;
  
  var Promise = v.x(function(fn) {
    // store state which can be PENDING, FULFILLED or REJECTED
    var state = PENDING;

    // store value once FULFILLED or REJECTED
    var value = null;

    // store sucess & failure handlers
    var handlers = [];

    function fulfill(result) {
      state = FULFILLED;
      value = result;
      handleAll();
    }

    function reject(error) {
      state = REJECTED;
      value = error;
      handleAll();
    }
    
    function resolve(result) {
      try {
        var then = getThen(result);
        if (then) {
          process(then.bind(result), resolve, reject)
          return;
        }
        fulfill(result);
      } catch (e) {
        reject(e);
      }
    }
    
    function handleAll() {
      var handler;
      while ( (handler = handlers.pop()) ) {
        handle(handler);
      }
    }
    
    function handle(handler) {
      if (state === PENDING) {
        handlers.push(handler);
      } else {
        if (state === FULFILLED && v.isFunction(handler.f)) {
          handler.f(value);
        }
        if (state === REJECTED && v.isFunction(handler.r)) {
          handler.r(value);
        }
      }
    }
    
    this.then = function (onFulfilled, onRejected) {
      return new Promise(function (resolve, reject) {
        handle.defer(0, {
          f: function (result) {
              if (v.isFunction(onFulfilled)) {
                try {
                  return resolve(onFulfilled(result));
                } catch (ex) {
                  return reject(ex);
                }
              }
              return resolve(result);
            },
          r: function (error) {
              if (v.isFunction(onRejected)) {
                try {
                  return resolve(onRejected(error));
                } catch (ex) {
                  return reject(ex);
                }
              }
              return reject(error);
            }
        });
      });
    };
    
    process(fn, resolve, reject);
  }, {
    reject: function (value) {
      return new Promise(function (resolve, reject) {
        reject(value);
      });
    },
    resolve: function(value) {
      return new Promise(function (resolve, reject) {
        resolve(value);
      });
    },
    all: function (arr) {
      var args = Array.prototype.slice.call(arr);
      return new Promise(function (resolve, reject) {
        if (args.length === 0) return resolve([]);
        var remaining = args.length;
        function res(i, val) {
          if (val && (typeof val === 'object' || v.isFunction(val))) {
            var then = val.then;
            if (v.isFunction(then)) {
              var p = new Promise(then.bind(val));
              p.then(function (val) {
                res(i, val);
              }, reject);
              return;
            }
          }
          args[i] = val;
          if (--remaining === 0) {
            resolve(args);
          }
        }
        for (var i = 0; i < args.length; i++) {
          res(i, args[i]);
        }
      });
    },
    race: function (values) {
      return new Promise(function (resolve, reject) {
        values.forEach(function(value){
          Promise.resolve(value).then(resolve, reject);
        });
      });
    }
  });
  
  Promise.prototype['catch'] = function (onRejected) {
    return this.then(null, onRejected);
  };
  
  v.Promise = Promise;
  'Promise' in window || (window.Promise = Promise);
  v.nopp = Promise.resolve();

  function getThen(value) {
    var t = typeof value;
    if (value && (t === 'object' || t === 'function')) {
      var then = value.then;
      if (v.isFunction(then)) {
        return then;
      }
    }
    return null;
  }

  function process(fn, onFulfilled, onRejected) {
    var done = false;
    
    function _fulfill(value) {
      if (!done) {
        done = true;
        onFulfilled(value);
      }
    }
    
    function _reject(reason) {
      if (!done) {
        done = true;
        onRejected(reason);
      }
    }

    try {
      fn(_fulfill, _reject);
    } catch (ex) {
      _reject(ex)
    }
  }
  
})(vee);
DEBUG && console.timeEnd('promise');
