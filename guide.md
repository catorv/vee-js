轻量级JavaScript框架使用说明
=========================

框架开发的目标：  

1. 轻量。目前gzip压缩后10.3KB。
2. 易入门。使用jQuery代码风格。
3. 精简。不求大而全，框架层只包含必要的模块。

核心模块
-------

### $()

格式：

1. `$()` 创建一个空的查询器对象
2. `$(selector, children)` 创建一个查询器对象，查询selector下符合children的元素
3. `$(selector)` 创建一个查询器对象
4. `$(function)` 类似于jQuery的ready函数，与 `v.ready(function)` 相同

说明：

1. `selector` 和 `children` 都是符合 CSS 选择器格式的字符串
2. $(查询器对象) === 查询器对象

### v.nop

空操作。等价于 `function(){}`。

### v.nopp

空Promise操作。等价于 `Promise.resolve()`。

### v.mixin() 或 v.x()

格式： `v.mixin(obj1[, obj2[, obj3[, ...]]][, overwrite])`

说明：

1. 将 `obj2`、`obj3` 等对象混入 `obj1` 对象中
2. 如果 `obj1` 为 `false` 值（如 `null` 等），则新建一个对象赋给 `obj1`
3. 本函数接受任意多的参数，如果最后一个参数为 `true` 或者 `false`，则将其复制给 `overwrite`
4. 如果 `overwrite` 为 `true`，则在混入的时候，放在后面的对象中的键值会覆盖前面的对象中的键值，否则保留前面对象的键值。`overwrite` 默认值为 `false`

### v.defined(obj)

说明： 相当于 `typeof obj !== 'undefined'`

### v.own(obj, property)

说明： 相当于 `obj.hasOwnProperty(property)`

### v.type(obj)

说明： 获取 `obj` 的类型，支持的基础类型如下：

1. 字符串: `string`
2. 数值型（整数和浮点数）: `number`
3. 数组: `array`
4. 对象：`object`
5. 函数：`function`
6. 正则表达式：`regexp`
7. 日期型: `date`

### v.isString(obj)

说明： 判断 `obj` 是否是字符串对象

### v.isFunction(obj)

说明： 判断 `obj` 是否是函数对象

### v.isObject(obj)

说明： 判断 `obj` 是否是 `Object` 对象

### v.isNumber(obj)

说明： 判断 `obj` 是否是数值型对象

### v.rand(min[, max])

说明：该函数返回 [`min`, `max`) 的随机整数

1. `min` 参数：随机数的最小值
2. `max` 参数：随机数的最大值
3. 如果函数传入一个参数，则该参数为 `max` 的值，而 `min` 为 0

### v.each(obj, fn[, context])

格式： `v.each(obj, fn[, context])`

说明： 如果 v.type(`obj`) == 'array'，则调用 `Array.prototype.forEach` 函数，否则以类似 `Array.prototype.forEach` 的方式遍历 `obj`

1. `fn` 是一个函数对象，其参数列表 `value`, `key`, `object`。其中，`value` 为值，`key` 为键名，`object` 为 `obj` 对象本身
2. `context` 参数指定 `fn` 函数的上下文对象

### v.map(obj, fn[, context])

说明： 类似 `Array.prototype.map`，参数说明同 `v.each(obj, fn, [context])`

### v.tpl(str, obj[, noMatched])

说明： 解析并执行字符串模板。

1. `noMatched`：当模板变量无匹配值时，用来替换模板变量占位符的。如果不指定此参数，则保留模板变量占位符。
2. 模板占位符格式为 `${name.8.subname}` ，对应 `obj.name[8].subname` 的值

### v.html.encode(str)

说明： 对字符串中的HTML特殊字符进行编码

### v.html.decode(str)

说明： 对字符串中的HTML特殊字符进行解码

### v.obj(pkgname[, context])

说明： 根据字符串 `pkgname` 获取 `context` 对应的变量值

1. `context` 未指定，则 `context` = `window`
2. `v.obj('name.8.subname', obj)` 相当于取 `obj.name[8].subname` 的值


扩展 Array 对象
--------------

### Array.from(arrayLike[, mapFn[, context]])

说明： 将一个类数组对象或可迭代对象转换成真实的数组

1. `arrayLike`：想要转换成真实数组的类数组对象或可迭代对象。
2. `mapFn`：可选参数，如果指定了该参数，则最后生成的数组会经过该函数的加工处理后再返回。
3. `context`：可选参数，执行 mapFn 函数时 this 的值。

### Array.prototype.includes(searchElement[, fromIndex])

