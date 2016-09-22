DEBUG && console.time('data');
(function(v) {
  'use strict';

  var EXP_URL  = /^(?:\.{1,2}|(?:\w+:)?\/)\//i;
  var URL_PASTER = document.createElement('a')

  var QUERY;

  v.url = {
    encode: function(str) {
      return encodeURIComponent(str);
    },

    decode: function(str) {
      return /%u[0-9a-f]{4}/i.test(str) ? unescape(str) : decodeURIComponent(str);
    },

    build: function(query, path, host, protocol) {
      path = (path || location.pathname).replace(/^\//, '')
      query = v.isObject(query)
        ? v.url.query(query, path.indexOf('?') < 0 ? '?' : '&')
        : (query || location.search)
      path += query
      if (EXP_URL.test(path)) {
        return path
      }
      return (protocol || location.protocol) + '//' + (host || location.host) + '/' + path
    },

    parse: function(url) {
      URL_PASTER.href = url
      return v.map({
        protocol: '',
        host: '',
        port: '',
        pathname: '',
        search: '',
        hash: '',
        hostname: '',
        href: '',
        origin: ''
      }, function(_, name) {
        return URL_PASTER[name]
      })
    },

    query: function(parameters, prefix) {
      function _decode(str) {
        var result = {};
        if (str) {
          str.split('&').forEach(function (item) {
            var parts = item.split('=');
            var key = parts[0];
            var value = v.url.decode(parts[1]);
            if (/^[\[\{]/.test(value)) {
              try {
                value = JSON.parse(value);
              } catch (e) {
                // do nothing
              }
            }
            if (key in result) {
              if (Array.isArray(result[key])) {
                result[key].push(value);
              } else {
                result[key] = [result[key], value];
              }
            } else {
              result[key] = value;
            }
          });
        }
        return result;
      }

      if (!parameters || v.isString(parameters) && parameters.indexOf('=') < 0) {
        if (!QUERY) {
          QUERY = _decode(location.search.slice(1));
        }
        return parameters ? QUERY[parameters] : QUERY;
      } else if (v.isObject(parameters)) {
        prefix = prefix || '';
        var serialize = prefix;
        v.each(parameters, function(value, key) {
          if (v.defined(value)) {

            if (serialize !== prefix) {
              serialize += '&';
            }

            if (Array.isArray(value)) {
              serialize += value.map(function(val) {
                if (v.isObject(val) || Array.isArray(val)) {
                  val = JSON.stringify(val);
                }
                return key + '=' + v.url.encode(val);
              }).join('&');
            } else {
              serialize += key + '=' +
                v.url.encode(v.isObject(value) ? JSON.stringify(value) : value);
            }
          }
        });
        return (serialize === prefix ? '' : serialize);
      }

      return _decode(parameters);
    }
  };

})(vee);
DEBUG && console.timeEnd('data');
