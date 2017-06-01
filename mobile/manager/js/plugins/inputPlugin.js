(function(namespace){
	
		  function inputPlugin() { } 
		  inputPlugin.prototype = {
		  		 /***
		  		  *		options.style：true，从chintBodyMain中点击内容显示panel；false，从table中点击内容显示panel
		  		  */
			      init: function(node,data,options,readonly) {
						      	  this.node = node ;
						          this.data = data;
						          this.options = options||{};
						          this.readonly = readonly ;
						          return this ;
			      },
			      load : function(){
			      
			      },
			      render : function(){
					      		var self = this ;
					      		var fragment = document.createDocumentFragment() ;
					      		var display = self.options.display ? 'none':'block' ;
					      		self.labelHtml = $("<div style='text-align:left;display:"+display+";'><label>"+self.options.labelName+"：</label></div>") ;
					      		var placeholder = self.options.labelName||"参数" ;
					      		var inputType = self.options.type ;
					      		var readonly = this.options.readonly ;
					      		readonly = readonly ? " readonly= ' "+readonly+" ' " : "" ;
					      		inputType = inputType ? inputType : "text" ;
								self.inputHtml	 = $("<input "+readonly+" type='"+inputType+"' "+(self.readonly?"readonly='readonly'":"")+" placeholder='请输入"+placeholder+"' id='"+self.options.id+"' name='"+self.options.name+"' style='display:"+display+";' class='chintInput'></input>") ;
					      		fragment.appendChild(self.labelHtml[0]) ;
					      		fragment.appendChild(self.inputHtml[0]) ;
								if(self.node)self.node.append(fragment) ;
								return fragment ;
			      },
			      //绘制输入框列表
			      renderInputFragment : function(data , fragment){
			      				var inputPlugin = chintPlugins.inputPlugin ;
			      				data.forEach(function(data , index){
											fragment.appendChild( inputPlugin.init( null , {} , {labelName : data.label , id : data.name , name : data.name} ).render() ) ;
								}) ;
			      },
			      getValue : function(){
					      		var self = this ;
					      		var input = self.inputHtml.find('input') ;
					      		return input.val() || inputHtml.find('input')[0].placeholder ;
			      },
			      destroy : function(){
			      				this.node.html('') ;
			      },
			      setParams : function( params , panel ){
					      		var chintInput = panel.find('.chintInput') ;
								chintInput.each(function(index , data){
										params[data.name] = data.value ;
								}) ;
								return params ;
			      } ,
			      fn: function() {
			          			console.log(this.data,'...',this.options);
			      }
		  }
		  
		  namespace.inputPlugin = new inputPlugin() ;
	
})(window.chintPlugins)