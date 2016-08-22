DEBUG && console.time('require');
(function(v) {
  'use strict';
  
  var EXP_READY = /complete|loaded|interactive/;
  var EXP_URL  = /^(?:\.{0,2}|(?:\w+:)?\/)\//i;
  var EXP_EXT   = /(?:\.js|\.css|\.jpg|\.jpeg|\.png|\.gif)$/i;
  var EXP_CSS   = /\.css$/i;
  var EXP_IMG   = /(?:\.jpg|\.jpeg|\.png|\.gif)$/i;
  
  var isReady = false;
  var head = document.getElementsByTagName('head')[0];
  var promise = v.nopp;
  
  var config = {
    baseUrl: '',
    alias: typeof REQUIRE_ALIAS === 'undefined' ? {} : REQUIRE_ALIAS
  };

  function getLoader(path) {
    var url = buildUrl(path);
    var name = url;
    var pos = url.indexOf('?');
    if (pos >= 0) {
      name = name.substring(0, pos);
    }
    
    if (EXP_CSS.test(name)) {
      return loadCSS(url);
    } else if (EXP_IMG.test(name)) {
      return loadImage(url);
    }
    
    return loadJavaScript(url);
  }
  
  function loadImage(url) {
    var image = new Image();
    image.src = url;
    if (image.complete) {
      return Promise.resolve(image);
    }
    return new Promise(function(resolve, reject) {
      image.onload = function() {
        resolve(image);
      };
      image.onerror = function() {
        reject(image);
      };
    });
  }
  
  function loadCSS(url) {
    var el = document.createElement('link');
    el.rel = 'stylesheet';
    el.href = url;
    head.appendChild(el);
    return Promise.resolve(url);
  }
  
  function loadJavaScript(url) {
    var el = document.createElement('script');
    el.src = url;
    // el.setAttribute('data-module-id', url);
    // el.charset = 'utf-8';
    // el.async = true;
    head.appendChild(el);

    return new Promise(function(resolve, reject) {
      function _removeListener(node) {
        if (node.detachEvent) {
          node.detachEvent('onreadystatechange', _success);
        } else {
          node.removeEventListener('load', _success, false);
          node.removeEventListener('error', _failure, false);
        }
      }
  
      function _success(event) {
        // var moduleId, def;
        if (event.type === 'load' || EXP_READY.test(el.readyState)) {
          _removeListener(el);
          
          // moduleId = el.getAttribute('data-module-id');
          // if (cache[moduleId] === 1) {
          //   cache[moduleId] = {};
          // }

          resolve(url);
        }
      }

      function _failure(event) {
        _removeListener(el);
        reject(url);
      }
  
      if (el.attachEvent) {
        el.attachEvent('onreadystatechange', _success);
      } else {
        el.addEventListener('load', _success, false);
        el.addEventListener('error', _failure, false);
        // el.addEventListener('readystatechange', function() {
        //   DEBUG && console.log('debug');
        // }, false);
      }
    });
  }
  
  function buildUrl(path) {
    if (config.alias[path]) {
      return config.alias[path];
    }
    
    if (!EXP_URL.test(path)) {
      path = config.baseUrl + path;
    }

    if (path.indexOf('?') < 0 && !EXP_EXT.test(path)) {
      path += '.js';
    }
    
    return path;
  }
  
  v.require = window.require = v.x(function require() {
    var args = Array.from(arguments);

    if (Array.isArray(args[0])) {
      args = args[0];
    }
    
    return promise = promise.then(function() {
      return new Promise(function(resolve, reject) {
        function DOMLoaded(event) {
          if (document.addEventListener) {
            document.removeEventListener('DOMContentLoaded', DOMLoaded, false);
          } else if (EXP_READY.test(document.readyState)) {
            document.detachEvent('onreadystatechange', DOMLoaded);
          } else {
            return;
          }

          resolve();
        }
        
        if (!isReady) {
          isReady = EXP_READY.test(document.readyState)
        }
        
        if (isReady) {
          resolve();
        } else {
          if (document.addEventListener) {
            document.addEventListener('DOMContentLoaded', DOMLoaded, false);
            window.addEventListener('load', DOMLoaded, false);
          } else {
            document.attachEvent('onreadystatechange', DOMLoaded);
            window.attachEvent('onload', DOMLoaded);
          }
        }
      }).then(function() {
        return Promise.all( Array.from(args, function(path) {
          return getLoader(path);
        }) );
      });
    });
  }, {
    config: config
  });

  v.ready = function(fn) {
    if (isReady) {
      fn();
    } else {
      require().then(fn);
    }
  };

  
  // parse script element
  var scripts = document.getElementsByTagName('script');
  var len = scripts.length;
  var script, main, scriptUrl, baseUrl;
  var i = 0;
  while (i < len) {
    script = scripts[i++];
    
    if (script.hasAttribute('data-require') || script.hasAttribute('data-base-url')) {
      main = script.getAttribute('data-require');
      baseUrl = script.getAttribute('data-base-url');
      if (!baseUrl) {
        scriptUrl = script.getAttribute('src');
        baseUrl = scriptUrl.substring(0, scriptUrl.lastIndexOf('/') + 1);
      }
      config.baseUrl = baseUrl;
      
      if (main) {
        main.split(';').map(function(group) {
          require(group.split(','));
        });
      }
    }
  }
  
})(vee);
DEBUG && console.timeEnd('require');
