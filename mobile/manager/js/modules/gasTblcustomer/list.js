define(function (){
			  var changeDivice = {accountid : "" , deviceid : "" , zoneid : ""} ;
　　　　var list = function (){
					var inputPlugin = chintPlugins.inputPlugin ;
					var radioPlugin = chintPlugins.radioPlugin ;
					//组件静态参数列表
					var paramData = { tblTitle : {} , 
												    filterPanel : {
																inputs : [ {label:'户号',name:'accountno'} , {label:'用户名',name:'ownername'} , 
																				{label:'证件号',name:'pidcardno'} , {label:'手机',name:'mobileno'}] ,
																collasibleRadios : [{data : [{text : "全部" , id : " " } , {text : "停户" , id : "0" } , {text : "开户" , id : "1" },{text : "销户" , id : "-1" }] , 
																								options : {title:'用户状态' ,  id:'state' , height : '10.9em' }}]
													} ,
													editPanel : {
																inputs : [{label:'户号',name:'accountno', readonly : true } , {label:'用户名',name:'ownername'} ,
																				{label:'证件号码',name:'pidcardno'} , {label:'地址',name:'address'} ,
																				{label:'手机',name:'mobileno'} , {label:'固定电话',name:'telno'}] ,
																collasibleRadios : [{options : {id : "pidcardtype"} } , {options : {id : "typecode"}}]
													} ,
													recyclePanel : {
																inputs : [{label:'原户号',name:'accountno', readonly : true } ,{label:'新户号',name:'accountno2', readonly : true } ,
																				 {label:'原用户名',name:'ownername' , readonly : true } ,{label:'用户名',name:'ownername2' } ,
																				{label:'原用户类型',name:'typename' , readonly : true } , {label:'原证件类型',name:'pidcardtypename' , readonly : true } ,
																				{label:'原证件号码',name:'pidcardno' , readonly : true } ,{label:'证件号码',name:'pidcardno2' } , 
																				{label:'原地址',name:'address' , readonly : true } ,{label:'地址',name:'address2' } ,
																				{label:'原手机号',name:'mobileno' , readonly : true } , {label:'手机',name:'mobileno2' } , 
																				{label:'原固定电话',name:'telno' , readonly : true } , {label:'固定电话',name:'telno2' }] ,
																transferParams : [ "accountno2" , "ownername2" , "pidcardno2" , "address2" , "mobileno2" , "telno2" ]
													},
													forbiddenAccount : {
																options :  {h1:'停户',h3:'确认停户？',a0:'确定',a1:'取消'}
													} ,
													checkAccount :{
																options :  {h1:'启户',h3:'确认启户？',a0:'确定',a1:'取消'}
													} ,
													deleteAccount : {
																options :  {h1:'销户',h3:'确认销户？',a0:'确定',a1:'取消'}
													}
													}
													
					//组件动态数据列表
					var collapsibleDataHandle = function(){
							//选择区域数据列表
							$.customAjax(''+config.basePath+config.baseTblZoneTree , {showEmptyNode:0,keyId:''} , function(flag , data){
										var zoneTree = $("#filterZoneTree").empty() ;
										var filterPlugin = chintPlugins.radioPlugin.init(null , data , {title:'区域选择' ,  id:'zoneid' , height : '8.2em' }).radioIconsRender( ) ;
										zoneTree.append(filterPlugin) ;
										zoneTree.trigger("create") ;
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
							fragment.appendChild($("<div id='filterZoneTree'/>")[0]) ;	//区域列表树
							var button = $("<button  class='confirm-button'>确认</button>") ;
							button.on("touchstart" , function(){
										$.queryContext( filterInner , filterPanel , tableDataHandle ) ;
							}) ;
							fragment.appendChild(button[0]) ;
							filterInner.append(fragment).trigger("create") ;
					} ;
					
					//点击过滤条件标签显示过滤条件filterPanel并清空filterPanel中组件的内容
					var clickFilterConditionEle = function(){
							//显示过滤查询panel
							$(chintBodyMain).find('#filterConditionElement').on('touchstart',function(){
									filterPanel.find("input").val("") ;
									radioPlugin.reRenderRadioIcons( filterInner.find(".ui-collapsible") , "") ;
									filterPanel.panel().panel("open");
							}) ;
					} ;
					
					//table数据处理
					var tableDataHandle = function(params){
							//添加table数据
							$.customAjax(''+config.basePath+config.accountInfoDataList , params , function(flag , data){
									if('success' === flag){
										//渲染分页，table数据使用callback回调函数渲染
										chintPlugins.pageBreakPlugin.init(chintBodyMain.find('span'),data,{pageCount:2}).render(renderTblOptionTable) ;
									}
							}) ;
					} ;
					
					//渲染菜单管理table
					var renderTblOptionTable = function(data){
							var fragment = document.createDocumentFragment();
							var optionTable = $(chintBodyMain).find('table tbody') ;
							optionTable.empty() ;//先清空table中的内容再渲染table
							data.rows.forEach(function(data,index){
									var tr= $("<tr><td  style='border:0;word-break:break-all;'>"+data.ownername +"</td><td  style='border:0;'>"+$.parseTribleValue(data.state , "开户" , "停户" , "销户")+
													"</td><td  style='border:0;'>"+data.typename+"</td><td  style='border:0;'>"+data.pidcardtypename+"</td></tr>"+
													"<tr><td  style='font-weight:bold ;border:0;'>户号</td><td colspan='3' style='border:0;'>"+data.accountno+"</td></tr>"+
													"<tr><td  style='font-weight:bold ;border:0;'>证件号码</td><td colspan='3' style='border:0;'>"+data.pidcardno+"</td></tr>"+
													"<tr><td style='font-weight:bold ;border:0;'>地址</td><td style='border:0;'>"+data.address+"</td><td style='font-weight:bold ;border:0;'>手机</td><td style='border:0;'>"+data.mobileno+"</td></tr>"+
													"<tr><td style='font-weight:bold ;border:0;'>固定电话</td><td style='border:0;'>"+data.telno+"</td><td style='font-weight:bold ;border:0;'>所属区域</td><td style='border:0;'>"+data.zonename+"</td></tr>"+
													"<tr><td style='font-weight:bold ;border:0;'>用户表具</td><td colspan='3' style='border:0;'>"+data.devicenames+"</td></tr>"+
													"<tr><td style='font-weight:bold ;border:0;'>网上注册</td><td style='border:0;'>"+$.parseDoubleValue(data.regflag , "是" , "否" )+"</td><td style='font-weight:bold ;border:0;'>注册手机</td><td style='border:0;'>"+$.parseVoidValue(data.regmobileno)+"</td></tr>"+
													"<tr><td style='font-weight:bold ;border:0;'>微信号</td><td colspan='3' style='border:0;'>"+$.parseVoidValue(data.micromsgno)+"</td><tr>"+
													"<td colspan='4'>"+
													"<div role='navigation' class='ui-navbar' data-role='navbar' data-iconpos='left'>"+
															"<ul class='ui-grid-a'><li class='ui-block-a'><button class='ui-icon-edit ui-btn-icon-left green-3 btn-border' data-icon='edit'>修改账户</button></li>"+
															"<li class='ui-block-b'><button class='ui-icon-recycle ui-btn-icon-left blue-3 btn-border' data-icon='recycle' >过户</button></li>"+
															"<li class='ui-block-c'><button class='ui-icon-forbidden ui-btn-icon-left red-3 btn-border' data-icon='forbidden'>"+
																	"<a href='#modifyPopup' data-rel='popup' data-position-to='window' data-transition='pop' style='border:0;padding:0;' aria-haspopup='true' aria-owns='modifyPopup' aria-expanded='false' class='ui-link red-3'>停户</a>"+
															"</button></li>"+
													"</ul></div>"+
													"<div role='navigation' class='ui-navbar' data-role='navbar' data-iconpos='left'>"+
													"<ul class='ui-grid-b'><li class='ui-block-a'><button class='ui-icon-check ui-btn-icon-left orange-4 btn-border' data-icon='check'>"+
															"<a href='#modifyPopup' data-rel='popup' data-position-to='window' data-transition='pop' style='border:0;padding:0;' aria-haspopup='true' aria-owns='modifyPopup' aria-expanded='false' class='ui-link orange-4'>启户</a>"+
													"</button></li>"+
													"<li class='ui-block-b'><button class='ui-icon-delete ui-btn-icon-left cyan-4 btn-border' data-icon='delete' >"+
															"<a href='#modifyPopup' data-rel='popup' data-position-to='window' data-transition='pop' style='border:0;padding:0;' aria-haspopup='true' aria-owns='modifyPopup' aria-expanded='false' class='ui-link cyan-4'>销户</a>"+
													"</button></li>"+
													"<li class='ui-block-c'><button class='ui-icon-refresh ui-btn-icon-left grey-4 btn-border' data-icon='refresh'>换表</button></li>"+
													"<li class='ui-block-d'><button class='ui-icon-arrow-d ui-btn-icon-left purple-4 btn-border' data-icon='arrow-d'>导入</button></li>"+
													"</ul></div>"+
													"</td>"+"</tr>") ;
									tr.each(function(index){
										fragment.appendChild(this) ;
										chintPlugins.tablePlugin.trColorSetting(this,index,{total:8,tds:[1,3]} , true) ;//行点击效果
									}) ;
									$(tr[tr.length-1]).attr("userData" , JSON.stringify(data) ) ;
									navigationOperation(tr) ;
							}) ;
							optionTable.append(fragment).trigger("create") ;
					} ;
					
					//动态获取用户类型和证件类型数据
					var getAnimateData = function(){
							//获取用户类型数据
							$.customAjax(''+config.basePath+config.getTypeCodeTree , {showEmptyNode:0,keyId:''} , function(flag , data){
										var userType = document.createElement('div') ;
										var userTypePlugin = radioPlugin.init(null , data , {title:'用户类型' ,  id:'typecode' , height : '8.2em' }).radioIconsRender( ) ;
										userType.append( userTypePlugin[0] ) ;
										var typename = modifyInner.find("#typename") ;
										//兼容修改和过户按钮点击操作
										if( 0 == typename.length ){
													modifyInner.find("#ownername").parent().after( userType );
										}else{
													typename.parent().after( userType ) ;
										}
										$(userType).trigger("create") ;
							}) ;
							
							//获取证件类型数据
							$.customAjax(''+config.basePath+config.getPidcardTree , {showEmptyNode:0,keyId:''} , function(flag , data){
										var cardTypeDiv = document.createElement('div') ;
										var cardTypePlugin = radioPlugin.init(null , data , {title:'证件类型' ,  id:'pidcardtype' , height : '8.2em' }).radioIconsRender( ) ;
										cardTypeDiv.append( cardTypePlugin[0] ) ;
										modifyInner.find("#pidcardno").parent().prev().before( cardTypeDiv );
										$(cardTypeDiv).trigger("create") ;
							}) ;
							
					} ;
					
					//将userdata的内容回显
					var reRenderFn = function(userdata){
							var chintInput = modifyInner.find(".chintInput") ;//点击表具时对表具信息中的输入框反显
							chintInput.each(function( index , dom){
									$(dom).val(userdata[dom.name]) ;
							}) ;
							//设置新户号	accountno2
							var accountno2 = modifyInner.find("#accountno2") ;
							if( 1 == accountno2.length){//当有原户号输入框时才查询户号信息并将户号植入原户号输入框
										$.customAjax(''+config.basePath+config.getAccountNo , {} , function(flag , data){
													accountno2.val(data.accountno) ;
										}) ;
							}
							//单选回显	异步问题导致单选框内容无法回显
							paramData.editPanel.collasibleRadios.forEach(function(data , index){
									var radio = modifyInner.find("[name='radio-choice-"+data.options.id+"']") ;
									radioPlugin.doubleRadioreRender(radio , userdata , data.options.id ) ;
							}) ;
					} ;
					
					//modify操作modal
					var modifyModal = function( self , title  , inputs , collasibleRadios , fn){
							var userdata = JSON.parse($(self).closest("tr").attr("userdata")) ;
							modifyInner.empty() ;
							var fragment = document.createDocumentFragment();
							fragment.appendChild($("<label>"+title+"</label>")[0]) ;
							inputs.forEach(function(data , index){
										fragment.appendChild( inputPlugin.init( null , {} , {labelName : data.label , id : data.name , name : data.name , readonly : data.readonly } ).render() ) ;
							}) ;
							var button = $("<button  class='confirm-button'>确定</button>") ;
							//修改账户
							button.attr({"accountid" : userdata.accountid , "zoneid" : userdata.zoneid , "deviceid" : userdata.deviceid }) ;
							//修改账户信息
							fragment.appendChild(button[0]) ;
							modifyInner.append(fragment).trigger("create") ;
							//通过是否有新账号的input标签判断是修改账户还是过户
							( 0 == modifyInner.find("#accountno2").length) ? button.on("touchstart" , confirmModifyParams) : button.on("touchstart" , transferFunction) ;
							if(fn instanceof Function) fn() ;
							//修改操作回显内容
							reRenderFn( userdata ) ;
							modifyPanel.panel().panel("open");
							return false ;
					} ;
					
					//保存修改账户信息
					var confirmModifyParams = function(){
							var params = {} ;
							var chintInput = modifyInner.find('.chintInput') ;
							chintInput.each(function(index , data){
									params[data.name] = data.value ;
							}) ;
							setRadioValue(params) ;
							params.accountid = $(this).attr("accountid") ;
							$.customAjax(''+config.basePath+config.accountInfoSave , params , function(flag , data){
										$.fadeInPlugin( data.msg ) ;
										setTimeout( tableDataHandle( {rows:1000} ) , 500 ) ;
										setTimeout(function(){ modifyPanel.panel().panel("close") } , 500) ;
							}) ;
							return false ;
					} ;
					
					// 将下拉单选框中的内容设置的到params中
					var setRadioValue = function(params , flag){
							var radioChecked = modifyInner.find('.radioChecked') ;
							radioChecked.each(function( index ,ele ){
									var name = ele.name ;
									name = name.substr( 0 , name.lastIndexOf("-") ) ;
									name = name.substr(name.lastIndexOf("-")+1) ;
									if(flag) name += "2" ;
									params[name] = radioPlugin.getValueFromEle(ele) ;
							}) ;
					}
					
					//账户管理----过户
					var transferFunction = function(){
							var params = {} ;
							var self = $(this) ;
							params.trans2accid = self.attr("accountid") ; 
							params.trans2zoneid = self.attr("zoneid") ; 
							params.trans2deviceid = self.attr("deviceid") ; 
							setRadioValue(params , "transfer") ;
							var chintInput = modifyInner.find('.chintInput') ;
							paramData.recyclePanel.transferParams.forEach(function(data , index){
									params[data] = chintInput.filter("#"+data).val() ;
							}) ;
							$.customAjax(''+config.basePath+config.accountInfoTransfer , params , function(flag , data){
										$.fadeInPlugin( data.msg ) ;
										setTimeout( tableDataHandle( {rows:1000} ) , 500 ) ;
										setTimeout(function(){ modifyPanel.panel().panel("close") } , 500) ;
							}) ;
							return false ;
					} ;
					
					//修改账户操作
					var editAccount = function(){
							modifyModal( this , "修改账户" , paramData.editPanel.inputs , null ,  getAnimateData ) ;
							return false ;
					} ;
					
					//过户操作
					var recycleAccount = function(){
							modifyModal( this , "过户" , paramData.recyclePanel.inputs , null , getAnimateData ) ;
					} ;
					
					//设置a标签样式不是active的
					var removeActive = function(){
							$(this).find("a").removeClass("ui-btn-active") ;
							return false ;
					} ;
					
					//停户、启户、销户功能通用方法
					var commonFunction = function(commonState , self , options , url ){
							var popup = $.renderPopup(  $('#modifyPopup')  , options ) ;
							var userdata = JSON.parse($(self).closest("tr").attr("userdata")) ;
							var state = userdata.state ;
							var commonFlag = true ;
							//销户
							if( -1 == commonState){
										if( -1 == state ){
												$.fadeInPlugin("用户已销户，不可进行销户操作!!!") ;
										}
							}else if( 0 == commonState ){//停户
										if( 0 == state ){
												$.fadeInPlugin("已停户，不可进行停户操作...") ;
												commonFlag = removeActive() ;
										}else if( -1 == state  ){
												$.fadeInPlugin("已销户，不可进行停户操作...") ;
												commonFlag = removeActive() ;
										}
							}else if( 1 == commonState ){//启户
										if( 1 == state ){
												$.fadeInPlugin("已开户，不可进行启户操作...") ;
												commonFlag = removeActive() ;
										}else if( -1 == state  ){
												$.fadeInPlugin("已销户，不可进行启户操作...") ;
												commonFlag = removeActive() ;
										}
							}
							var confirmA = $(popup.find("a")[0]) ;
							confirmA.attr("accountids" , userdata.accountid) ;
							if( -1 != commonState && commonFlag ){
									confirmA.on("touchstart" , function(){
											var accountids = $(this).attr("accountids") ;
											$.customAjax( url , {accountids : accountids } , function(flag , data){
													$.fadeInPlugin(data.msg) ;
													tableDataHandle() ;
											}) ;
											$(this).off("touchstart") ;
									}) ;
							}else if( -1 == commonState ){
									console.log("this is delete account ...") ;
							}
					} ;
					
					//停户操作
					var forbiddenAccount = function(){
							var options = paramData.forbiddenAccount.options ;
							var url = ''+config.basePath+config.stopCustomer ;
							commonFunction( 0 , this  , options , url ) ;
					} ;
					
					//启户操作
					var checkAccount = function(){
							var options = paramData.checkAccount.options ;
							var url = ''+config.basePath+config.startCustomer ;
							commonFunction( 1 , this  , options , url ) ;
					} ;
					
					//销户操作
					 var deleteAccount = function(){
					 		var options = paramData.deleteAccount.options ;
							var url = ''+config.basePath+config.cancelCustomer ;
							commonFunction( -1 , this  , options , url ) ;
					 } ;
					
					//导航按钮组点击操作
					var navigationOperation = function(tr){
							var lis = $(tr).find("ul > li") ;
							//修改账户按钮点击操作
							lis.find(".ui-icon-edit").on("touchstart" ,  editAccount ) ;
							//过户按钮点击操作
							lis.find(".ui-icon-recycle").on("touchstart" ,  recycleAccount ) ;
							
							//停户按钮点击操作
							lis.find(".ui-icon-forbidden").on("touchstart" ,  forbiddenAccount ) ;
							
							//启户按钮点击操作
							lis.find(".ui-icon-check").on("touchstart" , checkAccount) ;
							
							//销户按钮点击操作
							lis.find(".ui-icon-delete").on("touchstart" ,  deleteAccount) ;
							
							//换表按钮点击操作
							lis.find(".ui-icon-refresh").on("touchstart" ,  function(){
									var gen = changeDeviceFn(this) ;
									var result = gen.next() ;
									result.value() ;
									return false ;					
							}) ;
							
							//导入按钮点击操作
							lis.find(".ui-icon-arrow-d").on("touchstart" ,  function(){
									console.log("导入...") ;
									return false ;
							}) ;
					} ;
					
					//使用协程解决requirejs异步调用问题
					var changeDeviceFn = function*(self){
							var userData = JSON.parse($(self).closest("tr").attr("userdata")) ;
							changeDivice.accountid = userData.accountid ;
							changeDivice.deviceid = userData.deviceid ;
							changeDivice.zoneid = userData.zoneid ;
							var changeDevice = yield function(){
									require.config( {baseUrl: config.modulePath} ) ;
									require(["gasTblcustomer/changeDevice"], function (module){
											module.init() ;
									}) ;
							}
					}

					;(function(){
								$.emptyInnerPanel() ;//清空chintBodyPanel中的内容
								var chintMainInnerHtml   =  ''  ;
									  chintMainInnerHtml += '<h2>账户管理</h2>' ;
									  chintMainInnerHtml += '<a id="filterConditionElement" href="#" data-ajax="false" style="float:right;margin-top:-3em;">过滤条件</a>' ;
									  chintMainInnerHtml += '<table data-role="table" data-column-btn-theme="b" data-column-popup-theme="a" data-mode="" class="table-stroke">' ;
								      chintMainInnerHtml += 		'<thead><tr class="th-groups"><th style="width:4.15em;">用户名</th><th style="width:4.15em;">状态</th>' ;
								      chintMainInnerHtml += 		'<th style="width:4.15em;">用户类型</th><th style="width:4.15em;">证件类型</th></tr></thead>' ;
								  	  chintMainInnerHtml +=		 '<tbody></tbody>' ;
								  	  chintMainInnerHtml += '</table>' ;
								  	  chintMainInnerHtml += '<span style="float:right;"></span>'  ;
								chintBodyMain.append(chintMainInnerHtml).trigger("create") ;
								renderFilterPanel() ;		//渲染过滤条件panel
								clickFilterConditionEle() ;		//过滤条件标签点击事件
								collapsibleDataHandle() ;		//获取动态数据列表
								tableDataHandle({rows:10000}) ;		//渲染table内容
					})()
　　　　};
　　　　return {
					 changeDivice : changeDivice ,
　　　　　　init: list
　　　　};
});