说明： 用来判断当前数组是否包含某指定的值，如果是，则返回 true，否则返回 false。

1. `searchElement`：需要查找的元素值。
2. `fromIndex`：可选参数。从该索引处开始查找 searchElement，默认为 0。


扩展 Function 对象
-----------------

### Function.prototype.bind(scope)

说明： 与 ES5 中的定义相同

### Function.prototype.defer(millis)

说明： 延迟 `millis` 毫秒后执行函数

### Function.prototype.cancel()

说明： 取消延迟或缓冲执行的函数

### Function.prototype.buffer(millis)

说明： 缓冲执行函数，即在 `millis` 毫秒内调用函数的操作将被合并成一次执行


扩展 String 对象
---------------

### Image.load(url)

说明： 下载图片并返回传递 image 值 `Promises` 对象，可跳过防盗链的限制


扩展 Date 对象
-------------

### Date.WEEK_NAMES

说明： 星期的中文名，从“星期日”到“星期一”

### Date.MONTH_NAMES

说明： 月份的中文名，从“一月”到“十二月”

### Date.prototype.format(format[, fn])

说明： 日期对象格式化对象

格式说明

1. `y`: 年份
2. `m`: 月份 
3. `M`: 月份 名称
4. `d`: 日 
5. `h`: 小时 12小时制
6. `H`: 小时 24小时制
7. `i`: 分 
8. `s`: 秒 
9. `S`: 毫秒 
10. `w`: 星期
11. `W`: 星期 名称


面向对象编程模型
--------------

### Array.extend(obj) 或 Object.extend(obj)

说明： 对象继承的基类

1. `obj` 若是 `Object` 类型，则 `obj` 将混入新类的 `prototype`，若是 `Function` 类型，则混入的是这个函数返回的结果
2. `obj.statics` 定义了新类的类属性或方法
3. `obj.init` 定义了新类的构造函数，新建该类时会自动调用。如：`new NewClass(arguments)` 则会调用 `NewClass.prototype.init(arguments)`

### Class.extend(obj)

说明： 定义 `Class` 的子类

1. `obj` 的定义同 `Object.extend(obj)`

### Class.create(arguments)

说明： 新建类实例对象，效果同 `new Class(arguments)`

### Class.prototype.super(name[, args])

说明： 调用父类方法

1. `name` 为父类方法名称
2. `args` 为调用父类方法的参数


查询器的基本方法
--------------

*注：所有 `v.fn` 开头的属性或方法均属于查询器对象，如 `$(document.body).isQ`*

### v.fn.isQ

说明： 查询器对象标志位，可用这个属性判断对象是否是查询器

### v.fn.indexOf()

说明： 同 `Array.prototype.indexOf`，返回值是 `Array` 对象而非查询器对象

### v.fn.forEach()

说明： 同 `Array.prototype.forEach`，返回值是 `Array` 对象而非查询器对象

### v.fn.map()

说明： 同 `Array.prototype.map`，返回值是 `Array` 对象而非查询器对象

### v.fn.filter()

说明： 同 `Array.prototype.filter`，返回值是 `Array` 对象而非查询器对象


环境变量 $.env
-------------

### v.env.touch

说明： 指示当前设备是否支持触屏事件，如 `touchstart` 等。值为 `true` | `false`。

### v.env.gesture

说明： 指示当前设备是否支持手势事件，如 `gesturestart` 等。值为 `true` | `false`。

### v.env.onlnie

说明： 指示当前网络是否在线。值为 `true` | `false`。

### v.env.mobile

说明： 指示当前设备是否是移动设备。值为 `true` | `false`。

### v.env.screen.pixelRatio

说明： 设备上物理像素和设备独立像素的比例

### v.env[osname]

说明： 当前设备的操作系统及其版本号。`osname` 的值是 `'android'`、`'ios'`、`'wpos'` 中的一种。举例：`v.env.ios === 7` 表示当前设备为 iOS 7.x 的系统。

### v.env[browsername]

说明： 当前浏览器的名称和版本号。`browsername` 的值是 `'safari'`、 `'chrome'`、 `'ie'`、 `'firefox'` 中的一种。


DOM操作模块
----------

### v.getDOMObject(selector, children)

说明： 同 `$(selector, children)`

### v.query(domain, selector)

说明： 返回 `domain` 节点下符合 `selector` 的元素

1. `domain` 为 HTML DOM 元素对象
2. `children` 为 CSS 选择器格式的字符串

### v.createElements(elements[, parentNode]) 或 v.$(elements[, parentNode])

