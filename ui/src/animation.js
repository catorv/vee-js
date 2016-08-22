  // function parseTransform(str) {
  //   var data = {}
  //   str.replace(/\s/g, '').split(')').map(function(item) {
  //     if (item) {
  //       var parts = item.split('(')
  //       if (parts.length == 2) {
  //         data[parts[0]] = parts[1].split(',').map(parseFloat)
  //       }
  //     }
  //   })
    
  //   var translate, scale, rotate, skew
    
  //   if (data.translate3d) {
  //     translate = data.translate3d
  //   } else if (data.translate) {
  //     translate = data.translate
  //     translate.push(0)
  //   } else if (v.defined(data.translateX) || v.defined(data.translateY) || 
  //              v.defined(data.translateZ)) {
  //     translate = [data.translateX || 0, data.translateY || 0, data.translateZ || 0];
  //   }
    
  //   if (data.scale3d) {
  //     scale = data.scale3d
  //   } else if (data.scale) {
  //     scale = data.scale
  //   } else if (v.defined(data.scaleX) || v.defined(data.scaleY) || v.defined(data.scaleZ)) {
  //     scale = [data.scaleX || 1, data.scaleY || 1, data.scaleZ || 1]
  //   }
    
  //   if (data.rotate) {
  //     rotate = data.rotate
  //   } else if (data.rotate3d) {
  //     rotate = data.rotate3d
  //   } else if (v.defined(data.rotateX) || v.defined(data.rotateY) || v.defined(data.rotateZ)) {
  //     rotate = [data.rotateX || 0, data.rotateY || 0, data.rotateZ || 0]
  //   }
    
  //   if (data.skew) {
  //     skew = data.skew
  //   } else if (v.defined(data.skewX) || v.defined(data.skewY)) {
  //     skew = [data.skewX || 0, data.skewY || 0]
  //   }
    
  //   return [translate, scale, rotate, skew]
  // }
  // function toTransform(data) {
  //   var translate = data[0]
  //   var scale = data[1]
  //   var rotate = data[2]
  //   var skew = data[3]
  //   var result = []
    
  //   var suffix = function(arr, s) {
  //     return arr.map(function(value) {
  //       return value + s
  //     })
  //   }
    
  //   if (translate) {
  //     if (translate[0] || translate[1] || translate[2]) {
  //       result.push('translate3d(' + suffix(translate, 'px').join(',') + ')')
  //     }
  //   }
    
  //   if (scale && !/^(1\b|1\s)+$/.test(scale.join(' '))) {
  //     if (scale.length == 3) {
  //       result.push('scale3d(' + scale.join(',') + ')')
  //     } else {
  //       result.push('scale(' + scale.join(',') + ')')
  //     }
  //   }
    
  //   if (rotate && !/^(0\b|0\s)+$/.test(rotate.join(' '))) {
  //     if (rotate.length == 1) {
  //       result.push('rotate(' + rotate[0] + 'deg)')
  //     } else if (rotate.length == 4) {
  //       result.push('rotate3d(' + suffix(rotate, 'deg').join(',') + ')')
  //     } else {
  //       if (rotate[0]) {
  //         result.push('rotateX(' + rotateX + 'deg)')
  //       }
  //       if (rotate[1]) {
  //         result.push('rotateY(' + rotateY + 'deg)')
  //       }
  //       if (rotate[3]) {
  //         result.push('rotateZ(' + rotateZ + 'deg)')
  //       }
  //     }
  //   }
    
  //   if (skew && !/^(0\b|0\s)+$/.test(skew.join(' '))) {
  //     result.push('skew(' + suffix(skew, 'deg').join(',') + ')')
  //   }
    
  //   return result.join(' ')
  // }
  // function calcTransform(src, dest, step) {
  //   var _translate, _scale, _rotate, _skew
    
  //   var translate1 = src[0]
  //   var scale1 = src[1]
  //   var rotate1 = src[2]
  //   var skew1 = src[3]
    
  //   var translate2 = dest[0]
  //   var scale2 = dest[1]
  //   var rotate2 = dest[2]
  //   var skew2 = dest[3]
    
  //   var calc = function(src, dest, step) {
  //     return src + step * (dest - src)
  //   }
    
  //   if (translate2 && !translate1) {
  //     translate1 = [0, 0, 0]
  //   }
    
  //   // if (translate2[0] || translate2[1] || translate2[2]) {
  //   //   _translate = translate1
  //   // } else {
  //   //   _translate = translate1
  //   // }
    
  //   return [_translate, _scale, _rotate, _skew]
  // }

