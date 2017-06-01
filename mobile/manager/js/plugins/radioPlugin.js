(function(namespace){
		  
		  /***
		   *		单选框组件
		   */
		  function radioPlugin() { } 
		  radioPlugin.prototype = {
			      init: function(node,data,options) {
			      	  this.node = node ;
			          this.data = data;
			          this.options = options||{};
			          return this ;
			      },
			      load : function(){
			      
			      },
			      /***
			       * 		单行两列单选
			       */
			      doubleRender : function(){
			      		var self = this ;
			      		var fragment = document.createDocumentFragment() ;
			      		var checkBoxRadio = $("<form>"+
																	    "<fieldset data-role='controlgroup' data-type='horizontal'>"+
																		        "<legend style='text-align:left ; margin-left : -1em;'>"+self.options.title+":</legend>"+
																		       "<input name='radio-choice-"+self.options.id+"' id='radio-choice-"+self.data[0].value+"-"+self.options.id+"' value='on' checked='checked' type='radio'>"+
																		        "<label style='width:6.7em;' for='radio-choice-"+self.data[0].value+"-"+self.options.id+"' value='"+self.data[0].value+"' name='"+self.options.id+"'>"+self.data[0].radioName+"</label>"+
																		        "<input name='radio-choice-"+self.options.id+"' id='radio-choice-"+self.data[1].value+"-"+self.options.id+"' value='off' type='radio'>"+
																		        "<label style='width:6.7em;' for='radio-choice-"+self.data[1].value+"-"+self.options.id+"' value='"+self.data[1].value+"' name='"+self.options.id+"'>"+self.data[1].radioName+"</label>"+
																	    "</fieldset>"+
																"</form>") ;
						return checkBoxRadio ;
			      },
			      /***
			       *		下拉单选 
			       */
			      radioIconsRender : function(){
			       		var self = this ;
			       		var fragment = document.createDocumentFragment() ;
			       		var height = self.options.height ;
			       		height = height ? height : "9em" ;
			       		var radioIcons = $("<div data-role='collapsible' style='margin: .3em 0 ;'>"+
			       											"<h4>"+self.options.title+"<a style='padding-left:2em;color:initial;'></a></h4>"+
				       										   "<form style='border: 1px solid initial;height:"+height+";max-height:12em ;overflow: auto;margin:-.5em -1em;'>"+
																    "<fieldset data-role='controlgroup' data-iconpos='left' style='margin:0em;width:100%;'>"+
																    "</fieldset>"+
																"</form>"+
														"</div>") ;
						self.data.forEach(function(data ,index){
									self.renderChildren(data , "-"+index , fragment , 1.2) ;
						}) ;
						radioIcons.find('fieldset').append(fragment).trigger("create").listview() ;
						return radioIcons ;
			       },
			     /***
			      *		下拉单选内容
			      */
			     renderChildren : function(data , index  , fragment , padding){
			      				var self = this ;
			      				var fields = $("<input name='radio-choice-"+self.options.id+index+"' id='radio-choice-"+self.options.id+index+"' value='other' type='radio' dataId='"+data.id+"'>"+
															"<label for='radio-choice-"+self.options.id+index+"' style='padding-left:"+2*padding+"em'>"+data.text+"</label>") ;
								self.toggleRadio(fields) ; 	//子节点点击处理
								fragment.appendChild(fields[0]) ;
								fragment.appendChild(fields[1])  ;
								if(data.children){
											padding++ ;
											data.children.forEach(function(data , innerIndex){
														 self.renderChildren(data , index+"-"+innerIndex , fragment , padding );
											}) ;
								}
								return fragment ;
			      },
			     /***
			      *		下拉单选子节点处理逻辑
			      */
			     toggleRadio : function(fields){
			      			fields.on("click",function(){
			      						var controlGroup = $(this).parent().parent() ;
			      						var labels = controlGroup.find("label") ;
			      						var inputs = controlGroup.find("input") ;
			      						labels.removeClass("ui-radio-on").addClass("ui-radio-off") ;
			      						inputs.removeClass("radioChecked") ;
			      						var bool = ("LABEL" == this.tagName) ;
			      						var thisInput = bool ? $(this).next() : $(this) ;
			      						var thisLabel = bool ? $(this) : $(this).prev() ;
	      								thisInput.addClass("radioChecked") ;
	      								var collapsible = $(this).closest("form").parent().parent() ;
	      								collapsible.find("h4 a a")[0].textContent = thisLabel[0] ? "("+ thisLabel[0].textContent + ")" : "" ;
	      								chintPlugins.radioPlugin.toggleCollapsible(collapsible) ;
			      			}) ;
			      },
			      /***
			      	*		下拉单选内容处理逻辑
			      	*/
			      toggleCollapsible : function(element){
					      			var head = $( $(element).find(".ui-collapsible-heading")[0] ) ; 
									var a = $(head.find("a")[0]) ;
									var body = $( $(element).find(".ui-body-inherit")[0] ) ;
									var isCollapsed = !$(this).hasClass("ui-collapsible-collapsed") ;
									$(element).toggleClass("ui-collapsible-collapsed", isCollapsed ) ;
									head.toggleClass("ui-collapsible-heading-collapsed", isCollapsed ) ;
									a.toggleClass("ui-icon-minus" , !isCollapsed).toggleClass("ui-icon-plus" , isCollapsed) ;
									body.toggleClass("ui-collapsible-content-collapsed", isCollapsed ).attr( "aria-hidden", isCollapsed ).trigger( "updatelayout" ) ;
			      },
			      //绘制单行单选框列表
			      renderDoubleRadio : function( data , fragment ){
			      					var radioPlugin = chintPlugins.radioPlugin ;
			      					data.forEach(function(data , index){
												fragment.appendChild(radioPlugin.init( null , data.data  , data.options ).doubleRender()[0])  ;
									}) ;
			      },
			      //绘制下拉单选框列表
			      renderCollasibleRadio : function( data , fragment ){
			      					var radioPlugin = chintPlugins.radioPlugin ;
			      					data.forEach(function(data , index){
												fragment.appendChild(radioPlugin.init( null , data.data  , data.options ).radioIconsRender()[0])  ;
									}) ;
			      },
			      /***
			      	*		单行双列单选反显
			      	*		element ：两个input标签,data：用户数据，name：标签名
			      	*/
			      doubleRadioreRender : function(element , data , name){
			      			element.each(function(index , ele){
										var prevEle = $(ele).prev() ;
										if(data[name] == prevEle[0].attributes.value.value){
												prevEle.removeClass("ui-radio-off").addClass("ui-radio-on ui-btn-active") ;
										}else{
												prevEle.removeClass("ui-radio-on ui-btn-active").addClass("ui-radio-off") ;
										}
								}) ;
			      },
			      /***
			       *		下拉单选反显
			       *		ele：下拉单选的div容器,dataId：数据id
			       */
			      reRenderRadioIcons : function(ele , dataId){
			      			var curEle = ele.find("[dataId='"+dataId+"']") ;
			      			var labels = ele.find("label") ;
			      			var inputs = ele.find("input") ;
			      			labels.removeClass("ui-radio-on").addClass("ui-radio-off") ;
      						inputs.removeClass("radioChecked") ;
      						$(curEle).prev().removeClass("ui-radio-off").addClass("ui-radio-on") ;
      						$(curEle).addClass("radioChecked") ;
      						var radioOn = ele.find(".ui-radio-on")[0] ;
      						ele.find("h4 a a").each(function( index , data ){
      									data.textContent = radioOn  ?  "("+radioOn.textContent + ")" : "" ;
      						}) ;
			      },
			      getValueFromEle : function(ele){
			      			return ele.attributes.dataId.value ;
			      },
			      //获取单选框参数
			      setParams : function( params , panel){
			      			var radioParams = panel.find(".ui-btn-active") ;
							radioParams.each(function(index , data){
									params[data.attributes.name.value] = data.attributes.value.value ;
							}) ;
							var radioChecked = panel.find('.radioChecked') ;
							radioChecked.each(function( index , data ){
										var name = data.name.toString() ;
										name = name.substr( 0 , name.lastIndexOf("-")).replace("radio-choice-" , "") ;
										if(-1 != name.indexOf("-")  ) name = name.substr( 0 , name.indexOf("-") ) ;
										params[name] = $(data).attr("dataId") ;
							}) ;
							return params ;
			      },
			      getValue : function(){
			      		var self = this ;
			      },
			      destroy : function(){
			      		this.node.html('') ;
			      }
		  }
		  
		  namespace.radioPlugin = new radioPlugin() ;
	
})(window.chintPlugins)