说明： 创建 DOM 节点并返回查询器对象

1. `elements` 可以是 `Object` 或 `Array` 对象。
2. 如果指定了 `parentNode`，则创建的 DOM 节点对象会追加到 `parentNode` 下。`parentNode` 可以是查询器对象或 CSS 选择器格式的字符串

`elements` 对象说明：

1. `tag`：字符串。节点的 `tagName`
2. `components`：数组。子级节点数组
3. `style`：字符串。设置 `style`
4. `flex`：整数。设置 `[-webkit-|-moz-|-ms-|-o-]flex` 到 `style`
5. `text`：字符串。设置 `textContent`
6. `html`：字符串。设置 `innerHTML`
7. `classes`：字符串。设置 `class`
8. `showing`：逻辑型。`true` 则设置 `display:block`，否则设置 `display:none`
9. `width`、`height`、`top`、`bottom`、`left`、`right`：数值或字符串。在 `style` 中设置对应样式。如果是数值，则自动添加 `px` 单位。
10. `onEventName`：函数对象。绑定事件监听。

除了以上列出的键名，其他的规则如下：

1. 如果全部都是小写字母，则直接调用 `setAttribute` 方法设置属性值
2. 如果键名中包含大写字母，则先将键名转换为以 `-` 分隔的属性名，如 `dataUrl` 变为 `data-url`，以此类推
3. 如果值为 `true`，则设置属性值为 `yes`；如果值为 `false`，则设置属性值为 `no`；否则，设置属性值为 `JSON.stringify(value)`

### v.id([element])

说明： 产生并返回唯一性的ID值

1. 若指定了 `element`，则返回 `element` 的id，但如果 `element` 未指定id，在产生新的 唯一性ID值 并设置 `element` 的id

### v.fn.attr(name[, value])

说明： 设置或返回 `name` 属性的值

### v.fn.removeAttr(name)

说明： 删除 `name` 属性

### v.fn.data(name[, value])

说明： 设置或返回 `name` data属性的值。举例：`v(document.body).data('device')` 将返回 `document.body` 元素的 `data-device` 属性的值

### v.fn.removeData(name)

说明： 设置或返回 `name` data属性的值

### v.fn.val([value])

说明： 设置或返回元素的 `value` 属性值

### v.fn.enabled([value])

说明： 设置或返回元素的 `disabled` 属性值

### v.fn.addClass(name)

说明： 添加样式 `name`

### v.fn.removeClass(name)

说明： 删除样式 `name`

### v.fn.toggleClass(name)

说明： 切换样式 `name`。如果元素已经包含该样式，则删除该样式，否则添加该样式。

### v.fn.hasClass(name)

说明： 判断元素是否包含样式 `name`

### v.fn.style(property[, value])

说明： 设置或返回 `property` 样式属性的值

### v.fn.vendor(property[, value])

说明： 类似 `v.fn.style`，但会自动添加 `-webkit-`、 `-ms-` 等前缀

### v.fn.show()

说明： 显示元素

1. 如果已设置 `v.HIDE_CLASS`（默认为 `'hide'`），则删除该样式
2. 如果已设置 `v.HIDE_CLASS`，则设置样式属性 `display` 为 `block`

### v.fn.hide()

说明： 效果与 `v.fn.show()` 相反

### v.fn.height()

说明： 获取元素高度

### v.fn.width()

说明： 获取元素宽度

### v.fn.offset()

说明： 获取元素相对于当前可见区域的偏移量。返回对象包含属性 `left`、 `top`、 `height`、 `width`

### v.fn.rect()

说明： 返回元素的 `getBoundingClientRect()` 结果

### v.fn.text([value])

说明： 设置或获取元素的 `textContent`

### v.fn.html([value])

说明： 设置或获取元素的 `innerHTML`

### v.fn.empty()

说明： 清空节点的内容

### v.fn.has([selector])

说明： 判断是否存在指定的元素

1. 如果未指定 `selector`，则判断当前对象是否存在节点元素，否则判断当前对象的子节点中是否有符合 `selector` 的元素

### v.fn.append(element)

说明： 将元素 `element` 添加到当前对象的最后一个元素之后

### v.fn.prepend(element)

说明： 将元素 `element` 添加到当前对象的第一个元素之前

### v.fn.replaceWith(element)

说明： 将当前对象包含的元素替换成 `element`

### v.fn.remove()

说明： 删除的当前节点

### v.fn.find(selector)

说明： 查找当前节点下符合 `selector` 的元素

### v.fn.parent([selector])

