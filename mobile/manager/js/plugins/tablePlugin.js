(function(namespace){
	
		  function tablePlugin() { } 
		  tablePlugin.prototype = {
			      init: function(node,data,options) {
			      	  this.node = node ;
			          this.data = data;
			          this.options = options||{};
			          return this ;
			      },
			      load : function(){
			      
			      },
			      render : function(){
			      		var self = this ;
			      },
			      /***
			      	*	参数说明
			      	*	element：dom节点，一般使用当前选中行tr
			      	*	index：行索引
			      	*	options：参数，包括total表示一个数据对象包含的所有行数，tds非标题的td，用于点击时进行行变色效果
			      	*   toggle
			      	*/
			      trColorSetting : function(element , index , options , isTouchend){
			      			var self = this ;
			      			element.attributes.index = index ;//使用index作为tr的attributes来判定当前行属于第几行
							element.attributes.total = options.total ;//使用total作为tr的attributes来设置点击时颜色变化效果的总行数
							if(0 == index){
								$(element).on('touchstart',function(){
										chintPlugins.tablePlugin.firstTrClickEvent(this,'blanchedalmond')
								}) ;
								$(element).on('touchend',function(){
										chintPlugins.tablePlugin.firstTrClickEvent(this,'initial')
								}) ;
							}else if(index < options.total){
								var tdArray = [] ;
								for(var i=0 ; i < options.tds.length ; i++){
										tdArray.push(element.childNodes[options.tds[i]]) ;
								}
								$(tdArray).on('touchstart',function(){
										chintPlugins.tablePlugin.otherTrClickEvent(this,'blanchedalmond') ;
								}) ;
								$(tdArray).on('touchend',function(){
										chintPlugins.tablePlugin.otherTrClickEvent(this,'initial') ;
								}) ;
							}
			      },
			      
			      //为第一行添加颜色变化事件
					firstTrClickEvent : function(self,color){
							if(window == self) return ;
							self.style.backgroundColor = color ;
							var total = self.attributes.total ; 
							var nextElement = self.nextSibling ;
							for(var i = 0 ; i < total ; i++){
								nextElement.style.backgroundColor = color ;
								nextElement = nextElement.nextSibling ;
							} 
					} ,
					//为其他行添加颜色变化事件
					otherTrClickEvent : function(self,color){
							if(window == self) return ;
							var index = self.parentNode.attributes.index ;
							var total = self.parentNode.attributes.total ; 
							var prevElement = self.parentNode.previousSibling ;
							var nextElement = self.parentNode.nextSibling ;
							self.parentNode.style.backgroundColor = color ;
							for(var i =0 ; i < index ; i++){
									prevElement.style.backgroundColor = color ;
									prevElement = prevElement.previousSibling ;
							}
							for(var i = 0  ; i < (total-index) ; i++){
									nextElement.style.backgroundColor = color ;
									nextElement = nextElement.nextSibling ;
							}
					},
			      destroy : function(){
			      		this.node.html('') ;
			      }
		  }
		  
		  namespace.tablePlugin = new tablePlugin() ;
	
})(window.chintPlugins)