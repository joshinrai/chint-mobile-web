define(function (){
　　　　var list = function (){
						var inputPlugin = chintPlugins.inputPlugin ;
						var radioPlugin = chintPlugins.radioPlugin ;
						//设备型号参数名
						var paramData = {
															  filterPanel : {
															  			collasibleRadios:[{data:[ { text : "全部" , id : "" } , { text : "非远传表" , id : "0" } , { text : "物联网表" , id : "1" } , { text : "无线远传表" , id : "2" }] , options : {title:'通讯模式' ,
																				 id:'commmode' , height : '10.94em' }} , {data : [{ text : "全部" , id : "" } , { text : "是" , id : "1" } , { text : "否" , id : "0" }] , options : {title:'是否IC卡表' ,  
																				 id:'usecard' , height : '8.2em' } }]
															  } , 
															  modifyPanel : {
															  			inputs : [{label:'设备型号',name:'devicemodel'} , {label:'报警值',name:'warnvalue'} , {label:'关阀报警值',name:'warnlvalue'} ,
																				{label:'表内门限值',name:'limitvalue'} , {label:'流量上限值',name:'flowlimitvalue'} , {label:'不用气警告值(天)',name:'alertdays'} ,
																				{label:'不用气强制关阀值(天)',name:'forcedays'} ],
																		doubleRadios : [ {data : [ { radioName : "是" , value : "1" } , { radioName : "否" , value : "0" }] , options : {title:"是否IC卡表" , id : "usecard"}} , 
																	    		{data : [ { radioName : "金额表" , value : "1" } , { radioName : "气量表" , value : "0" }] , options : {title : "计费模式" , id : "runmode"} } ],
																	    collasibleRadios : [{ data : [{ text : "全部" , id : "" } , { text : "非远传表" , id : "0" } , { text : "物联网表" , id : "1" } , { text : "无线远传表" , id : "2" }] , options : 
																				{title:'通讯模式' ,  id:'commmode-modify' , height : '10.94em' }  }]
															   }
													   }
						//下拉数据列表
						var collapsibleDataHandle = function(){
								var radioPlugin = chintPlugins.radioPlugin ;
								//设备种类
								$.customAjax(''+config.basePath+config.baseTblDeviceTypeTree , {showEmptyNode:0,keyId:''} , function(flag , data){
										//代码重构
										var domArray = [ { domId : 'filterDeviceTypeTree' , pluginName : '设备类型' , pluginId : 'devicetypename' , pluginHeight : '8.2em' } , 
																	 { domId : 'modifyDeviceTypeTree' , pluginName : '设备类型' , pluginId : 'devicetypename-modify' , pluginHeight : '8.2em' } ] ;
										
										var filterDeviceType = $("#filterDeviceTypeTree").empty() ;
										var filterPlugin = chintPlugins.radioPlugin.init(null , data , {title:'设备类型' ,  id:'devicetypename' , height : '8.2em' }).radioIconsRender( ) ;
										filterDeviceType.append(filterPlugin) ;
										filterDeviceType.trigger("create") ;
										
										var modifyDeviceType = $("#modifyDeviceTypeTree").empty() ;
										var modifyPlugin = chintPlugins.radioPlugin.init(null , data , {title:'设备类型' ,  id:'devicetypename-modify' , height : '8.2em' }).radioIconsRender( ) ;
										modifyDeviceType.append(modifyPlugin) ;
										modifyDeviceType.trigger("create") ;
								}) ;
								
								//IC卡类型
								var cardtypename = $("#cardtypenameDiv").empty() ;
								var filterPlugin = radioPlugin.init(null , [] , {title:'IC卡类型' ,  id:'cardtypename' , height : '7em' }).radioIconsRender( ) ;
								cardtypename.append(filterPlugin) ;
								cardtypename.trigger("create") ;
								//IC卡类型----修改
								var cardtypename = $("#cardtypenameModify").empty() ;
								var filterPlugin = radioPlugin.init(null , [] , {title:'IC卡类型' ,  id:'cardtypename-Modify' , height : '7em' }).radioIconsRender( ) ;
								cardtypename.append(filterPlugin) ;
								cardtypename.trigger("create") ;
						}
						
						//获取过滤条件IC卡类型
						var getCardtypename = function(){
								$.customAjax(''+config.basePath+config.baseTblDeviceCardType , {showEmptyNode:1,keyId:''} , function(flag , data){
										var cardtypename = $("#cardtypenameDiv").empty() ;
										var filterPlugin = chintPlugins.radioPlugin.init(null , data , {title:'IC卡类型' ,  id:'cardtypename' , height : '7em' }).radioIconsRender( ) ;
										cardtypename.append(filterPlugin) ;
										cardtypename.trigger("create") ;
								}) ;
						}
						
						//table数据处理
						var tableDataHandle = function(params){
								//添加table数据
								$.customAjax(''+config.basePath+config.baseTblDeviceTypeDataList , params , function(flag , data){
										if('success' === flag){
											//渲染分页，table数据使用callback回调函数渲染
											chintPlugins.pageBreakPlugin.init(chintBodyMain.find('span'),data,{pageCount:4}).render(renderTblDeviceTypeTable) ;
										}
								}) ;
						}
						
						//初始化chintBodyMain中内容
						var init = function(){
							   $.emptyInnerPanel() ;
							   var chintMainInnerHtml   =  ''  ;
							   chintMainInnerHtml += '<h2>设备型号管理</h2>'  ;
							   chintMainInnerHtml += '<div>'  ;
							   chintMainInnerHtml += 		'<a id="addElement" href="#" data-ajax="false" class="addElement">添加</a>' ;
							   chintMainInnerHtml += 		'<a id="filterConditionElement" href="#" data-ajax="false" class="filterConditionElement">过滤查询</a>' ;
							   chintMainInnerHtml += '</div>'  ;
						 	   chintMainInnerHtml += '<table data-role="table" data-column-btn-theme="b" data-column-popup-theme="a" data-mode="" class="table-stroke">' ;
							   chintMainInnerHtml += 		 '<thead><tr class="th-groups"><th style="width:4.15em">设备型号</th><th style="width:4.15em">设备类型</th>' ;
							   chintMainInnerHtml += 		 '<th style="width:4.15em">通讯模式</th><th style="width:5.15em">是否IC卡表</th>' ;
							   chintMainInnerHtml += 		 '</tr></thead>' ;
							   chintMainInnerHtml +=		 	 '<tbody></tbody>' ;
							   chintMainInnerHtml += '</table>' ;
							   chintMainInnerHtml += '<span style="float:right;"></span>'  ;
							   chintBodyMain.append(chintMainInnerHtml).trigger("create") ;
							   tableDataHandle({rows:1000}) ;  //设置初始查询为1000条数据，并将数据存入到sessionStorage中
							   renderFilterPanel() ;  //查询panel
							   renderModifyPanel() ;		//修改panel
							   collapsibleDataHandle() ;	//添加下拉框数据
						}
						
						//渲染菜单管理table
						var renderTblDeviceTypeTable = function(data){
								var fragment = document.createDocumentFragment();
								var optionTable = $(chintBodyMain).find('table tbody') ;
								optionTable.empty() ;//先清空table中的内容再渲染table
								data.rows.forEach(function(data,index){
										var commmode = data.commmode ;
										switch(commmode){
												case 0 :
														commmode = "非远传表" ;
														break ;
												case 1 :
														commmode = "物联网表" ;
														break ;
												case 2 :
														commmode = "无线远传表" ;
														break ;
												default : 
														commmode = "" ;
														break ;
										}
										var tr = $("<tr><td style='border:0 ;'>"+data.devicemodel+"</td><td style='border:0 ;'>"+data.devicetypename+"</td><td style='border:0 ;'>"+
															commmode +"</td><td style='border:0 ;'>"+$.parseDoubleValue(data.usecard , "是" , "否")+"</td></tr>"+
														"<tr><td  style='font-weight:bold;border:0;'>IC卡表类型</td><td style='border:0;'>"+$.parseVoidValue( data.cardtypename )+"</td>"+
														"<td  style='font-weight:bold;border:0;'>计费模式</td><td style='border:0;'>"+$.parseDoubleValue( data.runmode , "金额表", "气量表" )+"</td></tr>"+
														"<tr><td  style='font-weight:bold;border:0;'>报警值</td><td style='border:0;'>"+$.parseVoidValue( data.warnvalue )+"</td>"+
														"<td  style='font-weight:bold;border:0;'>关阀报警值</td><td style='border:0;'>"+$.parseVoidValue( data.warnlvalue )+"</td></tr>"+
														"<tr><td  style='font-weight:bold;border:0;'>表内门限值</td><td style='border:0;'>"+$.parseVoidValue( data.limitvalue )+"</td>"+
														"<td  style='font-weight:bold;border:0;'>流量上限值</td><td style='border:0;'>"+$.parseVoidValue( data.flowlimitvalue )+"</td></tr>"+
														"<tr><td  style='font-weight:bold;border:0;'>不用气告警值(天)</td><td style='border:0;'>"+$.parseVoidValue( data.alertdays )+"</td>"+
														"<td  style='font-weight:bold;border:0;'>不用气强制关阀值(天)</td><td style='border:0;'>"+$.parseVoidValue( data.forcedays )+"</td></tr>"+
														"<tr><td  style='font-weight:bold;border:0;'>描述</td><td colspan='3' style='border:0;'>"+data.description+"</td></tr>"+
														"<tr userData="+JSON.stringify({data:data,index:index})+"><td colspan='2'/><td><a style='font-weight:300;float:right;'>修改</a></td><td>"+
														"<a href='#modifyPopup' data-rel='popup' data-position-to='window' data-transition='pop' style='font-weight:300;text-decoration:none;float:right;'>删除</a>"+
														"</td></tr>") ;
								
										tr.each(function(index){
											fragment.appendChild(this) ;
											chintPlugins.tablePlugin.trColorSetting(this,index,{total:6,tds:[1,3]}) ;//行点击效果
										}) ;
										
										aTds = tr.find('a') ;
										//修改
										$(aTds[0]).on('click',function(){
												$.modifyEvent(this) ;
										}) ;
										//删除
										$(aTds[1]).on('click',function(){
												var url = config.basePath+config.baseTblDeviceTypeDelete ;
												$.deleteSelectedData(this , url , tableDataHandle) ;//没有设置URL通用参数
										}) ;
								
								}) ;
								optionTable.append(fragment).trigger("create") ;
						}
						
						//添加过滤查询panel内容
						var renderFilterPanel = function(){
								var inputPlugin = chintPlugins.inputPlugin ;
								var radioPlugin = chintPlugins.radioPlugin ;
								//显示过滤查询panel
								$(chintBodyMain).find('#filterConditionElement').on('click',function(){
										filterPanel.find(".chintInput").val("") ;
										filterPanel.panel().panel("open");
								}) ;
								var fragment = document.createDocumentFragment();
								var label = $("<label>过滤查询</label>") ;
								fragment.appendChild(label[0]) ;
								var dataArray = [ { label:'设备型号',name:'devicemodel' } ] ;
								inputPlugin.renderInputFragment( dataArray , fragment) ;//绘制输入框
								fragment.appendChild($("<div id='filterDeviceTypeTree'/>")[0]) ;
								radioPlugin.renderCollasibleRadio( paramData.filterPanel.collasibleRadios , fragment ) ;
								$(fragment.lastChild).on("change" , function(){
											var dataId = $(this).find('.radioChecked').attr("dataId") ;
											if( 0 == dataId && "" !== dataId ){
													$("#cardtypenameDiv").find("form").empty() ;
											}else{
													getCardtypename() ;
											}
								}) ;
								fragment.appendChild($("<div id='cardtypenameDiv'/>")[0]) ;
								var runmode = radioPlugin.init(null , [ { text : "全部" , id : "" } , { text : "金额表" , id : "1" } , { text : "气量表" , id : "0" } ] , {title:'计量模式' ,  id:'runmode' , height : '8.2em' }).radioIconsRender( ) ;
								fragment.appendChild(runmode[0]) ;
								var button = $("<button>查询</button>") ;
								button.on("click" , function(){
											$.queryContext( filterInner , filterPanel , tableDataHandle ) ;
								}) ;
								fragment.appendChild(button[0]) ;
								filterInner.append(fragment).trigger("create") ;
						}
						
						//添加 修改panel内容
						var renderModifyPanel = function(){
									chintBodyMain.find('#addElement').on('click', $.clickModifyLabel ) ;
									var fragment = document.createDocumentFragment() ;
									fragment.appendChild($("<label>")[0]) ;
									inputPlugin.renderInputFragment( paramData.modifyPanel.inputs , fragment ) ;//绘制输入框列表
									var textArea = chintPlugins.textareaPlugin.init( null , {} , {labelName:'描述',id:'description',name:'description'} ).render() ;
									fragment.appendChild(textArea) ;
									radioPlugin.renderDoubleRadio( paramData.modifyPanel.doubleRadios , fragment ) ;//绘制单行单选
									fragment.appendChild($("<div id='modifyDeviceTypeTree'/>")[0]) ;
									radioPlugin.renderCollasibleRadio( paramData.modifyPanel.collasibleRadios , fragment ) ;//绘制下拉单选组件
									fragment.appendChild($("<div id='cardtypenameModify'/>")[0]) ;
									var hintLabel = $("<label style='color:red;' class='hintLabel'></label>") ;
									fragment.appendChild(hintLabel[0]) ;
									var button = $("<button>确认</button>") ;
									button.on("click" , modifyPanelOpration) ;
									fragment.appendChild(button[0]) ;
									modifyInner.append(fragment).trigger("create") ;
						}
						
						//添加 修改button点击操作
						var modifyPanelOpration = function(){
									var inputPlugin = chintPlugins.inputPlugin ;
									var radioPlugin = chintPlugins.radioPlugin ;
									var label = modifyInner.find(".hintLabel") ;
									label.show() ;
									var params = {} ;
									var chintInput = modifyInner.find('.chintInput') ;
									params = inputPlugin.setParams( params , modifyInner ) ;
									if(!chintInput[0].value){
											$.hintLabel(label , "设备型号") ;
											return ;
									}
									params = $.setParamsFormTextarea( params , modifyInner ) ;
									var button = modifyInner.find("button") ;
									var id = button.attr("id") ;
									params.id = id ? id : "" ;
									//获取单选框参数
									params = radioPlugin.setParams(params , modifyInner) ;
									params.devicetypeid = params.devicetypename ;
									$.customAjax(''+config.basePath+config.baseTblDeviceTypeSave , params , function(flag , data){
												var lable = modifyInner.find(".hintLabel") ;
												$.hintLabel(label , data.msg , "green") ;
												tableDataHandle({rows:1000}) ; //添加完后执行查询操作
												setTimeout(function(){ modifyPanel.panel().panel("close") } , 1000) ;
									}) ;
						}
						
						init() ;
　　　　};
　　　　return {
　　　　　　	init: list
　　　　};
});