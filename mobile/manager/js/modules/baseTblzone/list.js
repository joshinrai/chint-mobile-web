define(function (){
　　　　var list = function (){
						//区域名称数据列表
						var collapsibleDataHandle = function(){
								//区域名称数据
								$.customAjax(''+config.basePath+config.baseTblZoneTree , {showEmptyNode:0,keyId:''} , function(flag , data){
										var filterLobby = $("#filterZoneTreeDataList").empty() ;
										var filterPlugin = chintPlugins.collapsiblePlugin.init(null , data , {title:'区域名称' ,  id:'allZoneTreeFilter' , height : '200px' }).legendRender( ) ;
										filterLobby.append(filterPlugin) ;
										filterPanel.trigger("create") ;
										
										var modifyZoon = $("#modifyZoonDataList").empty() ;
										var modifyPlugin = chintPlugins.radioPlugin.init(null , data , {title:'上级区域' ,  id:'allZoneTreeModify' , height : '200px' }).radioIconsRender( ) ;
										modifyZoon.append(modifyPlugin) ;
										modifyPanel.trigger("create") ;
								}) ;
								
								//获取区域代码信息
								$.customAjax(''+config.basePath+config.getZoneCodeTree , {showEmptyNode:0,keyId:''} , function(flag , data){
										var modifyZoon = $("#modifyUserZoonTree").empty() ;
										var modifyPlugin = chintPlugins.radioPlugin.init(null , data , {title:'区域代码' ,  id:'allUserZoneTreeModify' , height : '200px' }).radioIconsRender( ) ;
										modifyZoon.append(modifyPlugin) ;
										modifyPanel.trigger("create") ;
								}) ;
						}
						
						//初始化chintBodyMain中内容
						var init = function(){
							  $.emptyInnerPanel() ;
							   var chintMainInnerHtml   =  ''  ;
							   chintMainInnerHtml += '<h2>区域管理</h2>'  ;
							   chintMainInnerHtml += '<div">'  ;
							   chintMainInnerHtml += 		'<a id="addElement" href="#" data-ajax="false" class="addElement">添加</a>' ;
							   chintMainInnerHtml += 		'<a id="filterConditionElement" href="#" data-ajax="false" class="filterConditionElement">过滤查询</a>' ;
							   chintMainInnerHtml += '</div>'  ;
						 	   chintMainInnerHtml += '<table data-role="table" data-column-btn-theme="b" data-column-popup-theme="a" data-mode="" class="table-stroke">' ;
							   chintMainInnerHtml += 		'<thead><tr class="th-groups"><th style="width:4.15em">区域名称</th><th style="width:4.15em">上级区域</th>' ;
							   chintMainInnerHtml += 		'<th style="width:4.15em">区域代码</th><th style="width:4.15em">区域面积</th> ' ;
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
								$.customAjax(''+config.basePath+config.baseTblZoneDataList , params , function(flag , data){
										if('success' === flag){
											//渲染分页，table数据使用callback回调函数渲染
											chintPlugins.pageBreakPlugin.init(chintBodyMain.find('span'),data,{pageCount:4}).render(renderTblZoneTable) ;
										}
								}) ;
						}
						
						//渲染菜单管理table
						var renderTblZoneTable = function(data){
								var fragment = document.createDocumentFragment();
								var optionTable = $(chintBodyMain).find('table tbody') ;
								optionTable.empty() ;//先清空table中的内容再渲染table
								data.rows.forEach(function(data,index){
										data.id = data.zoneid ;
										var zonepname = data.zonepname ;
										var zonearea = data.zonearea ;
										var longitude = data.longitude ;
										var latitude = data.latitude ;
										var minlevel = data.minlevel ;
										var maxlevel = data.maxlevel ;
										var peopleamount = data.peopleamount ;
										var zoneindex = data.zoneindex ;
										zonepname = zonepname ? zonepname : "" ;
										zonearea = zonearea ? zonearea : "" ;
										longitude = longitude ? longitude : "" ;
										latitude = latitude ? latitude : "" ;
										minlevel = minlevel ? minlevel : "" ;
										maxlevel = maxlevel ? maxlevel : "" ;
										peopleamount = peopleamount ? peopleamount : "" ;
										zoneindex = zoneindex ? zoneindex : "" ;
										var tr = $("<tr><td style='border:0 ;'>"+data.zonename+"</td><td style='border:0 ;'>"+zonepname+"</td><td style='border:0 ;'>"+
															data.zonecode +"</td><td style='border:0 ;'>"+zonearea+"</td></tr>"+
														"<tr><td  style='font-weight:bold;border:0;'>经度</td><td style='border:0;'>"+longitude+"</td>"+
														"<td  style='font-weight:bold;border:0;'>纬度</td><td colspan='3' style='border:0;'>"+latitude+"</td></tr>"+
														"<tr><td  style='font-weight:bold;border:0;'>地图缩放最小值</td><td style='border:0;'>"+minlevel+"</td>"+
														"<td  style='font-weight:bold;border:0;'>地图缩放最大值</td><td colspan='3' style='border:0;'>"+maxlevel+"</td></tr>"+
														"<tr><td  style='font-weight:bold;border:0;'>区域人数</td><td style='border:0;'>"+peopleamount+"</td>"+
														"<td  style='font-weight:bold;border:0;'>序号</td><td colspan='3' style='border:0;'>"+zoneindex+"</td></tr>"+
														"<tr userData="+JSON.stringify({data:data,index:index})+"><td colspan='2'/><td><a style='font-weight:300;float:right;'>修改</a></td><td>"+
														"<a href='#modifyPopup' data-rel='popup' data-position-to='window' data-transition='pop' style='font-weight:300;text-decoration:none;float:right;'>删除</a>"+
														"</td></tr>") ;
								
										tr.each(function(index){
											fragment.appendChild(this) ;
											chintPlugins.tablePlugin.trColorSetting(this,index,{total:4,tds:[1 , 3]}) ;//行点击效果
										}) ;
										
										aTds = tr.find('a') ;
										//修改
										$(aTds[0]).on('click',function(){
												modifyEvent(this) ;
										}) ;
										//删除
										$(aTds[1]).on('click',function(){
												var url = config.basePath+config.baseTblZoneDelete ;
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
								var dataArray = [{label:'区域名称',name:'zonename'}] ;
								dataArray.forEach(function(data , index){
											fragment.appendChild( inputPlugin.init( null , {} , {labelName : data.label , id : data.name , name : data.name} ).render() ) ;
								}) ;
								var lobbyList = $("<div id='filterZoneTreeDataList' style='margin: .3em 0 ;'></div>") ;
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
									params.parentid = chintPlugins.collapsiblePlugin.getValueFromEle(filterInner.find('#filterZoneTreeDataList .ui-checkbox-on')) ;
									tableDataHandle(params) ;
									filterPanel.panel().panel("close") ;
						}
						
						//添加 修改panel内容
						var renderModifyPanel = function(){
									chintBodyMain.find('#addElement').on('click',function(){
													modifyInner.find('label')[0].textContent = '添加' ;
													modifyInner.find(".hintLabel").hide() ;
													modifyInner.find(".chintInput").val("") ;
													modifyInner.find("button").attr("zoneid" , "") ;
													modifyPanel.panel().panel("open");
									}) ;
									var inputPlugin = chintPlugins.inputPlugin ;
									var radioPlugin = chintPlugins.radioPlugin ;
									var fragment = document.createDocumentFragment() ;
									fragment.appendChild($("<label>")[0]) ;
									var dataArray = [{label:'区域名称',name:'zonename'} , {label:'经度',name:'longitude'}, {label:'纬度',name:'latitude'}, {label:'地图缩放最小值',name:'minlevel'},
																{label:'地图缩放最大值',name:'maxlevel'},{label:'区域面积',name:'zonearea'},{label:'区域人数',name:'peopleamount'},{label:'序号',name:'zoneindex'}] ;
									dataArray.forEach(function(data , index){
												fragment.appendChild( inputPlugin.init( null , {} , {labelName : data.label , id : data.name , name : data.name , type : data.type } ).render() ) ;
									}) ;
									fragment.appendChild( $("<div id='modifyZoonDataList'  style='margin: .3em 0 ;' />")[0] ) ;
									fragment.appendChild( $("<div id='modifyUserZoonTree'  style='margin: .3em 0 ;' />")[0] ) ;
									var serchInput = $("<input class='retrieveInput chintInput' placeholder='检索地名' />") ;
									fragment.appendChild( serchInput[0] ) ;
									var retrieve = $("<button style='width:33%;height:2.4em;left:4%;margin-top:0.8em;'>检索</button>") ;
									retrieve.on( 'click' , $.retrieveArea) ;
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
											$.hintLabel(label , "请输入区域名称") ;
											return ;
									}
									var button = modifyInner.find("button") ;
									var zoneid = button.attr("zoneid") ;
									params.zoneid = zoneid ? zoneid : "" ;
									$.customAjax(''+config.basePath+config.baseTblZoneSave , params , function(flag , data){
												var lable = $(chintBodyMain).parent().find('#modifyPanel .ui-panel-inner .hintLabel') ;
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
									var textarea = modifyPanel.find('textarea') ;
									textarea[0] = userData.data.description ;
									var button = modifyInner.find("button") ;
									button.attr("zoneid" , userData.data.zoneid) ;
									modifyInner.find(".hintLabel").hide() ;
									modifyPanel.panel().panel("open");
						}
						
						init() ;
　　　　};
　　　　return {
　　　　　　init: list
　　　　};
});