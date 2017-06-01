define(function (){
　　　　var list = function (){
						//营业厅数据列表
						var collapsibleDataHandle = function(){
								//营业厅数据
								$.customAjax(''+config.basePath+config.sysTbldepartDataList , {showEmptyNode:0,keyId:''} , function(flag , data){
										var filterLobby = $("#filterLobbyDataList").empty() ;
										var filterPlugin = chintPlugins.collapsiblePlugin.init(null , data , {title:'营业厅' ,  id:'allLobbyFilter' , height : '200px' }).legendRender( ) ;
										filterLobby.append(filterPlugin) ;
										filterPanel.trigger("create") ;
										
										var modifyLobby = $("#modifyLobbyDataList").empty() ;
										var modifyPlugin = chintPlugins.radioPlugin.init(null , data , {title:'上级营业厅' ,  id:'allLobbyFilter-modify' , height : '200px' }).radioIconsRender( ) ;
										modifyLobby.append(modifyPlugin) ;
										modifyPanel.trigger("create") ;
								}) ;
						}
						
						//初始化chintBodyMain中内容
						var init = function(){
							  $.emptyInnerPanel() ;
							   var chintMainInnerHtml   =  ''  ;
							   chintMainInnerHtml += '<h2>营业厅管理</h2>'  ;
							   chintMainInnerHtml += '<div">'  ;
							   chintMainInnerHtml += 		'<a id="addElement" href="#" data-ajax="false" class="addElement">添加</a>' ;
							   chintMainInnerHtml += 		'<a id="filterConditionElement" href="#" data-ajax="false" class="filterConditionElement">过滤查询</a>' ;
							   chintMainInnerHtml += '</div>'  ;
						 	   chintMainInnerHtml += '<table data-role="table" data-column-btn-theme="b" data-column-popup-theme="a" data-mode="" class="table-stroke">' ;
							   chintMainInnerHtml += 		'<thead><tr class="th-groups"><th style="width:4.15em">营业厅</th><th style="width:4.15em">上级营业厅</th>' ;
							   chintMainInnerHtml += 		'<th style="width:4.15em">联系人</th><th style="width:3.15em">固定电话</th> ' ;
							   chintMainInnerHtml += 		'</tr></thead>' ;
							   chintMainInnerHtml +=		 '<tbody></tbody>' ;
							   chintMainInnerHtml += '</table>' ;
							   chintMainInnerHtml += '<span style="float:right;"></span>'  ;
							   chintBodyMain.append(chintMainInnerHtml).trigger("create") ;
							   tableDataHandle({rows:1000}) ;  //设置初始查询为1000条数据，并将数据存入到sessionStorage中
							   renderFilterPanel() ;  //查询panel
							   renderModifyPanel() ;		//修改panel
							   collapsibleDataHandle() ;
						}
						
						//table数据处理
						var tableDataHandle = function(params){
								//添加table数据
								$.customAjax(''+config.basePath+config.sysTblDepartDataList , params , function(flag , data){
										if('success' === flag){
											//渲染分页，table数据使用callback回调函数渲染
											chintPlugins.pageBreakPlugin.init(chintBodyMain.find('span'),data,{pageCount:4}).render(renderTblDepartTable) ;
										}
								}) ;
						}
						
						//渲染菜单管理table
						var renderTblDepartTable = function(data){
								var fragment = document.createDocumentFragment();
								var optionTable = $(chintBodyMain).find('table tbody') ;
								optionTable.empty() ;//先清空table中的内容再渲染table
								data.rows.forEach(function(data,index){
										var parentname = data.parentname ;
										parentname = parentname ? parentname : "无" ;
										data.id = data.departmentid ;
										var tr = $("<tr><td style='border:0 ;'>"+data.departmentname+"</td><td style='border:0 ;'>"+parentname+"</td><td style='border:0 ;'>"+
															data.contactor +"</td><td style='border:0 ;'>"+data.telno+"</td></tr>"+
														"<tr><td  style='font-weight:bold;border:0;'>移动电话</td><td style='border:0;'>"+data.mobileno+"</td>"+
														"<td  style='font-weight:bold;border:0;'>地址</td><td colspan='3' style='border:0;'>"+data.address+"</td></tr>"+
														"<tr><td  style='font-weight:bold;border:0;'>电子邮箱</td><td colspan='3' style='border:0;'>"+data.email+"</td></tr>"+
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
												var url = config.basePath+config.sysTblDepartDelete ;
												$.deleteSelectedData(this , url , tableDataHandle ) ;
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
								fragment.appendChild(label[0]) ;
								var dataArray = [{label:'营业厅名',name:'departmentname'} , {label:'联系人',name:'contactor'} , 
																 {label:'地址',name:'address'}] ;
								dataArray.forEach(function(data , index){
											fragment.appendChild( inputPlugin.init( null , {} , {labelName : data.label , id : data.name , name : data.name} ).render() ) ;
								}) ;
								var lobbyList = $("<div id='filterLobbyDataList' style='margin: .3em 0 ;'></div>") ;
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
									params.departmentid = chintPlugins.collapsiblePlugin.getValueFromEle(filterInner.find('#filterLobbyDataList .ui-checkbox-on')) ;
									tableDataHandle(params) ;
									filterPanel.panel().panel("close") ;
						}
						
						//添加 修改panel内容
						var renderModifyPanel = function(){
									chintBodyMain.find('#addElement').on('click',function(){
													modifyInner.find('label')[0].textContent = '添加' ;
													modifyInner.find(".hintLabel").hide() ;
													modifyInner.find(".chintInput").val("") ;
													chintPlugins.radioPlugin.reRenderRadioIcons( modifyInner.find("#modifyLobbyDataList") , "") ;
													modifyInner.find("button").attr("departmentid" , "") ;
													modifyPanel.panel().panel("open");
									}) ;
									var inputPlugin = chintPlugins.inputPlugin ;
									var radioPlugin = chintPlugins.radioPlugin ;
									var fragment = document.createDocumentFragment() ;
									fragment.appendChild($("<label>")[0]) ;
									var dataArray = [{label:'营业厅名',name:'departmentname'} , {label:'地址',name:'address'} , {label:'联系人',name:'contactor'} , {label:'固定电话',name:'telno'},
																{label:'移动电话',name:'mobileno'} , {label:'电子邮箱',name:'email'} , {label:'经度',name:'longitude'} , {label:'纬度',name:'latitude'}] ;
									dataArray.forEach(function(data , index){
												fragment.appendChild( inputPlugin.init( null , {} , {labelName : data.label , id : data.name , name : data.name , type : data.type } ).render() ) ;
									}) ;
									fragment.appendChild( $("<div id='modifyLobbyDataList'  style='margin: .3em 0 ;' />")[0] ) ;
									var serchInput = $("<input class='retrieveInput chintInput' placeholder='检索地名' />") ;
									fragment.appendChild( serchInput[0] ) ;
									var retrieve = $("<button style='width:33%;height:2.4em;left:4%;margin-top:0.8em;'>检索</button>") ;
									retrieve.on( 'click' , $.retrieveArea) ;//区域检索
									fragment.appendChild( retrieve[0] ) ;
									var mapContainer = $("<div id='modifyLobbyMap'  style='margin: .3em 0 ;' />") ;
									$.getBMap( mapContainer , '250' ) ;	//设置地图div
									$.pollingToGetMap( $.clickMapToAddMark ) ;
									fragment.appendChild( mapContainer[0] ) ;
									var hintLabel = $("<label style='color:red;' class='hintLabel'></label>") ;
									fragment.appendChild(hintLabel[0]) ;
									var button = $("<button>确认</button>") ;
									button.on("click" , modifyPanelOpration) ;
									fragment.appendChild(button[0]) ;
									modifyInner.append(fragment).trigger("create") ;
									var serchInputDiv =serchInput.parent()[0] ; 
									serchInputDiv.style.cssFloat = 'left' ;
									serchInputDiv.style.width = '63%' ;
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
											$.hintLabel(label , "请输入营业厅名") ;
											return ;
									}
									
									var button = modifyInner.find("button") ;
									var departmentid = button.attr("departmentid") ;
									params.departmentid = departmentid ? departmentid : "" ;
									$.customAjax(''+config.basePath+config.sysTblDepartSave , params , function(flag , data){
												var lable = modifyInner.find(".ui-panel-inner .hintLabel") ;
												$.hintLabel(label , data.msg , "green") ;
												setTimeout( tableDataHandle( {rows:1000} ) , 500 ) ;
												setTimeout(function(){ modifyPanel.panel().panel("close") } , 500) ;
									}) ;
						}
						
						//修改操作
						var modifyEvent = function(self){
									var radioPlugin = chintPlugins.radioPlugin ;
									var userData = JSON.parse(self.parentNode.parentNode.attributes.userData.value) ;
									modifyPanel.find("label")[0].textContent = "修改" ;
									var inputs = modifyPanel.find('.chintInput') ;
									inputs.each(function(data,index){
											this.value = userData.data[this.name] ;
									}) ;
									modifyInner.find(".retrieveInput").val("") ;
									var button = modifyInner.find("button") ;
									button.attr("departmentid" , userData.data.departmentid) ;
									modifyInner.find(".hintLabel").hide() ;
									modifyPanel.panel().panel("open");
						}
						
						init() ;
　　　　};
　　　　return {
　　　　　　	init: list
　　　　};
});