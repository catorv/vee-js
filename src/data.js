DEBUG && console.time('data');
(function(v) {
  'use strict';
  
  var cookies;
  var version = typeof DATA_VERSION === 'undefined' ? '0' : ('' + DATA_VERSION);
  var cachePrefix = '~';

  // Cookie
  v.cookie = {
    get: function(name) {
      if (!cookies) {
        cookies = {};
        var ca = document.cookie.split(';');
        var i = 0;
        while (i < ca.length) {
          var c = ca[i++].trim();
          var index = c.indexOf('=');
          
          cookies[v.url.decode(c.slice(0, index))] = v.url.decode(c.slice(index + 1));
        }
      }
      
      return name ? cookies[name] : cookies;
    },
    set: function(name, value, duration /* seconds */, path) {
      if (duration) {
        if (v.isNumber(duration)) {
          duration = new Date(Date.now() + duration * 1000);
        }
        duration = ";expires=" + duration.toGMTString();
      } else {
        duration = '';
      }
      
      document.cookie = v.url.encode(name) + '=' + 
                        v.url.encode(value) + 
                        duration + 
                        ';path=' + (path || '/');
      cookies = null;
    },
    remove: function(name) {
      this.set(name, '', -1);
    },
    clear: function () {
	    v.each(v.cookie.get(), function(_, name) {
		    v.cookie.remove(name)
	    })
    }
  };
  
  // Local Strorage
  v.storage = {
    set: function(key, value) {
      if (value === null || typeof value === 'undefined') {
        this.remove(key);
      } else {
        localStorage.setItem(key, _encode(value));
      }
    },

    get: function(key) {
      return _decode(localStorage.getItem(key));
    },

    remove: function(key) {
      localStorage.removeItem(key);
    },

    clear: function() {
      localStorage.clear();
    }
  };
  
  // Cache
  v.cache = {
    set: function(key, data, duration /* seconds */, type) {
      if (v.isNumber(duration)) {
        duration = _timestamp() + duration;
      } else {
        duration = _timestamp(duration);
      }
      
      var cacheValue = [data, duration];
      if (type) {
        cacheValue.push(type | 0);
      }

      v.storage.set(cachePrefix + key, cacheValue);
    },

    get: function(key) {
      var cache = v.storage.get(cachePrefix + key);
      var time = _timestamp();

      return (cache && cache[1] > time) ? cache[0] : undefined;
    },

    remove: function(key) {
      v.storage.remove(cachePrefix + key);
    },

    clearExpired: function(type) {
      this.clear(type, _timestamp());
    },

    clear: function(type, duration) {
      type |= 0;
      duration |= 0;
      
      var key;
      var cache;
      for (key in localStorage) if (localStorage.hasOwnProperty(key)) {
        if (key[0] === cachePrefix) {
          cache = v.storage.get(key);
          if ((type === 0 || type === cache[2]) && 
              (duration === 0 || cache[1] <= duration)) {
            v.storage.remove(key);
          }
        }
      }
    }
  };
  
  try {
    var localVersion = v.storage.get('STORAGE_VERSION');
    if (localVersion !== null) {
      if (localVersion !== version) {
        v.cookie.clear()
        v.storage.clear()
      } else {
        v.cache.clearExpired()
      }
    }
    v.storage.set('STORAGE_VERSION', version)
  } catch (e) {
    // if (e.name == 'QUOTA_EXCEEDED_ERR') {
    //   alert('检测到私密浏览方式已打开，请到设置- safari中关闭私密浏览方式');
    // }
  }
  
  function _encode(value) {
    if (typeof value == 'object') {
      return '@' + JSON.stringify(value);
    }
    
    if (typeof value == 'number') {
      return '' + value;
    }
    
    value = '' + value;
    var ch = value[0];
    if (ch === '@' || ch === "'" || ch >= '0' && ch <= '9' || ch === '-') {
      return "'" + value;
    }
    
    return value;
  }

  function _decode(value) {
    if (value) {
      var ch = value[0];
      if (ch === '@') {
        return JSON.parse(value.slice(1));
      } else if (ch >= '0' && ch <= '9' || ch === '-') {
        return +value;
      } else if (ch === "'") {
        return value.slice(1);
      }
    }
    return value;
  }
  
  function _timestamp(date) {
    // since Fri Aug 09 2013 15:12:01 GMT+0800 (CST)
    return ((date || Date.now()) / 1000 | 0) - 1376032321;
  }
})(vee);
DEBUG && console.timeEnd('data');
