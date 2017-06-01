(function(namespace){
		  function datetimepickerPlugin() { } 
		  datetimepickerPlugin.prototype = {
		  		 /***
		  		  *		日期选择组件
		  		  */
			      init: function(options,readonly) {
			          this.options = options||{};
			          return this ;
			      },
			      load : function(){
			      
			      },
			      render : function(){
			      		var self = this ;
			      		var fragment = document.createDocumentFragment() ;
			      		$.datepicker.initialized = false ;
			      		self.labelHtml = $("<div style='text-align:left;'><label>"+self.options.labelName+":</label></div>") ;
			      		self.pHtml = $("<p><input type='text' name='"+self.options.name+"' readonly></p>") ;
			      		self.pHtml.find("input").datepicker({
			      				
			      		}) ;
			      		fragment.appendChild(self.labelHtml[0]) ;
			      		fragment.appendChild(self.pHtml[0]) ;
						if(self.node)self.node.append(fragment) ;
						return fragment ;
			      },
			      getValue : function(){
			      		var self = this ;
			      },
			      destroy : function(){
			      		this.node.html('') ;
			      }
		  }
		  
		  namespace.datetimepickerPlugin = new datetimepickerPlugin() ;
	
})(window.chintPlugins)