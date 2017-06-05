var Container = Com.extends({
  /*
   * name 显式定义声明容器的名称
   * @type {String}
   */
  name: 'Container',
  /*
   * options 容器配置项，一般包括tpl渲染需要用到的变量等，在 __constructor 构造函数中赋值
   * @type {Object}
   */
  options: {},
  /**
   * node 容器依附的dom节点元素
   * @type {Jquery Object}
   */
  node: null,
  __constructor: function (options, node) {
    /**
     * coms 组件实例对象集合，包含了container中被实例化的所有组件
     * @type {Object}
     */
    this.coms = {};
    Container.__super__.__constructor.call(this, options, node);
  },
  init: function () {},
  /**
   * factory 工厂，组件构造示例的方法
   * @param  {Function} constructor 函数类
   * @param  {Object} options 包含组件配置的对象
   * @param  {String} node    Jquery selector style
   */
  factory: function (constructor, options, node) {
    var self = this;
    // 配置扩展
    var options = $.extend(true, {}, options, this.options);
    // 构造
    var com = new constructor(options, node);
    // var eventList = com.eventList;
    // if (eventList && eventList.length > 0 && eventList.indexOf('__broadcast__') !== -1) {
    //   console.log('__broadcast__ event can not by set, it is belong to defalut');
    // }
    /**
     * 所有组件实例默认绑定__broadcast__事件
     * @param  {Object} args
     * {
     *   src: com1, // 触发广播事件的组件实例，为static属性
     *   evtname: 'evnet_name', // 广播的事件名称 
     *   data: ['a', 'b'], // 参数数组，包括广播事件触发时的所有参数 
     * }
     */
    // com.on('__broadcast__', function (args) {
    //   self.broadcast(args.evtname, args.data);
    // });
    return com;
  },
  /**
   * broadcast 广播方法，遍历组件示例的eventList，触发相应事件
   * @param  {String} evtname 被触发的事件名
   * @param  {Arguments} args    参数对象，包含被触发事件传递的所有参数
   */
  broadcast: function (evtname, args) {
    if (!evtname) {
      return console.log('evtname can not be empty');
    }
    var coms = this.coms;
    for (var key in coms) {
      var com = coms[key];
      var eventList = com.eventList;
      if (eventList && eventList.length > 0 && eventList.indexOf(evtname) !== -1) {
        com.emit.call(com, evtname, args);
      }
    }
  },
  destroy: function () {}
});
