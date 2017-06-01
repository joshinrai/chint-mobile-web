(function(namespace){
	
		  function textareaPlugin() { } 
		  textareaPlugin.prototype = {
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
			      		self.labelHtml = $("<div style='text-align:left;'><label>"+self.options.labelName+"：</label></div>") ;
			      		self.textArea = $("<textarea "+(self.readonly?"readonly='readonly'":"")+" style='height:3.3em;'  placeholder='请输入参数值' id='"+self.options.id+"' name='"+self.options.name+"'></textarea>") ;
			      		fragment.appendChild(self.labelHtml[0]) ;
			      		fragment.appendChild(self.textArea[0]) ;
						if(self.node) self.node.append(fragment) ;
						return fragment ;
			      },
			      getValue : function(){
			      		var self = this ;
			      		var textarea = self.inputHtml.find('textarea') ;
			      		return textarea.val()||inputHtml.find('textarea')[0].placeholder ;
			      },
			      destroy : function(){
			      		this.node.html('') ;
			      }
		  }
		  
		  namespace.textareaPlugin = new textareaPlugin() ;
	
})(window.chintPlugins)