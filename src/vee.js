typeof DEBUG === 'undefined' && (DEBUG = 1);
typeof COMPATIBLE === 'undefined' && (COMPATIBLE = 0);

if (DEBUG) {
  if (!('console' in window)) {
    window.console = {
      time: function() {},
      timeEnd: function() {}
    };
  }
}

DEBUG && console.time('core');
(function(global, undefined) {
  'use strict';
  
  var EMPTY_ARRAY = [];
  var EMPTY_FUNCTION = function(){};
  var OBJECT_PROTOTYPE = Object.prototype;
  var ARRAY_PROTOTYPE = Array.prototype;
  var EXP_TYPE = /\s([a-z|A-Z]*)/;
  var EXP_TPL_TAG = /\$\{\s*(.*?)\s*\}/g;
  var EXP_TPL_VALUES = /^([\w.]+)\s*(?:\?\s*([^:]*?))?\s*(?::\s*(.*))?$/;
  var HTML_ENTITIES = [
    '&', '&amp;',
    '<', '&lt;',
    '>', '&gt;',
    ' ', '&nbsp;',
    "'", '&#39;',
    '"', '&quot;'
  ];


  // Constructor
  var v = function(selector, children) {
    if (!selector) {
      return Q();
    } else if (selector.isQ && !_defined(children)) {
      return selector;
    } else if (v.isFunction(selector)) {
      return v.ready(selector);
    } else {
      return Q(v.getDOMObject(selector, children));
    }
  };
  
  // DOM Wrapper
  var Q = function(dom) {
    dom = dom || EMPTY_ARRAY;
    dom.__proto__ = Q.prototype;
    return dom;
  };
  
  Q.prototype = v.fn = {
    isQ: true,
    indexOf: ARRAY_PROTOTYPE.indexOf,
    forEach: ARRAY_PROTOTYPE.forEach,
    map: ARRAY_PROTOTYPE.map,
    filter: ARRAY_PROTOTYPE.filter
  };
  
  // Extend Object Object
  if (COMPATIBLE) {
    _mixin(Object.prototype, {
      forEach: function(fn, scope) {
        if (Array.isArray(this)) {
          ARRAY_PROTOTYPE.forEach.apply(this, arguments);
        } else {
          for (var key in this) if (_hasOwnProperty(this, key)) {
            fn.call(scope, this[key], key, this);
          }
        }
      },
      map: function(fn, scope) {
        if (Array.isArray(this)) {
          return ARRAY_PROTOTYPE.map.apply(this, arguments);
        } else {
          var result = {};
          this.forEach(function(value, key, object) {
            result[key] = fn.call(scope, value, key, object);
          });
          return result;
        }
      },
      toArray: function(begin, end) {
        return ARRAY_PROTOTYPE.slice.call(this, begin, end);
      }
    });
  }
  
  // Extend Array Object
  Array.from = function(obj, mapFn, context) {
    var array = ARRAY_PROTOTYPE.slice.call(obj);
    if (v.isFunction(mapFn)) {
      return array.map(mapFn, context)
    }
    return array
  }
  _mixin(ARRAY_PROTOTYPE, {
    includes: function(searchElement, fromIndex) {
      fromIndex = fromIndex | 0
      return this.indexOf(searchElement, fromIndex) >= fromIndex
    },
    find: function (finderFn) {
      return this.filter(finderFn)[0]
    },
    remove: function(element) {
      var index = this.indexOf(element)
      if (index >= 0) {
        return this.splice(index, 1)[0]
      }
    }
  })
  
  // Extend Function Object
  if (COMPATIBLE) {
    Function.prototype.bind = function(scope) {
      var method = this;
      var args = Array.from(arguments).slice(1);
      return function() {
        return method.apply(scope, args.concat(Array.from(arguments)));
      };
    }
  }

  _mixin(Function.prototype, {
    defer: function(millis) {
      var self = this
      var args = ARRAY_PROTOTYPE.slice.call(arguments, 1)
      return this._job = setTimeout(function () {
        self.apply(null, args);
        delete self._job
      }, millis)
    },
    
    cancel: function() {
      clearTimeout(this._job);
      delete this._job
    },

    buffer: function(millis) {
      if (!this._job) {
        this.defer.apply(this, arguments);
      }
    }
  });
  
  // Extend String Object
  if (COMPATIBLE) {
    String.prototype.trim = function () {
      return this.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '');
    }
  }

  // Extend Image Object
  Image.load = function(url, nohack) {
    var name = v.id();
    var image = new Image()
    var iframeEl
    var clearFn = function() {
      if (name in Image) {
        delete Image[name];
      }
      if (iframeEl) {
        iframeEl.remove()
      }
    }
    
    if (!nohack) {
      Image[name] = '<img src="' + url + '">';
      
      iframeEl = v.$({
        tag: 'iframe',
        width: 1,
        height: 1,
        style: 'position:fixed;opacity:0',
        src: 'javascript:parent.Image.' + name
      }, document.body);
    }
    
    image.src = url;
    if (image.complete) {
      clearFn()
      return Promise.resolve(image);
    }
    return new Promise(function(resolve, reject) {
      image.onload = function() {
        clearFn()
        resolve(image)
      }
      image.onerror = function(event) {
        clearFn()
        reject(event)
      }
    })
  };
  
  // Extend Date Object
  Date.WEEK_NAMES = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六']
  Date.MONTH_NAMES = ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月']
  _mixin(Date.prototype, {
    format: function (format, fn) {
      var marks = {
        'y': this.getFullYear(), // 年份
        'm': this.getMonth() + 1, // 月份 
        'M': Date.MONTH_NAMES[this.getMonth()], // 月份 名称
        'd': this.getDate(), // 日 
        'h': this.getHours() % 12, // 小时 12小时制
        'H': this.getHours(), // 小时 24小时制
        'i': this.getMinutes(), // 分 
        's': this.getSeconds(), // 秒 
        'S': this.getMilliseconds(), // 毫秒 
        'w': this.getDay(), // 星期
        'W': Date.WEEK_NAMES[this.getDay()] // 星期 名称
      }
      v.each(marks, function(value, mark) {
        if (new RegExp('(' + mark + '{1,4})').test(format)) {
          var matched = RegExp.$1
          var len = matched.length
          var val = (len > 1 ? '000' : '') + value
          if (len > 1) {
            val = val.substring(val.length - len)
          }
          if (fn) {
            val = fn(mark, value, val)
          }
          format = format.replace(matched, val)
        }
      })
      return format;
    }
  })
  
  // Globle Methons
  _mixin(v, {
    nop: EMPTY_FUNCTION,
    mixin: _mixin,
    x: _mixin,
    
    defined: _defined,
    own: _hasOwnProperty,
    type: _type,
    isString: _checkType('string'),
    isFunction: _checkType('function'),
    isObject: _checkType('object'),
    isNumber: function(obj) {
      return _type(obj) === 'number' && !isNaN(obj);
    },
    
    ui: {z:2e8}, // UI module
    
    rand: function getRandomNum(min, max){
      if (!_defined(max)) {
        max = min;
        min = 0;
      }
      var range = max - min;   
      var r = Math.random();   
      return min + (r * range) | 0;   
    },
    
    each: function(obj, fn, context) {
      if (Array.isArray(obj)) {
        ARRAY_PROTOTYPE.forEach.call(obj, fn, context);
      } else {
        for (var key in obj) if (_hasOwnProperty(obj, key)) {
          fn.call(context, obj[key], key, obj);
        }
      }
    },
    
    map: function(obj, fn, context) {
      if (Array.isArray(obj)) {
        return ARRAY_PROTOTYPE.map.call(obj, fn, context);
      } else {
        var result = {};
        v.each(obj, function(value, key, object) {
          result[key] = fn.call(context, value, key, object);
        });
        return result;
      }
    },
    
    tpl: function(str, obj, noMatched) {
      return str.replace(EXP_TPL_TAG, function(matched, content) {
        var values = content.match(EXP_TPL_VALUES);
        var keys = values[1];
        var yes = values[2];
        var no = values[3];
        
        if (keys) {
          var value = _getObject(keys, obj);
          
          if (_defined(yes) || _defined(no)) {
            return value ? (yes ? v.url.decode(yes) : '') 
                         : (no ? v.url.decode(no) : '');
          } else {
            return _defined(value) ? value
                                   : (_defined(noMatched) ? noMatched : matched);
          }
        }
        
        return matched;
      });
    },
    
    html: {
      encode: function(str) {
        return str.replace(/[&<>'"]/g, function(matched) {
          return HTML_ENTITIES[HTML_ENTITIES.indexOf(matched) + 1]
        })
      },
      decode: function(str) {
        return str.replace(/&(?:amp|lt|gt|nbsp|#39|quot);/g, function(matched) {
          return HTML_ENTITIES[HTML_ENTITIES.indexOf(matched) - 1]
        })
      }
    },
    
    obj: _getObject

  });
  
  // OOP
  Array.extend = Object.extend = _extendClass;
  
  
  global.vee = global.v = v;
  '$' in global || (global.$ = v);
  
  
  function _type(obj) {
    return OBJECT_PROTOTYPE.toString.call(obj).match(EXP_TYPE)[1].toLowerCase();
  }
  
  function _checkType(type) {
    return function(obj) {
      return _type(obj) === type;
    };
  }
  
  function _defined(obj) {
    return typeof obj !== 'undefined';
  }
  
  function _hasOwnProperty(object, property) {
    return OBJECT_PROTOTYPE.hasOwnProperty.call(object, property);
  }
  
  function _mixin(target) {
    var args = arguments;
    var len = args.length;
    var i = 1;
    var overwrite, source, name;
    
    target = target || {};
    
    if (len > 1) {
      if (typeof args[len-1] === 'boolean') {
        overwrite = args[--len];
      }
        
      while (i < len) {
        source = args[i++]; 
        for (name in source) {
          if (_hasOwnProperty(source, name) && _defined(source[name]) && 
              (overwrite || !_defined(target[name]))) {
            target[name] = source[name];
          }
        }
      }
    }
    
    return target;
  }
  
  var __without_init__
  function _extendClass(obj) {
    var newClass = function() {
      if (!__without_init__) {
        this.init.apply(this, arguments);
      }
      __without_init__ = 0
    };
    
    var prototype = _createInstanceWithoutInit(this);
    
    v.each(v.isFunction(obj) ? obj() : obj, function(value, name) {
      switch (name) {
        case 'super':
        case '__class__':
          // protect common properties and methods
          break;
        
        case 'statics':
          _mixin(newClass, value);
          break;
          
        default:
          prototype[name] = value;
      }
    });
    
    prototype.__class__ = prototype.constructor = newClass;
    prototype.super = _superMethod;
    prototype.init = prototype.init || EMPTY_FUNCTION;
    
    newClass.prototype = prototype;
    newClass.__superclass__ = this;
    newClass.extend = _extendClass;
    newClass.create = _createInstance;
    
    return newClass;
  }
  
  function _superMethod(name, args) {
    var thisClass = this.__class__;
    var superClass = thisClass.__superclass__;
    
    var thisMethod = thisClass.prototype[name];
    var superMethod = superClass.prototype[name];
    
    var result;
    
    if (v.isFunction(superMethod)) {
      this.__class__ = superClass;
      thisMethod._supercalled = true;
      result = superMethod._supercalled ? this.super(name, args)
                                        : superMethod.apply(this, args);
      delete thisMethod._supercalled;
      this.__class__ = thisClass;
    }
    
    return result;
  }
  
  function _createInstance() {
    var obj = _createInstanceWithoutInit(this);
    obj.init.apply(obj, arguments);
    return obj;
  }
  
  function _createInstanceWithoutInit(cls) {
    if (cls === Object) {
      return new cls;
    }
    __without_init__ = 1;
    return new cls;
  }
  
  function _getObject(pkgname, context) {
    var keys = pkgname.split('.');
    var len = keys.length;
    var i = 0;
    var obj = context || global;
    while (obj && i < len) {
      obj = obj[keys[i++]];
    }
    return obj;
  }
  
})(window);
DEBUG && console.timeEnd('core');
