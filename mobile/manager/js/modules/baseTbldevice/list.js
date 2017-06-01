define(function (){
　　　　var list = function (){
						//下拉数据列表
						var collapsibleDataHandle = function(){
								//区域名称数据
								$.customAjax(''+config.basePath+config.baseTblZoneTree , {showEmptyNode:0,keyId:''} , function(flag , data){
										var filterZone = $("#filterZoneTreeDataList").empty() ;
										var filterPlugin = chintPlugins.collapsiblePlugin.init(null , data , {title:'区域名称' ,  id:'allZoneTreeFilter' , height : '200px' }).legendRender( ) ;
										filterZone.append(filterPlugin) ;
										filterZone.trigger("create") ;
										
										var modifyZone = $("#modifyZoneTreeDataList").empty() ;
										var modifyPlugin = chintPlugins.radioPlugin.init(null , data , {title:'所属区域' ,  id:'zoneid-Modify' , height : '200px' }).radioIconsRender( ) ;
										modifyZone.append(modifyPlugin) ;
										modifyZone.trigger("create") ;
								}) ;
								
								//设备种类
								$.customAjax(''+config.basePath+config.baseTblDeviceTypeTree , {showEmptyNode:0,keyId:''} , function(flag , data){
										var filterDeviceType = $("#filterDeviceTypeTree").empty() ;
										var filterPlugin = chintPlugins.radioPlugin.init(null , data , {title:'设备种类' ,  id:'devicetypeid' , height : '8.2em' }).radioIconsRender( ) ;
										filterDeviceType.append(filterPlugin) ;
										filterDeviceType.trigger("create") ;
										
										var modifyDeviceType = $("#modifyDeviceTypeTree").empty() ;
										var modifyPlugin = chintPlugins.radioPlugin.init(null , data , {title:'设备种类' ,  id:'devicetypeid-Modify' , height : '8.2em' }).radioIconsRender( ) ;
										modifyDeviceType.append(modifyPlugin) ;
										modifyDeviceType.trigger("create") ;
								}) ;
								
								//集中器数据列表
								$.customAjax(''+config.basePath+config.getConcentratorByZone , {showEmptyNode:0,keyId:''} , function(flag , data){
										var concentratorList = $("#concentratorList").empty() ;
										var modifyPlugin = chintPlugins.radioPlugin.init(null , data , {title:'集中器' ,  id:'concentratorid' , height : '200px' }).radioIconsRender( ) ;
										concentratorList.append(modifyPlugin) ;
										concentratorList.trigger("create") ;
								}) ;
								
								//过滤查询----设备型号
								var filterDeviceModel = $("#filterDeviceModelTree").empty() ;
								var filterPlugin = chintPlugins.radioPlugin.init(null , [{ text:'请先选择设备种类',id:'' }] , {title:'设备型号' ,  id:'devicemodel' , height : '200px' }).radioIconsRender( ) ;
								filterDeviceModel.append(filterPlugin).trigger("create") ;
								
								//添加/修改----设备型号
								var modifyDeviceModelTree = $("#modifyDeviceModelTree").empty() ;
								var modifyPlugin = chintPlugins.radioPlugin.init(null , [{ text:'请先选择设备种类',id:'' }] , {title:'设备型号' ,  id:'devicemodel-Modify' , height : '200px' }).radioIconsRender( ) ;
								modifyDeviceModelTree.append(modifyPlugin).trigger("create") ;
						}
						
						//过滤查询----设备型号
						var getDeviceModelTree = function( typeid ){
								$.customAjax(''+config.basePath+config.baseTblDeviceModelTree , {showEmptyNode : 1 , keyId:'' , typeid : typeid } , function(flag , data){
											var filterDeviceModel = $("#filterDeviceModelTree").empty() ;
											var filterPlugin = chintPlugins.radioPlugin.init(null , data , {title:'设备型号' ,  id:'devicemodel' , height : '200px' }).radioIconsRender( ) ;
											filterDeviceModel.append(filterPlugin) ;
											filterDeviceModel.trigger("create") ;
								}) ;
						}
						
						//添加/修改----设备型号
						var getMdDeviceModelTree = function( typeid ){
								$.customAjax(''+config.basePath+config.baseTblDeviceModelTree , {showEmptyNode : 1 , keyId:'' , typeid : typeid } , function(flag , data){
											var filterDeviceModel = $("#modifyDeviceModelTree").empty() ;
											var filterPlugin = chintPlugins.radioPlugin.init(null , data , {title:'设备型号' ,  id:'devicemodel-Modify' , height : '200px' }).radioIconsRender( ) ;
											filterDeviceModel.append(filterPlugin) ;
											filterDeviceModel.trigger("create") ;
								}) ;
						}
						
						//初始化chintBodyMain中内容
						var init = function(){
							   $.emptyInnerPanel() ;
							   var chintMainInnerHtml   =  ''  ;
							   chintMainInnerHtml += '<h2>表具管理</h2>'  ;
							   chintMainInnerHtml += '<div>'  ;
							   chintMainInnerHtml += 		'<a id="addElement" href="#" data-ajax="false" class="addElement">添加</a>' ;
							   chintMainInnerHtml += 		'<a id="filterConditionElement" href="#" data-ajax="false" class="filterConditionElement">过滤查询</a>' ;
							   chintMainInnerHtml += '</div>'  ;
						 	   chintMainInnerHtml += '<table data-role="table" data-column-btn-theme="b" data-column-popup-theme="a" data-mode="" class="table-stroke">' ;
							   chintMainInnerHtml += 		'<thead><tr class="th-groups"><th  style="min-width: 4.07em;">设备名称</th><th  style="min-width: 4.07em;">所属区域</th>' ;
							   chintMainInnerHtml += 		'<th  style="min-width: 4.07em;">启用状态</th><th/> ' ;
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
								$.customAjax(''+config.basePath+config.baseTblDeviceDataList , params , function(flag , data){
										if('success' === flag){
											//渲染分页，table数据使用callback回调函数渲染
											chintPlugins.pageBreakPlugin.init(chintBodyMain.find('span'),data,{pageCount:4}).render(renderTblDeviceTable) ;
										}
								}) ;
						}
						
						//渲染菜单管理table
						var renderTblDeviceTable = function(data){
								var fragment = document.createDocumentFragment();
								var optionTable = $(chintBodyMain).find('table tbody') ;
								optionTable.empty() ;//先清空table中的内容再渲染table
								data.rows.forEach(function(data,index){
										data.id = data.deviceid ;
										var tr = $("<tr><td style='border:0 ;'>"+data.devicename+"</td><td style='border:0 ;'>"+
															$.parseVoidValue(data.zonename) +"</td><td style='border:0 ;'>"+$.parseDoubleValue(data.state , "启用" , "停用" )+"</td><td  style='border:0 ;'/></tr>"+
														"<tr><td   style='font-weight:bold;border:0;'>设备编号</td><td colspan='3' style='border:0 ;'>"+data.devicecode+"</td></tr>"+
														"<tr><td  style='font-weight:bold;border:0;'>付费模式</td><td style='border:0;'>"+$.parseDoubleValue( data.chargemode , "后付费" , "预付费" )+"</td>"+
														"<td  style='font-weight:bold;border:0;'>计费模式</td><td style='border:0;'>"+$.parseDoubleValue(data.syschargeflag , "系统计费" , "表具计费" )+"</td></tr>"+
														"<tr><td  style='font-weight:bold;border:0;'>设备种类</td><td style='border:0;'>"+data.devicetypename+"</td>"+
														"<td  style='font-weight:bold;border:0;'>设备型号</td><td style='border:0;'>"+data.devicemodelname+"</td></tr>"+
														"<tr><td  style='font-weight:bold;border:0;'>表底数(m³)</td><td style='border:0;'>"+$.parseVoidValue(data.gasamount)+"</td>"+
														"<td  style='font-weight:bold;border:0;'>SIM卡号</td><td style='border:0;'>"+data.simno+"</td></tr>"+
														"<tr><td  style='font-weight:bold;border:0;'>实施安全停气</td><td style='border:0;'>"+$.parseDoubleValue(data.safeshutflag , "是" , "否" )+"</td>"+
														"<td  style='font-weight:bold;border:0;'>透支额度(元)</td><td style='border:0;'>"+$.parseVoidValue(data.creditamount)+"</td></tr>"+
														"<tr><td  style='font-weight:bold;border:0;'>集中器</td><td style='border:0;'>"+$.parseVoidValue(data.concentratorname)+"</td>"+
														"<td  style='font-weight:bold;border:0;'>节点标识</td><td style='border:0;'>"+$.parseVoidValue(data.nid)+"</td></tr>"+
														"<tr><td  style='font-weight:bold;border:0;'>地址</td><td style='border:0;'>"+data.address+"</td>"+
														"<td  style='font-weight:bold;border:0;'>设备描述</td><td style='border:0;'>"+data.devicedesc+"</td></tr>"+
														"<tr><td  style='font-weight:bold;border:0;'>经度</td><td colspan='3' style='border:0;'>"+$.parseVoidValue(data.longitude)+"</td></tr>"+
														"<tr><td  style='font-weight:bold;border:0;'>纬度</td><td colspan='3'  style='border:0;'>"+$.parseVoidValue(data.latitude)+"</td></tr>"+
														"<tr userData="+JSON.stringify({data:data,index:index})+"><td colspan='2'/><td><a style='font-weight:300;float:right;'>修改</a></td><td>"+
														"<a href='#modifyPopup' data-rel='popup' data-position-to='window' data-transition='pop' style='font-weight:300;text-decoration:none;float:right;'>删除</a>"+
														"</td></tr>") ;
								
										tr.each(function(index){
											fragment.appendChild(this) ;
											chintPlugins.tablePlugin.trColorSetting(this,index,{total:10 , tds:[1 , 3]}) ;//行点击效果
										}) ;
										
										aTds = tr.find('a') ;
										//修改
										$(aTds[0]).on('click',function(){
												modifyEvent(this) ;
										}) ;
										//删除
										$(aTds[1]).on('click',function(){
												var url = config.basePath+config.baseTblDeviceDelete ;
												$.deleteSelectedData(this , url , tableDataHandle ) ;
										}) ;
								
								}) ;
								optionTable.append(fragment).trigger("create") ;
						}
						
						//过滤查询panel内容
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
								var dataArray = [{label:'设备编号',name:'devicecode'} , {label:'设备名称',name:'devicename'}] ;
								dataArray.forEach(function(data , index){
											fragment.appendChild( inputPlugin.init( null , {} , {labelName : data.label , id : data.name , name : data.name} ).render() ) ;
								}) ;
								var lobbyList = $("<div id='filterZoneTreeDataList'/>") ;
								fragment.appendChild(lobbyList[0]) ;
								var deviceType = $("<div id='filterDeviceTypeTree'/>") ;
								fragment.appendChild(deviceType[0]) ;
								deviceType.on("change" , function(){ 
										var typeid = chintPlugins.collapsiblePlugin.getValueFromEle( $(this).find('.radioChecked') ) ;
										getDeviceModelTree(typeid) ;
										return false ;
								}) ;
								var deviceModel = $("<div id='filterDeviceModelTree'/>") ;
								fragment.appendChild(deviceModel[0]) ;
								var deviceFilterList = [ {title:"启用状态" , id : "state" , array : [{text : "全部" , id : "" } , {text : "启用" , id : "1" } , {text : "停用" , id : "0" }]} , 
																	  { title : "付费模式" , id : "chargemode" , array :[{text : "全部" , id : "" } ,  {text : "后付费" , id : "1" } , {text : "预付费" , id : "0" }]} , 
																	  { title : "计量模式" , id : "syschargeflag" , array : [{text : "全部" , id : "" } , {text : "系统计费（气量表）" , id : "1" } , {text : "表具计费（金额表）" , id : "0" }]}  ,
																	  { title : "安全停气" , id : "safeshutflag" , array : [{text : "全部" , id : "" } , {text : "是" , id : "1" } , {text : "否" , id : "0" }] } ] ;
								deviceFilterList.forEach(function(data , index){
										var plugin = chintPlugins.radioPlugin.init(null , data.array , {title : data.title ,  id : data.id , height : '8.16em' }).radioIconsRender( ) ;
										fragment.appendChild( plugin[0] ) ;
								}) ;
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
									params.zoneid = chintPlugins.collapsiblePlugin.getValueFromEle(filterInner.find('#filterZoneTreeDataList .ui-checkbox-on')) ;
									var radioChecked = filterInner.find('.radioChecked') ;
									radioChecked.each(function( index , data ){
												var name = data.name.toString() ;
												name = name.substr( 0 , name.lastIndexOf("-")).replace("radio-choice-" , "") ;
												params[name] = chintPlugins.radioPlugin.getValueFromEle(data) ;
									}) ;
									tableDataHandle(params) ;
									filterPanel.panel().panel("close") ;
						}
						
						//添加 修改panel内容
						var renderModifyPanel = function(){
									chintBodyMain.find('#addElement').on('click',function(){
													modifyInner.find('label')[0].textContent = '添加' ;
													modifyInner.find(".hintLabel").hide() ;
													modifyInner.find(".chintInput").val("") ;
													modifyInner.find("button").attr("deviceid" , "") ;
													modifyPanel.panel().panel("open");
									}) ;
									var inputPlugin = chintPlugins.inputPlugin ;
									var radioPlugin = chintPlugins.radioPlugin ;
									var fragment = document.createDocumentFragment() ;
									fragment.appendChild($("<label>")[0]) ;
									var dataArray = [{label:'设备编号',name:'devicecode'} , {label:'设备名称',name:'devicename'} , {label:'设备描述',name:'devicedesc'}, {label:'节点标识(NID)',name:'nid'},
																{label:'表底数(m³)',name:'gasamount'} , {label:'SIM卡号',name:'simno'}, {label:'透支额度(元)',name:'creditamount'}, 
																{label:'最大充值金额(元)',name:'maxamount'} , {label:'最小充值金额(元)',name:'minamount'} , {label:'经度',name:'longitude'},
																 , {label:'纬度',name:'latitude'} , {label:'安装地址',name:'address'}] ;
									dataArray.forEach(function(data , index){
												fragment.appendChild( inputPlugin.init( null , {} , {labelName : data.label , id : data.name , name : data.name , type : data.type } ).render() ) ;
									}) ;
									var deviceFilterList = [ {data : [ { radioName : "启用" , value : "1" } , { radioName : "停用" , value : "0" }] , options : {title:"启用状态" , id : "state"}} , 
																	  {data :[ { radioName : "后付费" , value : "1" } , { radioName : "预付费" , value : "0" }] , options : {title : "付费模式" , id : "chargemode"}} , 
																	  {data : [ { radioName : "是" , value : "1" } , { radioName : "否" , value : "0" }] , options : {title : "安全停气" , id : "safeshutflag"} } ] ;
									deviceFilterList.forEach(function(data , index){
												fragment.appendChild(radioPlugin.init( null , data.data  , data.options ).doubleRender()[0])  ;
									}) ;
									fragment.appendChild( $("<div id='modifyZoneTreeDataList'/>")[0] ) ;
									var deviceType = $("<div id='modifyDeviceTypeTree'/>") ;
									fragment.appendChild( deviceType[0] ) ;
									fragment.appendChild( $("<div id='modifyDeviceModelTree'/>")[0] ) ;
									deviceType.on("change" , function(){ 
											var typeid = chintPlugins.collapsiblePlugin.getValueFromEle( $(this).find('.radioChecked') ) ;
											getMdDeviceModelTree(typeid) ;
											return false ;
									}) ;
									fragment.appendChild( $("<div id='concentratorList'/>")[0] ) ;
									
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
											$.hintLabel(label , "请输入设备编号") ;
											return ;
									}
									if(!chintInput[1].value){
											$.hintLabel(label , "请输入设备名称") ;
											return ;
									}
									var button = modifyInner.find("button") ;
									var deviceid = button.attr("deviceid") ;
									params.deviceid = deviceid ? deviceid : "" ;
									var radioParams = modifyPanel.find(".ui-btn-active") ;
									radioParams.each(function(index , data){
											params[data.attributes.name.value] = data.attributes.value.value ;
									}) ;
									var radioChecked = modifyInner.find('.radioChecked') ;
									radioChecked.each(function( index , data ){
												var name = data.name.toString() ;
												name = name.substr( 0 , name.lastIndexOf("-")).replace("radio-choice-" , "") ;
												name = name.substr( 0 , name.indexOf("-") ) ;
												params[name] = chintPlugins.radioPlugin.getValueFromEle(data) ;
									}) ;
									$.customAjax(''+config.basePath+config.baseTblDeviceSave , params , function(flag , data){
												var lable = $(chintBodyMain).parent().find('#modifyPanel .ui-panel-inner .hintLabel') ;
												if("success" == flag){
															$.hintLabel(label , data.msg , "green" ) ;
												}else{
															$.hintLabel(label , "数据保存时服务器错误" , "red" ) ;
												}
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
									button.attr("deviceid" , userData.data.deviceid) ;
									modifyInner.find(".hintLabel").hide() ;
									modifyPanel.panel().panel("open");
						}
						
						
						init() ;
　　　　};
　　　　return {
　　　　　　init: list
　　　　};
});