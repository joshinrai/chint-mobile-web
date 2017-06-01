define(function (){
　　　　var mobilelist = function (){
						
						//菜单树数据列表
						var collapsibleDataHandle = function(){
								$.customAjax(''+config.basePath+config.getMenuTreeNoEmptys , {} , function(flag , data){
											var modifyMenuTree = $("#modifyMenuTree").empty() ;
											var modifyPlugin = chintPlugins.radioPlugin.init(null , data , {title:'上级菜单树' ,  id:'menuTree' , height : '200px' }).radioIconsRender( ) ;
											modifyMenuTree.append(modifyPlugin) ;
											modifyPanel.trigger("create") ;
											
											var filterLobby = $("#filterMenuTreeDataList").empty() ;
											var filterPlugin = chintPlugins.collapsiblePlugin.init(null , data , {title:'选择菜单' ,  id:'allMenuTreeFilter' , height : '200px' }).legendRender( ) ;
											filterLobby.append(filterPlugin) ;
											filterPanel.trigger("create") ;
								}) ;
						}
					
						//初始化chintBodyMain中内容
						var init = function(){
							   $.emptyInnerPanel() ;
							   var chintMainInnerHtml   =  ''  ;
							   chintMainInnerHtml += '<h2>手机菜单管理</h2>'  ;
							   chintMainInnerHtml += '<div">'  ;
							   chintMainInnerHtml += 		'<a id="addElement" href="#" data-ajax="false" class="addElement">添加</a>' ;
							   chintMainInnerHtml += 		'<a id="filterConditionElement" href="#" data-ajax="false" class="filterConditionElement">过滤查询</a>' ;
							   chintMainInnerHtml += '</div>'  ;
						 	   chintMainInnerHtml += '<table data-role="table" data-column-btn-theme="b" data-column-popup-theme="a" data-mode="" class="table-stroke">' ;
							   chintMainInnerHtml += 		'<thead><tr class="th-groups"><th style="width:4.15em">菜单名</th><th style="width:4.15em">上级菜单</th>' ;
							   chintMainInnerHtml += 		'<th style="width:4.15em">菜单状态</th><th style="width:3.15em">顺序号</th> ' ;
							   chintMainInnerHtml += 		'</tr></thead>' ;
							   chintMainInnerHtml +=		 '<tbody></tbody>' ;
							   chintMainInnerHtml += '</table>' ;
							   chintMainInnerHtml += '<span style="float:right;"></span>'  ;
							   chintBodyMain.append(chintMainInnerHtml).trigger("create") ;
							   tableDataHandle({rows:1000}) ;  //设置初始查询为1000条数据，并将数据存入到sessionStorage中
							   renderFilterPanel() ;		//查询panel
							   renderModifyPanel() ;		//修改panel
							   collapsibleDataHandle() ;//获取菜单树数据
						}
						
						//table数据处理
						var tableDataHandle = function(params){
								//添加table数据
								$.customAjax(''+config.basePath+config.sysTblMenuDataList , params , function(flag , data){
										if('success' === flag){
											//渲染分页，table数据使用callback回调函数渲染
											chintPlugins.pageBreakPlugin.init(chintBodyMain.find('span'),data,{pageCount:4}).render(renderTblmenuTable) ;
										}
								}) ;
						}
						
						//渲染菜单管理table
						var renderTblmenuTable = function(data){
								var fragment = document.createDocumentFragment();
								var optionTable = $(chintBodyMain).find('table tbody') ;
								optionTable.empty() ;//先清空table中的内容再渲染table
								data.rows.forEach(function(data,index){
										var openflag = data.openflag ;
										var menuStatue = "" ;
										var parentname = data.parentname ;
										parentname = parentname ? parentname : "无" ;
										switch(openflag){
												case 1: 
													menuStatue = "都可使用" ;
													break ;
												case 2: 
													menuStatue = "只应用于电脑端" ;
													break ;
												case 3: 
													menuStatue = "只应用于手机端" ;
													break ;
												default : 
													menuStatue = "禁用" ;
													break ;
										}
										var tr = $("<tr><td style='border:0 ;'>"+data.funname+"</td><td style='border:0 ;'>"+parentname+"</td><td style='border:0 ;'>"+
															menuStatue +"</td><td style='border:0 ;'>"+data.sortno+"</td></tr>"+
														"<tr><td  style='font-weight:bold;border:0;'>URL</td><td colspan='3' style='border:0;'>"+data.responseurl+"</td></tr>"+
														"<tr><td  style='font-weight:bold;border:0;'>描述</td><td colspan='3' style='border:0;'>"+data.description+"</td></tr>"+
														"<tr userData="+JSON.stringify({data:data,index:index})+"><td/><td/><td><a style='font-weight:300 ;'>修改</a></td><td>"+
														"<a href='#modifyPopup' data-rel='popup' data-position-to='window' data-transition='pop' style='font-weight:300;text-decoration:none;'>删除</a>"+
														"</td></tr>") ;
								
										tr.each(function(index){
											fragment.appendChild(this) ;
											chintPlugins.tablePlugin.trColorSetting(this,index,{total:3,tds:[1,3]}) ;//行点击效果
										}) ;
										
										aTds = tr.find('a') ;
										//修改
										$(aTds[0]).on('click',function(){
												modifyEvent(this) ;
										}) ;
										//删除
										$(aTds[1]).on('click',function(){
												deletePopupEvent(this) ;
										}) ;
								
								}) ;
								optionTable.append(fragment).trigger("create") ;
						}
						
						//添加过滤查询panel内容
						var renderFilterPanel = function(){
								var inputPlugin = chintPlugins.inputPlugin ;
								//显示过滤查询panel
								$(chintBodyMain).find('#filterConditionElement').on('click',function(){
										filterPanel.find(".chintInput").val("") ;
										filterPanel.panel().panel("open");
								}) ;
								var fragment = document.createDocumentFragment();
								var label = $("<label>过滤查询</label>") ;
								var menuName = inputPlugin.init( "" , {} , {labelName:'菜单名',id:'funname',name:'funname',style:true}).render() ;
								fragment.appendChild(label[0]) ;
								fragment.appendChild(menuName) ;
								var menuStatue = $("<div id='filterMenuStatue' style='margin: .3em 0 ;'></div>") ;
								var filterPlugin = getMenuStatue("filter") ;
								menuStatue.append(filterPlugin) ;
								fragment.appendChild(menuStatue[0]) ;
								var lobbyList = $("<div id='filterMenuTreeDataList' style='margin: .3em 0 ;'></div>") ;
								fragment.appendChild(lobbyList[0]) ;
								var button = $("<button>查询</button>") ;
								button.on("click" , filterPanelQuery) ;
								fragment.appendChild(button[0]) ;
								filterInner.append(fragment).trigger("create") ;
						}
						
						//查询符合的内容
						var filterPanelQuery = function(){
									var params = {} ;
									params.rows = 1000 ;
									var radioPlugin = chintPlugins.radioPlugin ;
									var chintInput = filterInner.find('.chintInput') ;
									chintInput.each(function(index , data){
											params[data.name] = data.value ;
									}) ;
									var radioChecked = filterInner.find('.radioChecked')[0] ;
									params.openflag = radioChecked ? radioPlugin.getValueFromEle(radioChecked) : "" ;
									params.parentid = chintPlugins.collapsiblePlugin.getValueFromEle(filterInner.find('#filterMenuTreeDataList .ui-checkbox-on')) ;
									tableDataHandle(params) ;
									filterPanel.panel().panel("close") ;
						}
						
						//添加 修改panel内容
						var renderModifyPanel = function(){
									chintBodyMain.find('#addElement').on('click',function(){
													modifyInner.find('label')[0].textContent = '添加' ;
													modifyInner.find(".hintLabel").hide() ;
													modifyInner.find(".chintInput").val("") ;
													modifyInner.find("button").attr("funid" , "") ;
													modifyPanel.panel().panel("open");
									}) ;
									var inputPlugin = chintPlugins.inputPlugin ;
									var radioPlugin = chintPlugins.radioPlugin ;
									var fragment = document.createDocumentFragment() ;
									fragment.appendChild($("<label>")[0]) ;
									var dataArray = [{label:'菜单名',name:'funname'} , {label:'电脑版URL',name:'responseurl'} , 
																 {label:'手机版URL',name:'mobileurl'} , {label:'顺序号',name:'sortno'}] ;
									dataArray.forEach(function(data , index){
												fragment.appendChild( inputPlugin.init( null , {} , {labelName : data.label , id : data.name , name : data.name , type : data.type } ).render() ) ;
									}) ;
									var textArea = chintPlugins.textareaPlugin.init( null , {} , {labelName:'描述',id:'description',name:'optiondescription'} ).render() ;
									fragment.appendChild(textArea) ;
									var menuTreeList = $("<div id='modifyMenuTree' style='margin: .3em 0 ;'></div>") ;
									fragment.appendChild(menuTreeList[0]) ;
									var menuStatue = $("<div id='modifyMenuStatue' style='margin: .3em 0 ;'></div>") ;
									menuStatue.append(getMenuStatue("modify")) ;
									fragment.appendChild(menuStatue[0]) ;
									var hintLabel = $("<label style='color:red;' class='hintLabel'></label>") ;
									fragment.appendChild(hintLabel[0]) ;
									var button = $("<button>确认</button>") ;
									button.on("click" , modifyPanelOpration) ;
									fragment.appendChild(button[0]) ;
									modifyInner.append(fragment).trigger("create") ;
						}
						
						//添加 修改button点击操作
						var modifyPanelOpration = function(){
									var radioPlugin = chintPlugins.radioPlugin ;
									var label = modifyInner.find(".hintLabel") ;
									label.show() ;
									var params = {} ;
									var chintInput = modifyInner.find('.chintInput') ;
									chintInput.each(function(index , data){
											params[data.name] = data.value ;
									}) ;
									if(!chintInput[0].value){
											hintLabel(label , "请输入菜单名") ;
											return ;
									}
									if(isNaN(chintInput[3].value)){
											hintLabel(label , "序列号请输入纯数字") ;
											return ;
									}
									var textArea = modifyInner.find("textarea") ;
									params.description = textArea[0].value ;
									var menuTree = modifyInner.find('#modifyMenuTree .radioChecked')[0] ;
									params.MenuList = menuTree ? radioPlugin.getValueFromEle(menuTree) : "" ;
									var menuStatue = modifyInner.find('#modifyMenuStatue .radioChecked')[0] ;
									if(!menuStatue){
											hintLabel(label , "请选择菜单状态") ;
											return ;
									}
									params.openflag = menuStatue ? radioPlugin.getValueFromEle(menuStatue) : "" ;
									
									var button = modifyInner.find("button") ;
									var funid = button.attr("funid") ;
									params.funid = funid ? funid : "" ;
									$.customAjax(''+config.basePath+config.sysTblMenuSave , params , function(flag , data){
												var lable = $(chintBodyMain).parent().find('#modifyPanel .ui-panel-inner .hintLabel') ;
												hintLabel(label , data.msg , "green") ;
												setTimeout(function(){ modifyPanel.panel().panel("close") } , 1000) ;
									}) ;
						}
						
						//修改操作
						var modifyEvent = function(self){
									var radioPlugin = chintPlugins.radioPlugin ;
									var userData = JSON.parse(self.parentNode.parentNode.attributes.userData.value) ;
									modifyPanel.find("label")[0].textContent = "修改" ;
									var inputs = modifyPanel.find('input') ;
									inputs.each(function(data,index){
											this.value = userData.data[this.name] ;
									}) ;
									var textarea = modifyInner.find("textarea") ;
									textarea[0].value = userData.data.description ;
									
									radioPlugin.reRenderRadioIcons( modifyInner.find("#modifyMenuTree") , userData.data.parentid ) ;
									radioPlugin.reRenderRadioIcons( modifyInner.find("#modifyMenuStatue") , userData.data.openflag ) ;
									var button = modifyInner.find("button") ;
									button.attr("funid" , userData.data.funid) ;
									modifyInner.find(".hintLabel").hide() ;
									modifyPanel.panel().panel("open");
						}
						
						//删除操作
						var deletePopupEvent = function(self){
									var options = {h1:'删除',h3:'确定要删除本条记录?',a0:'删除',a1:'取消'} ;
									var popup = $(this).renderPopup( $('#modifyPopup') , options ) ;
									var tr = $(self).parent().parent() ;
									var funid  = JSON.parse(tr.attr("userData")).data.funid ;
									var popupA = $(popup.find('a')[0]) ;
									popupA.attr('deleteparam',JSON.stringify({ funid : funid })) ;
									popupA.on('click',function(){
											var param = JSON.parse($(this).attr("deleteparam")) ;
											var funid = [] ;
											funid.push(param.funid) ;
											//删除操作需要检查当前记录是否存在主外键约束...
											$.customAjax(''+config.basePath+config.sysTblMenuDelete , {id : funid.toString() } , function(flag , data){
														console.log("删除信息:" , data.msg) ;
											}) ;
									}) ;
						}
						
						//菜单状态
						var getMenuStatue = function(id){
								var dataId = 'menuStatue-'+id ;
								var menuArray = [{id : 0 , text : "禁用" } , { id : 1 , text : "都可使用" } , { id : 2 , text : "只应用于电脑版" },{ id : 3 , text : "只应用于手机版" }] ;
								var plugin = chintPlugins.radioPlugin.init(null , menuArray , {title:'菜单状态' ,  id : dataId , height : '10.9em' }).radioIconsRender( ) ;
								return plugin ;
						}
						
						//提示标签
						var hintLabel = function(label , msg , color){
									label[0].innerHTML = msg  ;
									label[0].style.color = color||"red" ;
									label.show() ;
						}
						
						init() ;
　　　　};
　　　　return {
　　　　　　init: mobilelist
　　　　};
});