(function(v) {
  function parseDest(name, value) {
    var mode = ''
    if (v.isString(value)) {
      value = value.trim()
      if (EXP_DEC.test(value)) {
        mode = 'dec'
        value = +value.substring(2)
      } else if (EXP_INC.test(value)) {
        mode = 'inc'
        value = +value.substring(2)
      } else if (EXP_COLOR.test(value)) {
        mode = 'color'
        value = parseColor(value)
      }
    }
    return {value: value, mode: mode}
  }
  
  function hex2dec(str) {
    return parseInt(str, 16)
  }
  function parseColor(str) {
    str = str.replace(/\s/g, '')
    if (str == 'transparent') {
      return [0, 0, 0, 0]
    } if (/^#/.test(str)) {
      if (str.length == 4) {
        return [hex2dec(str[1] + str[1]), hex2dec(str[2] + str[2]), hex2dec(str[3] + str[3]), 1]
      }
      return [hex2dec(str[1] + str[2]), hex2dec(str[3] + str[4]), hex2dec(str[5] + str[6]), 1]
    } else if (/^rgba?\((.*?)\)/.test(str)) {
      var result = RegExp.$1.split(',').map(function(value, index) {
        return +value
      })
      if (result.length < 4) {
        result.push(1)
      }
      return result
    }
    return [0, 0, 0, 1]
  }
  function toColor(color) {
    return 'rgba(' + (color[0] | 0) + ',' + (color[1] | 0) + ',' + (color[2] | 0) + ',' + color[3] + ')'
  }
  
  var EXP_SIZE = /^(left|right|top|bottom|width|height)$/
  var EXP_SIZE2 = /(Left|Right|Top|Bottom|Width|Height)$/
  var EXP_NUMBER = /^opacity$/
  var EXP_COLOR = /^(#[0-9a-z]{3}|#[0-9a-z]{6}|rgba?\(.*?\))$/i
  var EXP_INC = /^\+\=/
  var EXP_DEC = /^\-\=/
  
  v.fn.animation = function(dest, options) {
    var self = this
    var source = []
    
    options = options || {}
    
    dest = v.map(dest, function(value, name) {
      return parseDest(name, value)
    })
    
    self.forEach(function(element, index) {
      var el = $(element)
      var src = source[index] = {}
      v.each(dest, function(value, key) {
        var style = el.style(key)
        if (EXP_SIZE.test(key) || EXP_SIZE2.test(key)) {
          src[key] = +style.slice(0, -2) || 0
        } else if (EXP_NUMBER.test(key)) {
          src[key] = +style
        } else if (value.mode == 'color') {
          src[key] = parseColor(style)
        }
      })
    })
    
    return new v.Animator({
      duration: options.duration,
      easing: options.easing,
      reversed: options.reversed,
      onStep: function(step) {
        self.forEach(function(element, index) {
          var el = $(element)
          v.each(source[index], function(value, key) {
            var d = dest[key]
            switch (d.mode) {
              case 'dec':
                value -= step * d.value
                break
              case 'inc':
                value += step * d.value
                break
              case 'color':
                var color = [0, 0, 0, 1]
                for (var i = 0; i < 4; i++) {
                  color[i] = value[i] + step * (d.value[i] - value[i])
                }
                el.style(key, toColor(color))
                break;
              default:
                value += step * (d.value - value)
            }
            if (EXP_SIZE.test(key) || EXP_SIZE2.test(key)) {
              el.style(key, Math.round(value) + 'px')
            } else {
              el.style(key, value)
            }
          })
        })
        options.onStep && options.onStep.call(self, step)
      }
    }).start()
  }
})(vee)