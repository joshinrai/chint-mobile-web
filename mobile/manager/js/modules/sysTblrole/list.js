define(function (){
　　　　var list = function (){
						
						//功能权限数据列表
						var collapsibleDataHandle = function(){
								$.customAjax(''+config.basePath+config.getMenuTreeNoEmptys , {} , function(flag , data){
											var modifyMenuTree = $("#modifyMenuTree").empty() ;
											var modifyPlugin = chintPlugins.collapsiblePlugin.init(null , data , {title:'功能权限' ,  id:'menuTree' , height : '200px' }).legendRender( ) ;
											modifyMenuTree.append(modifyPlugin) ;
											modifyPanel.trigger("create") ;
								}) ;
						}
						
						//table数据处理
						var tableDataHandle = function(params){
								//添加table数据
								$.customAjax(''+config.basePath+config.sysTblroleDataList , params , function(flag , data){
										if('success' === flag){
											//渲染分页，table数据使用callback回调函数渲染
											chintPlugins.pageBreakPlugin.init(chintBodyMain.find('span'),data,{pageCount:5}).render(renderTblRoleTable) ;
										}
								}) ;
						}
						
						//渲染菜单管理table
						var renderTblRoleTable = function(data){
								var fragment = document.createDocumentFragment();
								var optionTable = $(chintBodyMain).find('table tbody') ;
								optionTable.empty() ;//先清空table中的内容再渲染table
								data.rows.forEach(function(data,index){
										var tr= $("<tr><td  style='border:0;'>"+data.roleid+"</td><td  style='border:0;'>"+data.rolename+"</td><td  style='border:0;'>"+
														data.description+"</td></tr>"+
														"<tr userData="+JSON.stringify({data:data,index:index})+">"+
																"<td/><td><a style='font-weight:300;float:right;'>修改</a></td>"+
																"<td><a href='#modifyPopup' data-rel='popup' data-position-to='window' data-transition='pop' style='font-weight:300;text-decoration:none;float:right;'>删除</a></td>"+
														"</tr>") ;
										tr.each(function(index){
											fragment.appendChild(this) ;
											chintPlugins.tablePlugin.trColorSetting(this,index,{total:1,tds:[1]}) ;//行点击效果
										}) ;
										aTds = tr.find('a') ;
										//修改
										$(aTds[0]).on('touchstart',function(){
												modifyEvent(this) ;
										}) ;
										//删除
										$(aTds[1]).on('touchstart',function(){
												var url = config.basePath+config.sysTblroleDataDelete ;
												$.deleteSelectedData(this , url , tableDataHandle ) ;
										}) ;
								}) ;
								optionTable.append(fragment).trigger("create") ;
						}
						
						//添加过滤查询panel内容
						var renderFilterPanel = function(){
								var inputPlugin = chintPlugins.inputPlugin ;
								//显示过滤查询panel
								$(chintBodyMain).find('#filterConditionElement').on('touchstart',function(){
										filterPanel.find(".chintInput").val("") ;
										filterPanel.panel().panel("open");
								}) ;
								var fragment = document.createDocumentFragment();
								var label = $("<label>过滤查询</label>") ;
								fragment.appendChild(label[0]) ;
								var dataArray = [{label:'角色ID',name:'roleid'} , {label:'角色名称',name:'rolename'} , {label:'描述',name:'description'}] ;
								dataArray.forEach(function(data , index){
											fragment.appendChild( inputPlugin.init( null , {} , {labelName : data.label , id : data.name , name : data.name} ).render() ) ;
								}) ;
								var button = $("<button>确认</button>") ;
								button.on("touchstart" , function(){
											$.queryContext( filterInner , filterPanel , tableDataHandle ) ;
								}) ;
								fragment.appendChild(button[0]) ;
								filterInner.append(fragment).trigger("create") ;
						}
						
						//添加 修改panel内容
						var renderModifyPanel = function(){
									var inputPlugin = chintPlugins.inputPlugin ;
									var radioPlugin = chintPlugins.radioPlugin ;
									var fragment = document.createDocumentFragment() ;
									fragment.appendChild($("<label>")[0]) ;
									var dataArray = [{label:'角色ID',name:'roleid'} , {label:'角色名称',name:'rolename'} , 
																 {label:'角色说明',name:'description'}] ;
									dataArray.forEach(function(data , index){
												fragment.appendChild( inputPlugin.init( null , {} , {labelName : data.label , id : data.name , name : data.name} ).render() ) ;
									}) ;
									var menuTreeList = $("<div id='modifyMenuTree' style='margin: .3em 0 ;'></div>") ;
									fragment.appendChild(menuTreeList[0]) ;
									var hintLabel = $("<label style='color:red;' class='hintLabel'></label>") ;
									fragment.appendChild(hintLabel[0]) ;
									var button = $("<button>确认</button>") ;
									button.on("touchstart" , modifyPanelOpration) ;
									fragment.appendChild(button[0]) ;
									modifyInner.append(fragment).trigger("create") ;								
									
									chintBodyMain.find('#addElement').on('touchstart',function(){
												modifyInner.find('label')[0].textContent = '添加' ;
												modifyInner.find(".hintLabel").hide() ;
												modifyInner.find(".chintInput").val("") ;
												$(modifyPanel.find('input')[0]).attr("readOnly" , false) ;
												//chintPlugins.collapsiblePlugin.legendreRender( modifyInner.find("#modifyMenuTree") , "" ) ; 重置下拉多选框中的数据
												modifyInner.find("button").attr("dataId" , "") ;
												modifyPanel.panel().panel("open");
									}) ;
						}
						
						//修改操作
						var modifyEvent = function(self){
									var userData = JSON.parse(self.parentNode.parentNode.attributes.userData.value) ;
									modifyPanel.find("label")[0].textContent = "修改" ;
									var inputs = modifyPanel.find('.chintInput') ;
									inputs.each(function(index , data ){
											if( 0 == index ) $(this).attr("readOnly" , true) ;
											this.value = userData.data[this.name] ;
									}) ;
									modifyInner.find("button").attr("dataId" , userData.data.id) ;
									modifyInner.find(".hintLabel").hide() ;
									modifyPanel.panel().panel("open");
						}
						
						//添加 修改button点击操作
						var modifyPanelOpration = function(){
									var collapsiblePlugin = chintPlugins.collapsiblePlugin ;
									var params = {} ;
									var label = modifyPanel.find(".hintLabel") ;
									var inputs = modifyPanel.find(".chintInput") ;
									inputs.each(function(index , data){
											params[data.name] = data.value ; 
									}) ;
									if("" == inputs[0].value){
											$.hintLabel(label , "角色ID未填写") ;
											return ;
									}
									params.menuIds = collapsiblePlugin.getValueFromEle( modifyPanel.find("#modifyMenuTree .ui-checkbox-on") ) ;
									params.id = modifyInner.find("button").attr("dataId") ;
									$.customAjax(''+config.basePath+config.sysTblroleDataModify , params , function(flag , data){
												var hintLabel = modifyPanel.find(".hintLabel") ;
												hintLabel[0].textContent = data.msg  ;
												hintLabel[0].style.color = "green"  ;
												hintLabel.show() ;
												setTimeout( tableDataHandle( {rows:1000} ) , 500 ) ;
												setTimeout( function(){modifyPanel.panel().panel("close")} , 500) ;
									}) ;
						}
						
						//初始化chintBodyMain中内容
						!(function(){
							$.emptyInnerPanel() ;
							var chintMainInnerHtml   =  ''  ;
								  chintMainInnerHtml += '<h2>角色管理</h2>'  ;
								  chintMainInnerHtml += 		'<a id="addElement" href="#" data-ajax="false" class="addElement">添加</a>' ;
								  chintMainInnerHtml += 		'<a id="filterConditionElement" href="#" data-ajax="false" style="float:right;margin-top:-3em;">过滤查询</a>' ;
								  chintMainInnerHtml += '<table data-role="table" data-column-btn-theme="b" data-column-popup-theme="a" data-mode="" class="table-stroke">' ;
								  chintMainInnerHtml += 		'<thead><tr class="th-groups"><th style="width:5.5em;">角色ID</th><th style="width:5.5em;">角色名称</th>' ;
								  chintMainInnerHtml += 		'<th style="width:4.5em;">角色说明</th></tr></thead>' ;
								  chintMainInnerHtml +=		 '<tbody></tbody>' ;
								  chintMainInnerHtml += '</table>' ;
								  chintMainInnerHtml += '<span style="float:right;"></span>'  ;
							chintBodyMain.append(chintMainInnerHtml).trigger("create") ;
							tableDataHandle({rows:1000}) ;  //设置初始查询为1000条数据，并将数据存入到sessionStorage中
							renderFilterPanel() ;		//查询panel
							renderModifyPanel() ;		//修改panel
							collapsibleDataHandle() ;  //功能权限
						})() ;
　　　　};
　　　　return {
　　　　　　init : list
　　　　};
});