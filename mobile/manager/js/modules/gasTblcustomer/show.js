define(function (){
　　　　var show = function (){
					var inputPlugin = ChintPlugins.inputPlugin ;
					var radioPlugin = ChintPlugins.radioPlugin ;
					var checkedZoneId = null ;
					var checkedDeviceId = null ;
					
					//组件静态参数列表
					var paramData = { deviceInfo : {
																inputs : [ {label:'设备编号',name:'devicecode' , readonly : true } , {label:'设备名称',name:'devicename' , readonly : true} , 
																				{label:'设备种类',name:'devicetypename' , readonly : true} , {label:'设备型号',name:'devicemodelname' , readonly : true},
																				{label:'透支金额',name:'creditamount' , readonly : true} , {label:'地址',name:'deviceaddress' , readonly : true}] ,
																doubleRadios : [ {data : [ { radioName : "后付费" , value : "1" } , { radioName : "预付费" , value : "0" }] , options : {title:"计费模式" , id : "chargemode"}} , 
																							{data : [ { radioName : "是" , value : "1" } , { radioName : "否" , value : "0" }] , options : {title:"系统计费" , id : "syschargeflag"}} ,
																							{data : [ { radioName : "是" , value : "1" } , { radioName : "否" , value : "0" }] , options : {title:"安全停气" , id : "safeshutflag"}}
																 ]
													} , 
													userInfo : { 
																inputs : [ {label:'户号',name:'accountno' , readonly : true} , {label:'用户名',name:'ownername'} , 
																				{label:'证件号码',name:'pidcardno'} ,{label:'用户状态',name:'state' , readonly : true},
																				{label:'手机',name:'mobileno'},{label:'固定电话',name:'telno'} , 
																				{label:'联系地址',name:'address'}] 
													} ,
													chargeInfo : {
																inputs : [ {label:'表具单价',name:'hitransmoney1'} , {label:'安装费用',name:'hitransmoney2'} ,
																				{label:'合计金额',name:'hitransmoney'}
																] ,
																collasibleRadios : [{data : [{text : "现金" , id : "1" } , {text : "银行卡" , id : "2" } , {text : "微信" , id : "3" },{text : "支付宝" , id : "4" },{text : "转账" , id : "5" }] , 
																								options : {title:'缴费方式' ,  id:'hipaymode' , height : '10.9em' }}]
													} ,
													filterPanel : { 
																inputs : [ {label:'设备编号',name:'devicecode'} , {label:'设备名称',name:'devicename'} ] , 
																collasibleRadios : [
																			{data : [ { text : "全部" , value : "" } , { text : "已开户" , value : "1" } , { text : "未开户" , value : "0" }] , options : {title:"开户状态" , id : "usestate"}} , 
										    								{data : [ { text : "全部" , value : "" } , { text : "是" , value : "1" } , { text : "否" , value : "0" }] , options : {title : "系统计费" , id : "syschargeflag"} }
										    					] 
													} 
												  } ;
					
					//组件动态数据列表
					var collapsibleDataHandle = function(){
							//选择区域数据列表
							$.customAjax(''+config.basePath+config.baseTblZoneTree , {showEmptyNode:0,keyId:''} , function(flag , data){
										var zoneTree = $("#filterZoneTree").empty() ;
										var filterPlugin = ChintPlugins.radioPlugin.init(null , data , {title:'区域选择' ,  id:'zoneid' , height : '8.2em' }).radioIconsRender( ) ;
										zoneTree.append(filterPlugin) ;
										zoneTree.trigger("create") ;
							}) ;
					}
					
					//获取证件类型和用户类型数据
					var cardAndUserType = function(){
							//获取证件类型数据
							$.customAjax(''+config.basePath+config.getPidcardTree , {showEmptyNode:0,keyId:''} , function(flag , data){
										var cardTypeDiv = document.createElement('div') ;
										var cardTypePlugin = radioPlugin.init(null , data , {title:'证件类型' ,  id:'pidcardtype' , height : '8.2em' }).radioIconsRender( ) ;
										cardTypeDiv.append( cardTypePlugin[0] ) ;
										chintBodyMain.find("#pidcardno").parent().prev().before( cardTypeDiv );
										$(cardTypeDiv).trigger("create") ;
							}) ;
							
							//获取用户类型数据
							$.customAjax(''+config.basePath+config.getTypeCodeTree , {showEmptyNode:0,keyId:''} , function(flag , data){
										var userType = document.createElement('div') ;
										var userTypePlugin = radioPlugin.init(null , data , {title:'用户类型' ,  id:'typecode' , height : '8.2em' }).radioIconsRender( ) ;
										userType.append( userTypePlugin[0] ) ;
										chintBodyMain.find("#mobileno").parent().prev().before( userType );
										$(userType).trigger("create") ;
							}) ;
							
					}
					
					//table数据处理
					var tableDataHandle = function(params){
							//添加table数据
							$.customAjax(''+config.basePath+config.searchDeviceByZone , params , function(flag , data){
									if('success' === flag){
										//渲染分页，table数据使用callback回调函数渲染
										ChintPlugins.pageBreakPlugin.init(chintBodyMain.find('span'),data,{pageCount:5}).render(renderTblOptionTable) ;
									}
							}) ;
					}
					
					//渲染菜单管理table
					var renderTblOptionTable = function(data){
							var fragment = document.createDocumentFragment();
							var optionTable = $(chintBodyMain).find('table tbody') ;
							optionTable.empty() ;//先清空table中的内容再渲染table
							data.rows.forEach(function(data,index){
									var tr= $("<tr><td  style='border:0;'>"+data.devicename+"</td><td  style='border:0;'>"+$.parseDoubleValue( data.usestate , "已开户" , "未开户") +
													"</td><td  style='border:0;'>"+$.parseDoubleValue(data.chargemode , "后付费" , "预付费")+"</td><td  style='border:0;'>"+
													$.parseDoubleValue( data.syschargeflag , "系统计费" , "表具计费" )+"</td></tr>"+
													"<tr><td  style='font-weight:bold ;border:0;'>设备编号</td><td colspan='3' style='border:0;'>"+data.devicecode+"</td></tr>"+
													"<tr><td  style='font-weight:bold ;'>安装地址</td><td colspan='3'>"+$.parseVoidValue( data.deviceaddress )+"</td></tr><tr/>") ;
									tr.each(function(index){
										fragment.appendChild(this) ;
										ChintPlugins.tablePlugin.trColorSetting(this,index,{total:3,tds:[1,3]}) ;//行点击效果
									}) ;
									tr.attr("userData" , JSON.stringify(data.deviceid) ) ;
									tr.on("touchstart" , showDeviceDetail  ) ;
							}) ;
							optionTable.append(fragment).trigger("create") ;
					} ;
					
					//点击table中的数据并在表具信息的详细列表中显示
					var showDeviceDetail = function(){
							var deviceid = JSON.parse($(this).attr("userData")) ;
							checkedDeviceId = deviceid ;
							$.customAjax(''+config.basePath+config.deviceDetail , { deviceid : deviceid } , function(flag , data){
										var deviceInfo = chintBodyMain.find("#deviceInfoDiv") ;
										var chintInput = deviceInfo.find(".chintInput") ;//点击表具时对表具信息中的输入框反显
										var userData = data.data ;
										chintInput.each(function( index , dom){
												$(dom).val(userData[dom.name]) ;
										}) ;
										//单选回显
										paramData.deviceInfo.doubleRadios.forEach(function(data , index){
												var radio = deviceInfo.find("[name='radio-choice-"+data.options.id+"']") ;
												radioPlugin.doubleRadioreRender(radio , userData , data.options.id ) ;
										}) ;
							}) ;
							setOpenBtn() ;
					}
					
					//设置开户按钮为活动状态
					var setOpenBtn = function(){
							var openAccountBtn = chintBodyMain.find(".ui-navbar button")[0] ;
							$(openAccountBtn).addClass("ui-btn-active") ;//选中某个表具时设置开户按钮为可选状态
							//为开户按钮绑定点击事件
							$(openAccountBtn).on("touchstart" , setAccountno ) ;
					
					}
					
					//点击开户按钮时设置用户信息中的户号并设置导航按钮组样式
					var setAccountno = function(){
							$.customAjax(''+config.basePath+config.getAccountNo , {} , function(flag , data){
										$(chintBodyMain.find("#userInfo .chintInput")[0]).val(data.accountno) ;
							}) ;
							chintBodyMain.find("#state").val("开户") ;
							var navbarButtons = chintBodyMain.find(".ui-navbar button") ;
							navbarButtons.addClass("ui-btn-active") ;
							$(this).removeClass("ui-btn-active") ;
							$(this).off("touchstart") ;
							$(navbarButtons[1]).on("touchstart" , saveFunction) ;
							$(navbarButtons[2]).on("touchstart" , quitFunction) ;
					}
					
					//设置导航按钮组中的保存按钮操作
					var saveFunction = function(){
							var params = {} ;
							params.hizoneid = checkedZoneId ;
							params.hideviceid = checkedDeviceId ;
							inputPlugin.setParams( params , chintBodyMain.find("#chargeInfo") ) ;
							radioPlugin.setParams( params , chintBodyMain.find("#chargeInfo") ) ;
							inputPlugin.setParams( params , chintBodyMain.find("#userInfo") ) ;
							radioPlugin.setParams( params , chintBodyMain.find("#userInfo") ) ;
							params.state = "1" ;
							//保存开户信息
							$.customAjax(''+config.basePath+config.addInfo , params , function(flag , data){
										if("error" == flag){
												$.fadeInPlugin("开户保存失败！请重试...") ;
										}else{
												$.fadeInPlugin("开户保存成功!") ;
										}
										console.log("开户信息保存 data is :" , data) ;							
							}) ;
							return false ;
					}
					
					//设置导航按钮组中的取消按钮操作
					var quitFunction = function(){
							var navbarButtons = chintBodyMain.find(".ui-navbar button") ;
							navbarButtons.removeClass("ui-btn-active") ;
							setOpenBtn() ;
							$(this).off("touchstart") ;
							$(navbarButtons[1]).off("touchstart") ;
							$("#userInfo").find(".chintInput").val("") ;
					}
					
					//点击过滤条件标签显示过滤条件filterPanel并清空filterPanel中组件的内容
					var clickFilterConditionEle = function(){
							//显示过滤查询panel
							$(chintBodyMain).find('#filterConditionElement').on('touchstart',function(){
									filterPanel.find("input").val("") ;
									radioPlugin.reRenderRadioIcons( filterInner.find(".ui-collapsible") , "") ;
									filterPanel.panel().panel("open");
							}) ;
					}
					
					//添加过滤查询panel内容
					var renderFilterPanel = function(){
							var fragment = document.createDocumentFragment();
							fragment.appendChild($("<label>过滤条件</label>")[0]) ;
							paramData.filterPanel.inputs.forEach(function(data , index){
										fragment.appendChild( inputPlugin.init( null , {} , {labelName : data.label , id : data.name , name : data.name } ).render() ) ;
							}) ;
							radioPlugin.renderCollasibleRadio( paramData.filterPanel.collasibleRadios , fragment ) ;//绘制下拉单选组件
							fragment.appendChild($("<div id='filterZoneTree'/>")[0]) ;
							var button = $("<button class='confirm-button'>确认</button>") ;
							button.on("touchstart" , function(){
										$.queryContext( filterInner , filterPanel , tableDataHandle ) ;
										checkedZoneId = radioPlugin.setParams({} , filterInner.find("#filterZoneTree")).zoneid ;//设置zoneid
							} ) ;
							fragment.appendChild(button[0]) ;
							filterInner.append(fragment).trigger("create") ;
					} ;
					
					//创建表具信息中的单选框和用户信息输入框信息
					var createDomInfo = function(){
							//常见表具信息组件内容
							var deviceFragment = document.createDocumentFragment() ;
							//渲染输入框列表
							paramData.deviceInfo.inputs.forEach(function(data , index){
										deviceFragment.appendChild( inputPlugin.init( null , {} , {labelName : data.label , id : data.name , name : data.name , type : data.type , readonly : data.readonly} ).render() ) ;
							}) ;
							//渲染单选框列表
							paramData.deviceInfo.doubleRadios.forEach(function(data , index){
										deviceFragment.appendChild(radioPlugin.init( null , data.data  , data.options ).doubleRender()[0])  ;
							}) ;
							chintBodyMain.find("#deviceInfoDiv").append( deviceFragment ) ;
					
							//创建用户信息输入框信息
							var userFragment = document.createDocumentFragment() ;
							paramData.userInfo.inputs.forEach(function(data , index){
										userFragment.appendChild( inputPlugin.init( null , {} , {labelName : data.label , id : data.name , name : data.name , type : data.type , readonly : data.readonly } ).render() ) ;
							}) ;
							//创建证件类型、用户类型下拉单选框
							cardAndUserType() ;
							
							chintBodyMain.find("#userInfo").append( userFragment ) ;
							
							//创建收费信息div信息
							var chargeFragment = document.createDocumentFragment() ;
							//创建输入框列表
							paramData.chargeInfo.inputs.forEach(function(data , index){
										chargeFragment.appendChild( inputPlugin.init( null , {} , {labelName : data.label , id : data.name , name : data.name , type : data.type} ).render() ) ;
							}) ;
							//创建缴费方式下拉单选框列表
							radioPlugin.renderCollasibleRadio( paramData.chargeInfo.collasibleRadios , chargeFragment ) ;
							chintBodyMain.find("#chargeInfo").append( chargeFragment ) ;
							
							chintBodyMain.trigger("create") ;
					} ;
					
					!(function(){
							$.emptyInnerPanel() ;
							var chintMainInnerHtml   = ['<h2>表具查询</h2>'  ,
								  										   '<a id="filterConditionElement" href="#" data-ajax="false" style="float:right;margin-top:-3em;">过滤条件</a>' ,
								  										   '<table data-role="table" data-column-btn-theme="b" data-column-popup-theme="a" data-mode="" class="table-stroke">' ,
								  												'<thead><tr class="th-groups"><th style="width:4.15em;">设备名称</th><th style="width:4.15em;">开户状态</th>' ,
								  												'<th style="width:4.15em;">计费模式</th><th style="width:4.15em;">系统计费</th></tr></thead>' ,
								  												'<tbody></tbody>' ,
								  										    '</table>' ,
								  										    '<span style="float:right;"></span>'  ,
								  										   '<h2 style="margin-top:2em;">表具信息</h2>'  ,
								  										   '<div id="deviceInfoDiv" />'  ,
								  										   '<h2/>'  ,
								  										   '<div role="navigation" class="ui-navbar" data-role="navbar" data-iconpos="left">'  ,
								 												'<ul class="ui-grid-b"><li class="ui-block-a"><button class="ui-btn ui-icon-check ui-btn-icon-left" data-icon="check">开户</button></li>'  ,
								 												'<li class="ui-block-b"><button class="ui-btn ui-icon-cloud ui-btn-icon-left" data-icon="cloud" >保存</button></li>'  ,
								  												'<li class="ui-block-c"><button class="ui-btn ui-icon-back ui-btn-icon-left" data-icon="back">取消</button></li>'  ,
								  										   '</ul></div>'  ,
								  										   '<h2  style="margin-top:1em;">用户信息</h2>'  ,
								  										   '<div id="userInfo" />'  ,
								  										   '<h2 style="margin-top:1em;">收费信息</h2>'  ,
								  										   '<div id="chargeInfo" />'  ].join("") ;
							chintBodyMain.append(chintMainInnerHtml).trigger("create") ;
							tableDataHandle( {rows:10000} ) ;		//渲染table
							renderFilterPanel() ;		//渲染过滤条件panel
							collapsibleDataHandle() ;		//获取动态数据 
							createDomInfo() ;			//绘制表具信息和用户信息标签列表
							clickFilterConditionEle() ;		//过滤条件标签点击事件
					})()
　　　　};
　　　　return {
　　　　　　init: show
　　　　};
});