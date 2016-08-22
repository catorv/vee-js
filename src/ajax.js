DEBUG && console.time('ajax');

// https://github.com/pyrsmk/qwest/blob/master/src/qwest.js
(function(v) {
  'use strict';
  
  var DEFAULTS = {
    TYPE: 'GET',
    MIME: 'json'
  };
  var MIME_TYPES = {
    script: 'text/javascript, application/javascript',
    json: 'application/json',
    xml: 'application/xml, text/xml',
    html: 'text/html',
    text: 'text/plain'
  };
  var JSONP_ID = 0;

  v.ajaxSettings = {
    // url: '',                // URL
    type: DEFAULTS.TYPE,       // 请求方法: GET | POST | PUT | DELETE 等
    dataType: DEFAULTS.MIME,   // 返回数据的类型: json | xml | text | script | html
    headers: {},               // 头信息
    timeout: 0,                // 超时时间
    xhr: function() {          // 获取 XHR 对象
      return new window.XMLHttpRequest();
    }
  };
  
  v.ajax = function(options) {
    return new Promise(function(resolve, reject) {
      var abortTimeout;
      var settings = v.x({
        _resolve: resolve,
        _reject: reject
      }, options, v.ajaxSettings);
      var xhr = settings.xhr();
      if (settings.data) {
        if (settings.type === 'GET') {
          settings.url += v.url.query(settings.data, 
                                      settings.url.indexOf('?') < 0 ? '?' 
                                                                    : '&');
        } else {
          settings.data = v.url.query(settings.data);
        }
      }
      
      // is jsonp
      if (settings.url.indexOf('=?') >= 0) {
        return jsonp(settings);
      }
      
      xhr.onreadystatechange = function() {
        if (xhr.readyState === 4) {
          clearTimeout(abortTimeout);
          _xhrStatus(xhr, settings);
        }
      };
      
      xhr.open(settings.type, settings.url, true);
      
      // set headers
      if (settings.contentType) {
        settings.headers['Content-Type'] = settings.contentType;
      }
      if (settings.dataType) {
        settings.headers['Accept'] = MIME_TYPES[settings.dataType];
      }
      for (var key in settings.headers) if (v.own(settings.headers, key)) {
        xhr.setRequestHeader(key, settings.headers[key]);
      }
      
      // set timeout
      if (settings.timeout > 0) {
        abortTimeout = setTimeout(_xhrTimeout, settings.timeout, xhr, settings);
      }
      
      try {
        xhr.send(settings.data);
      } catch (error) {
        _xhrError('Resource not found', error, settings);
      }
    });
  };
  
  var jsonp = function(settings) {
    var abortTimeout;
    var callbackName = 'jsonp' + (++JSONP_ID);
    var script = document.createElement('script');
    var xhr = {
      abort: function() {
        v(script).remove();
        if (callbackName in window) {
          delete window[callbackName];
        }
      }
    };
    
    window[callbackName] = function(response) {
      clearTimeout(abortTimeout);
      xhr.abort();
      _xhrSuccess(response, settings);
    };
    
    script.src = settings.url.replace(/=\?/, '=' + callbackName);
    v('head').append(script);
    
    if (settings.timeout > 0) {
      abortTimeout = setTimeout(_xhrTimeout, settings.timeout, xhr, settings);
    }
    
    return xhr;
  };
  
  v.get = function(url, data, dataType) {
    return v.ajax({
      url: url,
      data: data,
      dataType: dataType
    });
  };
  
  v.post = function(url, data, dataType) {
    return _xhrForm('POST', url, data, dataType);
  };
  
  v.put = function(url, data, dataType) {
    return _xhrForm('PUT', url, data, dataType);
  };
  
  v['delete'] = function(url, data, dataType) {
    return _xhrForm('DELETE', url, data, dataType);
  };
  
  function _xhrStatus(xhr, settings) {
    if ((xhr.status >= 200 && xhr.status < 300) || xhr.status === 0) {
      _xhrSuccess(_parseResponse(xhr, settings), settings);
    } else {
      _xhrError('VeeJS.ajax: Unsuccesful request', xhr.status, settings);
    }
  }
  
  function _xhrSuccess(response, settings) {
    if (response instanceof Error) {
      _xhrError(response.message, response, settings);
    } else {
      settings._resolve({
        request: settings,
        response: response
      });
      delete settings._reject;
      delete settings._resolve;
    }
  }
  
  function _xhrError(type, error, settings) {
    settings._reject({
      type: type,
      error: error,
      request: settings
    });
    delete settings._reject;
    delete settings._resolve;
  }
  
  function _xhrTimeout(xhr, settings) {
    xhr.onreadystatechange = {};
    xhr.abort();
    _xhrError('VeeJS.ajax: Timeout exceeded', null, settings);
  }
  
  function _xhrForm(method, url, data, dataType) {
    return v.ajax({
      type: method,
      url: url,
      data: data,
      dataType: dataType,
      contentType: 'application/x-www-form-urlencoded'
    });
  }
  
  function _parseResponse(xhr, settings) {
    var response = xhr.responseText;
    if (response) {
      if (settings.dataType === 'json') {
        try {
          response = JSON.parse(response);
        } catch (error) {
          response = error;
        }
      } else if (settings.dataType === 'xml') {
        response = xhr.responseXML;
      }
    }
    return response;
  }
})(vee);
DEBUG && console.timeEnd('ajax');
