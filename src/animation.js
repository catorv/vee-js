DEBUG && console.time('animation');
(function(v) {
  'use strict';
  
  window.requestAnimationFrame =  window.requestAnimationFrame       || 
                                  window.webkitRequestAnimationFrame || 
                                  window.mozRequestAnimationFrame    || 
                                  window.msRequestAnimationFrame     || 
                                  function(callback){
                                    setTimeout(callback, 1000 / 60);
                                  };
  window.cancelAnimationFrame = window.cancelAnimationFrame               || 
                                window.cancelRequestAnimationFrame        || 
                                window.webkitCancelAnimationFrame         || 
                                window.webkitCancelRequestAnimationFrame  || 
                                window.mozCancelAnimationFrame            || 
                                window.mozCancelRequestAnimationFrame     || 
                                window.msCancelAnimationFrame             || 
                                window.msCancelRequestAnimationFrame      || 
                                clearTimeout;
  var PI = Math.PI
  
  // http://easings.net/zh-cn
  var easing = v.easing = {
    
    // cubic-bezier(0.55, 0.085, 0.68, 0.53)
    quadIn: function(n) {
      return n * n
    },
    // cubic-bezier(0.25, 0.46, 0.45, 0.94)
    quadOut: function(n) {
      return -n * (n - 2)
    },
    // cubic-bezier(0.455, 0.03, 0.515, 0.955)
    quadInOut: _easeInOut('quad'),
    
    // cubic-bezier(0.55, 0.055, 0.675, 0.19)
    cubicIn: function(n) {
      return n * n * n
    },
    // cubic-bezier(0.215, 0.61, 0.355, 1)
    cubicOut: function(n) {
      return --n * n * n + 1
    },
    // cubic-bezier(0.645, 0.045, 0.355, 1)
    cubicInOut: _easeInOut('cubic'),
    
    // cubic-bezier(0.895, 0.03, 0.685, 0.22)
    quartIn: function(n) {
      return n * n * n * n
    },
    // cubic-bezier(0.165, 0.84, 0.44, 1)
    quartOut: function(n) {
      return 1 - (--n) * n * n * n;
    },
    // cubic-bezier(0.77, 0, 0.175, 1)
    quartInOut: _easeInOut('quart'),
    
    // cubic-bezier(0.755, 0.05, 0.855, 0.06)
    quintIn: function(n) {
      return n * n * n * n * n
    },
    // cubic-bezier(0.23, 1, 0.32, 1)
    quintOut: function(n) {
      return 1 + (--n) * n * n * n * n
    },
    // cubic-bezier(0.86, 0, 0.07, 1)
    quintInOut: _easeInOut('quint'),
    
    // cubic-bezier(0.47, 0, 0.745, 0.715)
    sineIn: function(n) {
      return 1 - Math.cos(n * (PI / 2))
    },
    // cubic-bezier(0.39, 0.575, 0.565, 1)
    sineOut: function(n) {
      return Math.sin(n * (PI / 2))
    },
    // cubic-bezier(0.445, 0.05, 0.55, 0.95)
    sineInOut: _easeInOut('sine'),
    
    // cubic-bezier(0.95, 0.05, 0.795, 0.035)
    expoIn: function(n) {
      return n == 0 ? 0 : Math.pow(2, 10 * (n - 1))
    },
    // cubic-bezier(0.19, 1, 0.22, 1)
    expoOut: function(n) {
      return n == 1 ? 1 : 1 - Math.pow(2, -10 * n)
    },
    // cubic-bezier(1, 0, 0, 1)
    expoInOut: _easeInOut('expo'),
    
    // cubic-bezier(0.6, 0.04, 0.98, 0.335)
    circIn: function(n) {
      return 1 - Math.sqrt(1 - n * n)
    },
    // cubic-bezier(0.075, 0.82, 0.165, 1)
    circOut: function(n) {
      return Math.sqrt(1 - (--n) * n)
    },
    // cubic-bezier(0.785, 0.135, 0.15, 0.86)
    circInOut: _easeInOut('circ'),
    
    elasticIn: function(n) {
      return Math.pow(2, 11 * (--n)) * Math.sin(PI * 2 * (n * 5.25 + 0.25))
    },
    elasticOut: function(n) {
      return Math.pow(2, -11 * n) * Math.sin(PI * 2 * (n * -5.25 + 0.75)) + 1
    },
    elasticInOut: _easeInOut('elastic'),
    
    // cubic-bezier(0.6, -0.28, 0.735, 0.045)
    backIn: function(n) {
      return n * n * n - n / 2 * Math.sin(n * PI)
    },
    // cubic-bezier(0.175, 0.885, 0.32, 1.275)
    backOut: function(n) {
      return 1 - ((n = 1 - n) * n * n - n / 2 * Math.sin(n * PI))
    },
    // cubic-bezier(0.68, -0.55, 0.265, 1.55)
    backInOut: _easeInOut('back'),
    
    bounceIn: function(n) {
      return 1 - easing.bounceOut(1 - n)
    },
    bounceOut: function(n) {
      if (n < (1 / 2.75)) {
        return 7.5625 * n * n
      } else if (n < (2 / 2.75)) {
        return 7.5625 * (n -= (1.5 / 2.75)) * n + .75
      } else if (n < (2.5 / 2.75)) {
        return 7.5625 * (n -= (2.25 / 2.75)) * n + .9375
      } else {
        return 7.5625 * (n -= (2.625 / 2.75)) * n + .984375
      }
    },
    bounceInOut: _easeInOut('bounce'),
    
    linear: function(n) {
      return n;
    }
  };
  
  ;[
    'animationStart', 'animationEnd', 'animationIteration', 'transitionEnd'
  ].forEach(function(name) {
    v.fn[name] = function(fn) {
      this.on(name.toLowerCase(), fn)
    }
  })
  
  v.Animator = function(options) {
    v.x(this, options, {
      duration: 350,
      startValue: 0,
      endValue: 1,
      reversed: false,
      easing: easing.cubicOut,
      onStep: v.nop,
      onStop: v.nop
    });
  };
  
  v.x(v.Animator.prototype, {
    start: function() {
      this.stop();
      
      this.t0 = this.t1 = Date.now();
      this.value = this.startValue;
      
      var self = this;
      return new Promise(function(resolve) {
        function _next() {
          self.t1 = Date.now();
          self.dt = self.t1 - self.t0;
          self.percent = self.dt / self.duration
          
          var f = _easedLerp(self.percent, self.easing, self.reversed);
          if (self.percent >= 1 || self.dt >= self.duration) {
            self.value = self.endValue
            _cancel(self);
            self.onStep(self.value);
            resolve(self);
          } else {
            self.job = requestAnimationFrame(_next);
            self.value = self.startValue + f * (self.endValue - self.startValue)
            self.onStep(self.value);
          }
        }
        
        self.job = requestAnimationFrame(_next);
      });
    },
    
    stop: function() {
      _cancel(this);
      this.onStop();
    }
  });
  
  function _cancel(obj) {
    cancelAnimationFrame(obj.job);
    obj.job = null;
  }
  
  function _easedLerp(lerp, easing, reverse) {
    if (reverse) {
      return lerp >= 1 ? 0 : (1 - easing(1 - lerp));
    } else {
      return lerp >= 1 ? 1 : easing(lerp);
    }
  }
  
  function _easeInOut(name) {
    return function(n) {
      n *= 2
      if (n < 1) {
        return easing[name + 'In'](n) / 2
      } else {
        return easing[name + 'Out'](n - 1) / 2 + 0.5
      }
    }
  }
})(vee);
DEBUG && console.timeEnd('animation');
