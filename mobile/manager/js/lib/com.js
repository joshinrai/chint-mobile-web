var Com = View.extends({
  /*
   * name 显式定义声明组件的名称
   * @type {String}
   */
  name: 'Com',
  /*
   * options 组件配置项，一般包括tpl渲染需要用到的变量等，在 __constructor 构造函数中赋值
   * @type {Object}
   */
  options: {},
  /**
   * node 组件依附的dom节点元素
   * @type {Jquery Object}
   */
  node: null,
  /**
   * eventList 提前声明组件需要绑定的事件列表，否则不会被广播触发
   * eg ['evtname1', 'evtname2']
   * @type {Array}
   */
  eventList: [],
  /**
   * __constructor 重写view构造器，设置options及node，同时调用init()方法
   * @param  {Object} options 包含组件配置的对象
   * @param  {String} node    Jquery selector style
   */
  __constructor: function (options, node) {
    if (typeof options === 'string' && !node) {
      node = options;
      options = {};
    }
    Com.__super__.setNode.call(this, node);
    Com.__super__.__constructor.call(this, options);
    
    this.init();
  },
  init: function () {},
  load: function () {},
  render: function () {},
  destroy: function () {}
});
