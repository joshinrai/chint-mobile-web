(function(namespace){
		  /***
		   *		下拉组件
		   *		options ： {title：标题 , id : 节点ID , height ： 高度 ， maxHeight ： 最大高度}
		   */
		  function collapsiblePlugin() { } 
		  collapsiblePlugin.prototype = {
			      init : function(node,data,options,readonly) {
			      	  this.node = node ;
			          this.data = data;
			          this.options = options||{};
			          return this ;
			      },
			      load : function(){
			      
			      },
			      /***
			       *		下拉多选组件
			       */
			      legendRender : function(){
			      		var self = this ;
			      		var fragment = document.createDocumentFragment() ;
						var maxHeight = self.options.maxHeight ;
			      		var collapsible = $("<div class='ui-collapsible ui-collapsible-inset ui-corner-all ui-collapsible-themed-content ui-collapsible-collapsed'>"+
															"<h4 role='heading' class='ui-collapsible-heading ui-collapsible-heading-collapsed' style='display:inline-block;width:100%;'>"+
																"<a class='ui-collapsible-heading-toggle ui-btn ui-btn-icon-left ui-btn-inherit ui-icon-plus'>"+self.options.title+"</a>"+
																"<label style='background-color:ghostwhite;'></label>"+
															"</h4>"+
															"<form class='ui-body-inherit ui-collapsible-content-collapsed' aria-hidden='true'>"+
																"<div id='innnerCollapsibleElement' style='border: 1px solid initial;height:"+self.options.height+";max-height:"+(maxHeight?maxHeight:"250px")+" ;overflow: auto;'>"+
																	"<div class='ui-controlgroup-vertical ui-corner-all'>"+
																		"<div class='ui-controlgroup-controls '>"+
																		
																		"</div>"+
																	"</div>"+
																"</div>"+
															"</form>"+
														"</div>") ;
										
						var controlGroup = collapsible.find('.ui-controlgroup-controls') ;
						self.data.forEach(function(data , index){
								self.renderChildren(data , "-"+index , fragment , 2.5) ;
						}) ;
			      		controlGroup.append(fragment) ;
			      		this.toggleCollapsible(collapsible) ;
			      			
						return collapsible.trigger("create")  ;
			      },
			      /****
			       *		渲染子节点
			       */
			       renderChildren : function(data , index  , fragment , padding){
			       		var self = this ;
			       		var groupElement = $("<div style='margin: -.1em 0 ;'>"+
																	"<label for='"+self.options.id+"-checkbox-"+index+"-a' class='ui-btn ui-corner-all ui-btn-inherit ui-btn-icon-left ui-checkbox-off ui-first-child ui-last-child' dataId="+
																		data.id+" style='padding-left:"+padding+"em;'>"+data.text+
																	"</label>"+
																	"<input type='checkbox'   id='"+self.options.id+"-checkbox-"+index+"-a'>"+
																"</div>") ;
						fragment.appendChild(groupElement[0]) ;
						if(data.children){
									padding++ ;
									data.children.forEach(function(data , innerIndex){
												 self.renderChildren(data , index+"-"+innerIndex , fragment , padding );
									}) ;
						}
						return fragment ;
			       },
			      /****
			       *	  下拉列表
			       */
			      iconsRender : function(){
			      				var self = this ;
			      				var fragment = document.createDocumentFragment() ;
			      				var iconsCollapsible = $("<div data-role='collapsible' data-collapsed-icon='carat-d' data-expanded-icon='carat-u'>"+
																			    "<h4>Heading</h4>"+
																			    "<ul data-role='listview' data-inset='false'>"+
																			        "<li>Read-only list item 1</li>"+
																			        "<li>Read-only list item 2</li>"+
																			        "<li>Read-only list item 3</li>"+
																			    "</ul>"+
																			"</div>") ;
								return iconsCollapsible ;
			      },
			      /***
			       *	下拉组件头节点点击事件
			       */
			      toggleCollapsible : function(element){
						element.on('click',function(event){
								var head = $( $(this).find(".ui-collapsible-heading")[0] ) ; 
								var a = $(head.find("a")[0]) ;
								var body = $( $(this).find(".ui-body-inherit")[0] ) ;
								var isCollapsed = !$(this).hasClass("ui-collapsible-collapsed") ;
								$(this).toggleClass("ui-collapsible-collapsed", isCollapsed ) ;
								head.toggleClass("ui-collapsible-heading-collapsed", isCollapsed ) ;
								a.toggleClass("ui-icon-minus" , !isCollapsed).toggleClass("ui-icon-plus" , isCollapsed) ;
								body.toggleClass("ui-collapsible-content-collapsed", isCollapsed ).attr( "aria-hidden", isCollapsed ).trigger( "updatelayout" ) ;
								return false ;
						}) ;
			      },
			      /***
			       *	下拉组件group内容点击事件
			       */
			      toggleGroup : function(element){
		      			element.on('click',function(){
								var label = $( $(this).find("label")[0] ) ;
								var bool = label.hasClass("ui-checkbox-off") ;
								label.toggleClass("ui-checkbox-off" , !bool).toggleClass("ui-checkbox-on" , bool ) ;
								return false ;
						}) ;
						//添加提示
						element.find("input").on("click" , function(){
									var form = $(this).closest("form") ;
									var selfTag = $(form).parent() ;
									var labels = selfTag.find("h4 label") ;
									var hint = labels[0] ;
									var selfContent = $(this).prev()[0].textContent ;
									var modifyAttr = $(this).prev()[0].attributes ;
									if("" != hint.textContent){
												var array = hint.textContent.split(",") ;
												var selfIndex = array.indexOf(selfContent) ; 
												if(-1 == selfIndex ){
															array.push(selfContent) ;
												}else{
															if(modifyAttr.modify){
																		modifyAttr.modify = false ;
																		return ;
															}
															array.splice( selfIndex , 1) ;
												}
												hint.textContent = array.toString() ;
									}else{
												hint.textContent += selfContent  ;
									}
						}) ;
			      },
			      /***
			      	*		获取下拉多选组件中选中的数据
			      	*/
			      getValueFromEle : function(eleArray){
								var array = [] ;
								eleArray.each(function(index , data){
										array.push(data.attributes.dataId.value) ;
								}) ;
								return array.toString() ;
					},
			      /***
			      	*	下拉多选反显
			      	*	ele：下拉多选div容器，data：用户数据
			      	*/
			      legendreRender : function( ele , data ){
			      		var labels = ele.find("label") ;
			      		var inputs = ele.find("input") ;
			      		labels.removeClass("ui-checkbox-on").addClass("ui-checkbox-off") ;
			      		var hintArray = [] ;
			      		data.split(",").forEach(function(data , index){
					      		var curEle = ele.find("[dataId='"+data+"']") ;
					      		curEle.removeClass("ui-checkbox-off").addClass("ui-checkbox-on") ;
					      		if(curEle[0]){
					      					curEle[0].attributes.modify = true
					      					hintArray.push(curEle[0].textContent) ;
					      		} 
			      		}) ;
						var labels = ele.find("h4 label") ;
						labels[0].textContent = hintArray.toString() ;
			      },
			      getValue : function(){
			      		var self = this ;
			      },
			      destroy : function(){
			      		this.node.html('') ;
			      }
		  }
		  
		  namespace.collapsiblePlugin = new collapsiblePlugin() ;
	
})(window.ChintPlugins)