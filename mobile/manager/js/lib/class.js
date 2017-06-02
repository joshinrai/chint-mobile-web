function Class(o) {
  // Convert existed function to Class
  if (typeof o === 'function') {
    o.extends = Class.extends;
    return o;
  }
}

Class.extends = function (properties) {
  properties = properties || {};

  var parent = this;

  // 子类构造器函数
  function SubClass() {
    parent.apply(this, arguments);
    if (this.constructor === SubClass && this.__constructor) {
      this.__constructor.apply(this, arguments);
    }
  }

  // 子类继承父类static properties
  mix(SubClass, parent);

  // 子类继承父类原型链
  var proto = createProto(parent.prototype);
  proto.constructor = SubClass;
  SubClass.prototype = proto;
  SubClass.__super__ = parent.prototype;

  // 子类的原型对象中添加properties对象的显示属性
  mix(SubClass.prototype, properties);

  return SubClass;
};

function mix(r, s, wl) {
  // Copy "all" properties including inherited ones.
  for (var p in s) {
    if (s.hasOwnProperty(p)) {
      if (wl && indexOf(wl, p) === -1) continue

      // 在 iPhone 1 代等设备的 Safari 中，prototype 也会被枚举出来，需排除
      if (p !== 'prototype') {
        r[p] = s[p]
      }
    }
  }
}

function ctor () {}
var createProto = Object.__proto__ ?
  function (proto) {
    return {__proto__: proto};
  } : 
  function (proto) {
    ctor.prototype = proto;
    return new ctor();
  }
