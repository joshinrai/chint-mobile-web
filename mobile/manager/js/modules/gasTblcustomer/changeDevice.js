define(["gasTblcustomer/list"] ,function( accountManage ){
		var list = function(){
				var inputPlugin = ChintPlugins.inputPlugin ;
				var radioPlugin = ChintPlugins.radioPlugin ;
				var tablePlugin = ChintPlugins.tablePlugin ;
				var changeConfirmDeviceid = null ;		//当前设备id
				var changeConfirmAccountid = null ;		//用户id
				var changeConfirmNewdeviceid = null ;//待换设备id
				var changeConfirmMode = null ;			//计费模式
				//组件静态参数列表
				var paramData = { 
												chargeInfo : {inputs : [{label:'退气金额',name:'curtransmoney'} , {label:'退气数量',name:'curgasamount'} ,
																					{label:'表具单价',name:'transmoney1'} , {label:'安装费用',name:'transmoney2'} ,
																					{label:'合计金额',name:'transmoney'}] ,
																	  collasibleRadios : [{data : [{text : "现金" , id : "1" } , {text : "银行卡" , id : "2" } , {text : "微信" , id : "3" },{text : "支付宝" , id : "4" }] , 
																								options : {title:'缴费方式' ,  id:'paymode' , height : '10.9em' }}]
																	  }
											} ;
											
					//渲染用户信息、当前表具HTML DOM结构
					var userInfoFrame = function(){
							var chargeFragment = document.createDocumentFragment() ;
							paramData.chargeInfo.inputs.forEach(function(data , index){
										chargeFragment.appendChild( inputPlugin.init( null , {} , {labelName : data.label , id : data.name , name : data.name , readonly : data.readonly } ).render() ) ;
							}) ;
							chintBodyMain.find("#chargeInfoDiv").append(chargeFragment) ;
							
							var radioFragment = document.createDocumentFragment() ;
							radioPlugin.renderCollasibleRadio( paramData.chargeInfo.collasibleRadios , radioFragment ) ;//绘制下拉单选组件
							chintBodyMain.find("#chargeInfoDiv").append(radioFragment) ;
							
							chintBodyMain.trigger("create") ;
					} ;
				
					//table数据处理
					var tableDataHandle = function(params){
							//添加table数据	
							$(this).customAjax(''+config.basePath+config.searchDeviceByZone , params , function(flag , data){
									if('success' === flag){
										//渲染分页，table数据使用callback回调函数渲染
										ChintPlugins.pageBreakPlugin.init(chintBodyMain.find('span'),data,{pageCount:2}).render(renderTblOptionTable) ;
									}
							}) ;
					} ;
					
					//公共table表头信息
					var commonTableHeader = function(tableId , array){
							var htmlDom = '' ;
								  htmlDom += '<table id="'+tableId+'Table" data-role="table" data-column-btn-theme="b" data-column-popup-theme="a" data-mode="" class="table-stroke">' ;
								  htmlDom +=		 '<thead><tr class="th-groups"><th style="width:4.15em;">'+array[0]+'</th><th style="width:4.15em;">'+array[1]+'</th>' ;
								  htmlDom += 		'<th style="width:4.15em;">'+array[2]+'</th><th style="width:4.15em;">'+array[3]+'</th></tr></thead>' ;
								  htmlDom += 		'<tbody></tbody>' ;
								  htmlDom += 	'</table>' ;
							return htmlDom ;
					} ;
					
					//渲染table通用方法
					var commonTable = function(domId , array , url , params , callback){
							$(chintBodyMain).find("#"+domId).after(commonTableHeader(""+domId , array)) ;
							$(chintBodyMain).trigger("create") ;
							if(null == url && null == params){
								callback({} , domId) ;
								return ;						
							} ;
							$(this).customAjax(url , params , function(flag , data){
									callback(data.data , domId) ;
							}) ;
					} ;
					
					//渲染用户信息table
					var renderUserInfoTable = function(){
							commonTable("userInfo" , ["用户姓名" , "证件类型" , "用户状态" , "用户类型"] , config.basePath+config.customerDetail , {deviceid : accountManage.changeDivice.deviceid } , renderUserInfoTr) ;
					} ;
					
					//渲染用户信息table内容
					var renderUserInfoTr = function(data , domId){
							var fragment = document.createDocumentFragment();
							changeConfirmAccountid = data.accountid ;
							var optionTable = $(chintBodyMain).find("#"+domId+"Table tbody") ;
							var tr = $("<tr><td  style='border:0;'>"+data.ownername+"</td><td  style='border:0;'>"+data.pidcardtypename+"</td>"+
							"<td  style='border:0;'>"+$.parseTribleValue(data.state , "开户" , "停户" , "销户")+"</td><td  style='border:0;'>"+data.typename+"</td></tr>"+
							"<tr><td  style='font-weight:bold ;border:0;'>用户编号</td><td colspan='3'  style='border:0;'>"+data.accountno+"</td></tr>"+
							"<tr><td  style='font-weight:bold ;border:0;'>证件号码</td><td colspan='3'  style='border:0;'>"+data.pidcardno+"</td></tr>"+
							"<tr><td  style='font-weight:bold ;border:0;'>手机</td><td  style='border:0;'>"+data.mobileno+"</td><td  style='font-weight:bold ;border:0;'>固定电话</td>"+
							"<td  style='border:0;'>"+data.telno+"</td></tr>"+
							"<tr><td  style='font-weight:bold ;'>联系地址</td><td colspan='3'>"+data.address+"</td></tr>") ;
							tr.each(function(index){
									fragment.append(this) ;
							}) ;
							optionTable.append(fragment).trigger("create") ;
					} ;
					
					//渲染当前表具table
					var currentDeviceTable = function(){
							changeConfirmDeviceid = accountManage.changeDivice.deviceid ;
							commonTable("currentDevice" , ["设备名称" , "设备种类" , "计费模式" , "透支额度"] , config.basePath+config.deviceDetail , {deviceid : changeConfirmDeviceid } , renderDeviceTable) ;
					} ;
					
					//渲染表具table内容
					var renderDeviceTable = function(data , domId){
							var fragment = document.createDocumentFragment();
							var optionTable = $(chintBodyMain).find("#"+domId+"Table tbody") ;
							var tr = $("<tr><td name='devicename'  style='border:0;'>"+$.parseVoidValue(data.devicename)+"</td><td name='devicetypename'  style='border:0;'>"+$.parseVoidValue(data.devicetypename)+"</td>"+
							"<td name='chargemode'  style='border:0;'>"+$.parseDoubleValue(data.chargemode , "后付费" , "预付费")+"</td><td name='creditamount'  style='border:0;'>"+$.parseVoidValue(data.creditamount)+"</td></tr>"+
							"<tr><td  style='font-weight:bold ;border:0;'>设备编号</td><td name='devicecode' colspan='3'  style='border:0;'>"+$.parseVoidValue(data.devicecode)+"</td></tr>"+
							"<tr><td  style='font-weight:bold ;border:0;'>设备型号</td><td name='devicemodelname' colspan='3'  style='border:0;'>"+$.parseVoidValue(data.devicemodelname)+"</td></tr>"+
							"<tr><td  style='font-weight:bold ;border:0;'>系统计费</td><td name='syschargeflag'  style='border:0;'>"+$.parseDoubleValue(data.syschargeflag , "是" , "否")+"</td><td  style='font-weight:bold ;border:0;'>安全停气</td>"+
							"<td name='safeshutflag'  style='border:0;'>"+$.parseDoubleValue(data.safeshutflag , "是" , "否" )+"</td></tr>"+
							"<tr><td  style='font-weight:bold ;'>安装地址</td><td name='deviceaddress' colspan='3'>"+$.parseVoidValue(data.deviceaddress)+"</td></tr>") ;
							tr.each(function(index){
									fragment.append(this) ;
							}) ;
							optionTable.append(fragment).trigger("create") ;
					}
					
					//渲染待换表具table内容
					var renderTblOptionTable = function(data){
							var fragment = document.createDocumentFragment();
							var optionTable = $(chintBodyMain).find('#waitDeviceTable tbody') ;
							optionTable.empty() ;//先清空table中的内容再渲染table
							data.rows.forEach(function(data,index){
									var tr= $("<tr name="+index+"><td  style='border:0;'>"+data.devicename+"</td><td  style='border:0;'>"+$.parseDoubleValue(data.usestate , "已开户" , "未开户")+"</td>"+
												"<td  style='border:0;'>"+$.parseDoubleValue(data.chargemode , "后付费" , "预付费")+"</td><td  style='border:0;'>"+$.parseDoubleValue(data.syschargeflag , "系统计费" , "表具计费" )+"</td></tr>"+
												"<tr name="+index+"><td style='font-weight:bold ;border:0;'>设备编号</td><td  colspan='3' style='border:0;'>"+data.devicecode+"</td></tr>"+
												"<tr name="+index+"><td style='font-weight:bold ;'>安装地址</td><td  colspan='3'>"+data.address+"</td></tr><tr name="+index+"/>") ;
									tr.each(function(index){
											fragment.appendChild(this) ;
											tablePlugin.trColorSetting(this,index,{total:3,tds:[1,3]} , true) ;//行点击效果
									}) ;
									$(tr[tr.length-1]).attr("userData" , JSON.stringify(data.deviceid)) ;
									tr.on("click" , function(){
											var name = $(this).attr("name") ;
											var tr = $(this).parent().find("tr[name='"+name+"']") ;
											var deviceid = JSON.parse($(tr[tr.length-1]).attr("userdata")) ;
											changeConfirmNewdeviceid = deviceid ;
											$(this).customAjax(''+config.basePath+config.deviceDetail , { deviceid : deviceid } , function(flag , userData){
														var tds = $(chintBodyMain).find("#replaceDeviceTable tbody tr td") ;
														changeConfirmMode = userData.data.chargemode ;
														tds.each(function(index , data){
																var name = $(data).attr("name") ;
																var value = userData.data[name] ;
																if(!data.style['font-weight']){
																		switch(name){
																				case "chargemode" : value = $.parseDoubleValue( value , "后付费" , "预付费") ;
																						break ;
																				case "syschargeflag" : value = $.parseDoubleValue( value , "是" , "否" ) ;
																						break ;
																				case "safeshutflag" : value = $.parseDoubleValue( value , "是" , "否" );
																						break ;
																				default : ;
																		}
																		data.innerText = value ;
																}
														}) ;
											}) ;
									}) ;									
							}) ;
							optionTable.append(fragment).trigger("create") ;
					} ;
					
					//渲染替换表具table
					var replaceTable = function(){
							commonTable("replaceDevice" , ["设备名称" , "设备种类" , "计费模式" , "透支额度"] , null , null , renderDeviceTable) ;
					} ;
					
					//收费信息dom操作
					var chargeInfoOption = function(){
							var inputs = chintBodyMain.find("#chargeInfoDiv .chintInput") ;
							var transmoney1 = inputs.filter("#transmoney1") ;
							var transmoney2 = inputs.filter("#transmoney2") ;
							var transmoney = inputs.filter("#transmoney") ;
							inputs.on( "change"  , function(){
									if( "" != transmoney1.val() && "" != transmoney2.val() ){
											 transmoney.val( (parseFloat( transmoney1.val() ) + parseFloat( transmoney2.val()) ).toFixed(2) ) ;
									}else{
											transmoney.val("") ;
									}
							}) ;
							//只能输入小数
							$.floatNumberInput(inputs) ;
					} ;
					
					//换表操作
					var changeDevice = function(){
							var oParams = {} ;
							var oChargeInfo = chintBodyMain.find("#chargeInfoDiv") ;
							var oInputs = oChargeInfo.find(".chintInput") ;
							oInputs.each(function(index , dom){
									oParams[ dom.name] = dom.value ;
							}) ;
							radioPlugin.setParams( oParams , oChargeInfo.find(".ui-collapsible") ) ;
							oParams.deviceid = changeConfirmDeviceid ;
							oParams.accountid = changeConfirmAccountid ;
							oParams.newdeviceid = changeConfirmNewdeviceid ;
							oParams.mode = changeConfirmMode ;
							for( var _value in oParams ){
									if( "" === oParams[_value] ){
										$.fadeInPlugin("收费信息未填写或者未选择待换表具!!!") ;
										return false ;
									}
							}
							$(this).customAjax(''+config.basePath+config.changeDeviceConfirm , oParams  , function(flag , data){
									if("success" ==  flag ){
											$.fadeInPlugin("换表操作成功") ;
									}else if( "error" == flag){
											$.fadeInPlugin("换表操作失败!或者所换表具曾被当前用户使用!") ;
									}
							}) ;
					} ;
					
					//换表取消操作
					var quitChangeDevice = function(){
							require.config( {baseUrl: config.modulePath} ) ;
							require(["gasTblcustomer/list"], function (module){
									module.init() ;
							}) ;
					} ;
					
					//换表、取消操作
					var changeDeviceOption = function(){
							var oButtonGroup = chintBodyMain.find("#buttonGroup button") ;
							var oChangeBtn = $( oButtonGroup[0] ) ;
							var oQuitBtn = $( oButtonGroup[1] ) ;
							oChangeBtn.on( "click" , changeDevice ) ;
							oQuitBtn.on( "click" , quitChangeDevice ) ;
					} ;
				
					;(function(){
							$.emptyInnerPanel() ;//清空chintBodyPanel中的内容
							var chintMainInnerHtml   =  ''  ;
										  chintMainInnerHtml += '<h2 id="userInfo">用户信息</h2>' ;
										  chintMainInnerHtml += '<h2 id="currentDevice" style="margin-top:1em;">当前表具</h2>' ;
										  chintMainInnerHtml += '<h2 style="margin-top:1em;">待换表具</h2>' ;
										  chintMainInnerHtml += '<table id="waitDeviceTable" data-role="table" data-column-btn-theme="b" data-column-popup-theme="a" data-mode="" class="table-stroke">' ;
									      chintMainInnerHtml += 		'<thead><tr class="th-groups"><th style="width:4.15em;">设备名称</th><th style="width:4.15em;">开户状态</th>' ;
									      chintMainInnerHtml += 		'<th style="width:4.15em;">计费模式</th><th style="width:4.15em;">系统计费</th></tr></thead>' ;
									  	  chintMainInnerHtml +=		 '<tbody></tbody>' ;
									  	  chintMainInnerHtml += '</table>' ;
									  	  chintMainInnerHtml += '<span style="float:right;"></span>'  ;
										  chintMainInnerHtml += '<h2 id="replaceDevice" style="margin-top:2em;">替换表具信息</h2>' ;
										  chintMainInnerHtml += '<h2 style="margin-top:1em;">收费信息</h2>' ;
										  chintMainInnerHtml += '<div id="chargeInfoDiv"/>' ;
										  chintMainInnerHtml += '<div id="buttonGroup">' ;
										  chintMainInnerHtml += 		'<button class="confirm-button" style="float:left;width:48%;">换表</button>' ;
										  chintMainInnerHtml += 		'<button class="cancel-button" style="float:left;width:48%;margin-left:4%;">取消</button>' ;
										  chintMainInnerHtml += '</div>' ;
							chintBodyMain.append(chintMainInnerHtml).trigger("create") ;
							tableDataHandle({usestate : 0 , zoneid : accountManage.changeDivice.zoneid}) ;
							userInfoFrame() ;//添加用户信息HTML内容
							renderUserInfoTable() ;//将用户信息dom结构改为table实现
							currentDeviceTable() ;//渲染待换表具table的dom结构
							replaceTable() ;//渲染替换表信息dom结构
							chargeInfoOption() ;//收费信息dom操作
							changeDeviceOption() ;//换表、取消按钮点击事件
					})() ;
		} ;
		return {init : list} ;
}) ;