说明： 返回父节点。如果指定了 `selector`，则在父节点中查找符合 `selector` 的元素

### v.fn.siblings([selector])

说明： 返回兄弟节点。如果指定了 `selector`，则在兄弟节点中查找符合 `selector` 的元素

### v.fn.children([selector])

说明： 返回子节点。如果指定了 `selector`，则在子节点中查找符合 `selector` 的元素

### v.fn.first()

说明： 返回查询器对象中的第一个元素

### v.fn.last()

说明： 返回查询器对象中的最后一个元素

### v.fn.closest(selector[, context])

说明： 返回最接近的元素


事件处理模块
----------

### v.fn.on(event, callback)

说明： 监听事件

### v.fn.off(event[, callback])

说明： 取消监听事件

### v.fn.trigger(event, touch, srcEvent)

说明： 触发事件

1. `event`: 事件名称
2. `touch`: 绑定在事件对象上的参数
3. `srcEvent`: 原触发事件对象


手势处理模块
----------

目前支持的手势事件有：

1. `tap`: 轻击事件
2. `singleTap`: 单击事件，在 `tap` 事件触发后约 200 毫秒触发
3. `doubleTap`: 双击事件
4. `hold`: 长按事件
5. `dragStart`: 拖拽开始事件
6. `drag`: 拖拽事件
7. `drop`: 拖拽放开事件
8. `pinch`: 两指缩放手势
9. `pinching`: 两指缩放手势（缩放中）


AJAX模块
--------

### $.ajax(options)

说明： AJAX请求。`options` 参数如下：

1. `url`: URL
2. `type`: 请求方法: GET | POST | PUT | DELETE 等，默认 GET
3. `async`: 是否异步调用
4. `success`: 成功响应的callback函数
5. `error`: 失败或错误的callback函数
6. `context`: callback函数的上下文对象
7. `dataType`: 返回数据的类型: json | xml | text，默认值 json
8. `headers`: 头信息
9. `timeout`: 超时时间（毫秒）

### $.get(url, data, success, dataType)

说明： GET AJAX请求

### $.post(url, data, success, dataType)

说明： POST AJAX请求

### $.put(url, data, success, dataType)

说明： PUT AJAX请求

### $\['delete'\](url, data, success, dataType)

说明： DELETE AJAX请求

### v.url.encode(str)

说明： 对字符串进行 url encode

### v.url.decode(str)

说明： 对字符串进行 url decode

### v.url.build([query[, path[, host[, protocol]]]])

说明： 根据参数生成 url 字符串

1. 如果未指定任何参数，则返回相当于 `window.location.href` 字符串中去除 `hash` 部分
2. 如果省略部分参数，则省略的参数使用 `window.location` 中的相应部分替代

### v.url.parse(url)

说明： 将字符串 `url` 解析成对象，对象的属性类似 `window.location` 对象

### v.url.query([field])

说明： 将 `location.search` 字符串解析成对应的哈希对象。如果指定了 `field` (字符串)，则返回对应的参数值

### v.url.query(parameters[, prefix])

说明： 将 `parameters` 对象序列化成字符串，`prefix` 指定该字符串的前缀


文件加载
-------

### v.require(module1[[, module2[, ...]], callback]) 或 require(module1[[, module2[, ...]], callback])

举例说明：

    require('lib/core', ['lib/a', 'main'], function() {
      console.log('done');
    });

1. 加载文件 `lib/core.js`，加载成功后进入第2步。
2. 同时加载文件 `lib/a.js` 和 `main.js`，全部加载完成后进入第3步。
3. 执行回调函数，在控制台上输出 'done' 字符串。


Cookie 操作
----------

### v.cookie.get(name)

说明： 获取 Cookie 值

### v.cookie.set(name, value[, duration[, path]])

说明： 设置 Cookie 值

### v.cookie.remove(name)

说明： 删除 Cookie 值


本地存储操作
-----------

### v.storage.set(key, value)

说明： 设置本地存储数据

### v.storage.get(key)

说明： 获取本地存储数据

### v.storage.remove(key)

说明： 删除本地存储数据

### v.storage.clear()

说明： 清除所有本地存储数据


缓存数据操作
----------

### v.cache.set(key, data, duration[, type])

说明： 设置缓存数据

### v.cache.get(key)

说明： 获取缓存数据

### v.cache.remove(key)

说明： 删除缓存数据

### v.cache.clearExpired([type])

说明： 清除已过期的符合条件的缓存数据

### v.cache.clear([type])

说明： 清楚所有符合条件的缓存数据
