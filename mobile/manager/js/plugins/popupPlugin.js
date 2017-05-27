(function(namespace){
	
		  function popupPlugin() { } 
		  popupPlugin.prototype = {
		  		 /***
		  		  *		options.style：true，从chintBodyMain中点击内容显示panel；false，从table中点击内容显示panel
		  		  */
			      init: function(node,data,options,readonly) {
			      	  this.node = node ;
			          this.data = data;
			          this.options = options||{};
			          return this ;
			      },
			      load : function(){
			      
			      },
			      render : function(){
			      		var self = this ;
			      		var popup = $( '<div data-role="popup" data-overlay-theme="b" data-theme="b" data-dismissible="false" style="max-width:400px;">' +
						  					'<div data-role="header" data-theme="a">' +
						  								'<h1>'+self.options.h1+'</h1>' +
						  					'</div>' +
						  					'<div role="main" class="ui-content">' +
						  								'<h3 class="ui-title">'+self.options.h3+'</h3>' +
						  								'<a href="#" class="ui-btn ui-corner-all ui-shadow ui-btn-inline ui-btn-b" data-rel="back" data-transition="flow">'+self.options.a0+'</a>' +
						 								'<a href="#" class="ui-btn ui-corner-all ui-shadow ui-btn-inline ui-btn-b" data-rel="back">'+self.options.a1+'</a>' +
						  					'</div>' +
						  			'</div>' ) ;
			      		
						return popup ;
			      },
			      getValue : function(){
			      		var self = this ;
			      },
			      destroy : function(){
			      		this.node.html('') ;
			      }
		  }
		  
		  namespace.popupPlugin = new popupPlugin() ;
	
})(window.ChintPlugins)