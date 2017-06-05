var View = Event.extends({
  /**
   * name 名字
   * @type {String}
   */
  name: 'View',
  /**
   * options 模块配置，一般包括tpl渲染需要用到的变量等
   * @type {Object}
   */
  options: {},
  /**
   * node 模块dom容器元素
   * @type {Jquery Object}
   */
  node: null,

  /**
   * __constructor 构造器方法，将传入options挂载到this.options
   * @param  {Object} options 对象
   */
  __constructor: function (options) {
    this.options = options;
  },
  /**
   * setNode 设置模块dom容器元素
   * @param {String} node Jquery selector style
   * eg '#id'、'.class'
   */
  setNode: function (node) {
    this.node = $(node);
  },
  /**
   * init 事件绑定等
   */
  init: function () {},
  /**
   * load 数据动态加载
   */
  load: function () {},
  /**
   * render 绘制，数据绘制到dom容器中
   */
  render: function () {},
  /**
   * destroy 事件销毁等
   */
  destroy: function () {}
});
