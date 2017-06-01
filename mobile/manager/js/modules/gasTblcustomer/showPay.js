define(function (){
　　　　var showPay = function (){
					var inputPlugin = chintPlugins.inputPlugin ;
					var radioPlugin = chintPlugins.radioPlugin ;
					var paramData = { filterPanel : {
																inputs : [ {label:'用户户号',name:'accountno'} , {label:'用户姓名',name:'ownername'} , 
																				{label:'证件号码',name:'pidcardno'} , {label:'手机',name:'mobileno'}] ,
																collasibleRadios : [{data : [{text : "全部" , id : " " } , {text : "是" , id : "1" } , {text : "否" , id : "0" }] , 
																								options : {title:'是否欠费' ,  id:'arrearageFlag' , height : '8.2em' }},
																								{data : [{text : "全部" , id : " " } , {text : "是" , id : "1" } , {text : "否" , id : "0" }] , 
																								options : {title:'是否卡表' ,  id:'usecard' , height : '8.2em' }},
																								{data : [{text : "全部" , id : " " } , {text : "后付费" , id : "1" } , {text : "预付费" , id : "0" }] , 
																								options : {title:'付费模式' ,  id:'chargemode' , height : '8.2em' }},
																								{data : [{text : "全部" , id : " " } , {text : "金额表" , id : "1" } , {text : "气量表" , id : "0" }] , 
																								options : {title:'计量模式' ,  id:'runmode' , height : '8.2em' }}]
													} ,
													rechargePanel : {
																inputs : [ {label:'户号',name:'accountno', readonly : true} , {label:'用户名',name:'ownername', readonly : true} ,
																				{label:'计量模式',name:'runmode', readonly : true} , {label:'付费模式',name:'chargemode', readonly : true} ,
																				{label:'账户余额',name:'balance', readonly : true} ] ,
																amountInputs : [{label:'充值金额',name:'transmoney'}] ,
																gasInputs : [{label:'剩余气量(m³)',name:'balancegas', readonly : true} , {label:'定价模式',name:'pricemode', readonly : true} ,
																					{label:'本期已用(m³)',name:'lastamount', readonly : true} , {label:'冲入气量(m³)',name:'gasamountval'} ,
																					{label:'充入金额(元)',name:'transmoneyval'}] ,
																collasibleRadios : [{data : [{text : "现金" , id : " " } , {text : "银行卡" , id : "1" } , {text : "微信" , id : "0" } , {text : "支付宝" , id : "0" }] , 
																								options : {title:'支付方式' ,  id:'paymode' , height : '8.2em' }}]
													} ,
													reissuePanel : {
																inputs : [ {label:'户号',name:'accountno', readonly : true} , {label:'用户名',name:'ownername', readonly : true} ,
																				{label:'计量模式',name:'runmode', readonly : true} ] ,
																gasInputs : [ {label:'剩余气量',name:'balancegas', readonly : true} ,{label:'补发气量',name:'gasamount'} ] ,
																amountInputs : [ {label:'账户余额',name:'balance', readonly : true} ,{label:'补发金额',name:'transmoney'} ]
													}
													} ;
					//table数据处理
					var tableDataHandle = function(params){
							loading.show() ;
							//添加table数据
							$.customAjax(''+config.basePath+config.dataListPay , params , function(flag , data){
									if('success' === flag){
										//渲染分页，table数据使用callback回调函数渲染
										chintPlugins.pageBreakPlugin.init(chintBodyMain.find('span'),data,{pageCount:5}).render(renderTblOptionTable) ;
									}
									loading.hide() ;
							}) ;
					} ;
					
					//渲染菜单管理table
					var renderTblOptionTable = function(data){
							var fragment = document.createDocumentFragment();
							var optionTable = $(chintBodyMain).find('table tbody') ;
							optionTable.empty() ;//先清空table中的内容再渲染table
							data.rows.forEach(function(data,index){
									var balancegas = $.parseVoidValue( data.balancegas , "0" ) ; 
									var balance = $.parseVoidValue( data.balance , "0" ) ; 
									(1 == data.syschargeflag ) ? ( balancegas += "m³") : ( balance += "元") ;
									var tr = $("<tr><td  style='border:0;'>"+data.ownername+"</td><td  style='border:0;'>"+data.typename+"</td>"+
													"<td  style='border:0;'>"+((1 == data.syschargeflag ) ? balancegas : balance)+"</td><td  style='border:0;'>"+((data.arrearageFlag<0 ) ? "是" : "否")+"</td></tr>"+
													"<tr><td  style='font-weight:bold ;border:0;'>户号</td><td colspan='3'  style='border:0;'>"+data.accountno+"</td></tr>"+
													"<tr><td  style='font-weight:bold ;border:0;'>手机</td><td colspan='3'  style='border:0;'>"+data.mobileno+"</td></tr>"+
													"<tr><td  style='font-weight:bold ;border:0;'>用户表具</td><td colspan='3'  style='border:0;'>"+data.devicenames+"</td></tr>"+
													"<tr><td  style='font-weight:bold ;border:0;'>付费模式</td><td style='border:0;'>"+$.parseDoubleValue(data.chargemode , "后付费" , "预付费")+"</td>"+
													"<td  style='font-weight:bold ;border:0;'>卡表</td><td style='border:0;'>"+$.parseDoubleValue(data.usecard , "是" , "否")+"</td></tr>"+
													"<tr><td  style='font-weight:bold ;border:0;'>所属区域</td><td colspan='3'  style='border:0;'>"+data.zonename+"</td></tr>"+
													"<tr><td  style='font-weight:bold ;border:0;'>计量模式</td><td style='border:0;'>"+$.parseDoubleValue( data.runmode , "金额表" , "气量表" )+"</td>"+
													"<td  style='font-weight:bold ;border:0;'>证件类型</td><td  style='border:0;'>"+data.pidcardtypename +"</td></tr>"+
													"<tr><td  style='font-weight:bold ;border:0;'>证件号码</td><td colspan='3'  style='border:0;'>"+data.pidcardno+"</td></tr>"+
													"<tr><td  style='font-weight:bold;"+((0 == data.usecard)?"border:0;":"")+"'>地址</td><td colspan='3' style='"+((0 == data.usecard)?"border:0;":"")+"'>"+data.address+"</td></tr>"+
												  "<tr>"+
												  ((0 == data.usecard) ? "<td/><td colspan='3'>"+
												  "<div role='navigation' class='ui-navbar' data-role='navbar' data-iconpos='left'>"+
													"<ul class='ui-grid-a'>"+
															"<li class='ui-block-a'><button class='ui-btn ui-icon-edit ui-btn-icon-left green-3' data-icon='edit'>充值缴费</button></li>"+
															"<li class='ui-block-b'><button class='ui-btn ui-icon-recycle ui-btn-icon-left blue-3' data-icon='recycle'>补发</button></li>"+
													"</ul></div>"+
												  "</td>" : "")+
												  "</tr>") ;
									tr.each(function(index){
										fragment.appendChild(this) ;
										chintPlugins.tablePlugin.trColorSetting(this,index,{total:9,tds:[1,3]} , true) ;//行点击效果
									}) ;
									$(tr[tr.length-1]).attr("userData" , JSON.stringify(data) ) ;
									navigationOperation(tr) ;
							}) ;
							optionTable.append(fragment).trigger("create") ;
					} ;
					
					//点击过滤条件标签显示过滤条件filterPanel并清空filterPanel中组件的内容
					var clickFilterConditionEle = function(){
							//显示过滤查询panel
							$(chintBodyMain).find('#filterConditionElement').on('click',function(){
									filterPanel.find("input").val("") ;
									radioPlugin.reRenderRadioIcons( filterInner.find(".ui-collapsible") , "") ;
									filterPanel.panel().panel("open");
							}) ;
					} ;
					
					//添加过滤查询panel内容
					var renderFilterPanel = function(){
							var fragment = document.createDocumentFragment();
							fragment.appendChild($("<label>过滤条件</label>")[0]) ;
							paramData.filterPanel.inputs.forEach(function(data , index){
										fragment.appendChild( inputPlugin.init( null , {} , {labelName : data.label , id : data.name , name : data.name } ).render() ) ;
							}) ;
							radioPlugin.renderCollasibleRadio( paramData.filterPanel.collasibleRadios , fragment ) ;//绘制下拉单选组件
							fragment.appendChild($("<div id='filterZoneTree'/>")[0]) ;	//区域列表树
							var button = $("<button class='confirm-button'>确认</button>") ;
							button.on("click" , function(){
										$.queryContext( filterInner , filterPanel , tableDataHandle ) ;
							}) ;
							fragment.appendChild(button[0]) ;
							filterInner.append(fragment).trigger("create") ;
					} ;
					
					//充值缴费确认操作
					var rechargeConfirm =function(){
							var rechargeParams = JSON.parse( $(this).attr("rechargeParams") ) ;
							var syschargeflag = $(this).attr("syschargeflag") ;
							rechargeParams.transmoney  = modifyInner.find("#transmoney").val() ;
							var tds = modifyInner.find( "td" ) ;
							tds.each(function( index , dom ){
									rechargeParams[dom.id] =  dom.innerText ;
							}) ;
							var inputs = modifyInner.find(".chintInput") ;
							if( 0 == syschargeflag && !inputs[inputs.length-1].value ){
									$.fadeInPlugin("请填写有效金额.") ;
									return ;
							}else if(!inputs[inputs.length-2].value && !inputs[inputs.length-2].value ){
									$.fadeInPlugin("请输入充值金额/气量.") ;
									return ;
							}
							$.customAjax(''+config.basePath+config.saveBalance , rechargeParams , function(flag , data){
										setTimeout( function(){ modifyPanel.panel().panel("close") } , 500) ;
										tableDataHandle({rows:1000}) ;
										$.fadeInPlugin( data.msg ) ;
							}) ;
					} ;
					
					//金额表充值缴费panel渲染	
					var amountPanel = function( fragment ){
							fragment.appendChild($("<label>金额表充值缴费</label>")[0]) ;
							paramData.rechargePanel.inputs.concat(paramData.rechargePanel.amountInputs).forEach(function(data , index){
										if( "transmoney" == data.name){
													radioPlugin.renderCollasibleRadio( paramData.rechargePanel.collasibleRadios , fragment ) ;//绘制下拉单选组件
										}
										fragment.appendChild( inputPlugin.init( null , {} , {labelName : data.label , id : data.name , name : data.name , readonly : data.readonly } ).render() ) ;
							}) ;
					} ;
					
					//设置modifyInner中table的内容为空
					var setModifyTable = function(data){
							var trs = modifyInner.find("table tbody tr") ;
							var tds = trs.find("td") ;
							trs.each(function(i){
									var index = (0== i ? "" : i) ;
									tds.filter("#transmoney"+index).text( undefined==data ? "" : data["transmoney"+index ]) ;
									tds.filter("#gasamount"+index).text( undefined==data ? "" : data["gasamount"+index ]) ;
							}) ;
					}
					
					//气量表计算费用
					var caculateCost = function(){
							var params = JSON.parse( $(this).attr("caculateParams") ) ;
							params.transmoney = modifyInner.find("#transmoneyval").val() ;
							params.gasamount = modifyInner.find("#gasamountval").val() ;
							if( 0 == params.transmoney.length && 0 == params.gasamount){
									setModifyTable() ;
									return false ;
							}
							$.customAjax(''+config.basePath+config.calculateGasMoney , params , function(flag , data){
									setModifyTable(data.data) ;
							}) ;
					} ;
					
					//气量表充值panel渲染		gasInputs
					var gasMeter = function( fragment ){
							fragment.appendChild($("<label>气量表充值缴费</label>")[0]) ;
							paramData.rechargePanel.inputs.concat(paramData.rechargePanel.gasInputs).forEach(function(data , index){
										if( "gasamountval" == data.name ){
													radioPlugin.renderCollasibleRadio( paramData.rechargePanel.collasibleRadios , fragment ) ;//绘制下拉单选组件
										}
										fragment.appendChild( inputPlugin.init( null , {} , {labelName : data.label , id : data.name , name : data.name , readonly : data.readonly } ).render() ) ;
							}) ;
							var button = $("<button name='caculate'>计算</button>") ;
							button.on( "click" , caculateCost ) ;
							fragment.appendChild(button[0]) ;
							var table = $("<table data-role='table' data-column-btn-theme='b' data-column-popup-theme='a' data-mode='' class='table-stroke'>"+
												"<thead><tr class='th-groups'><th style='font-size:10px;'>计算结果</th><th style='font-size:10px;'>价格(元/m³)</th><th style='font-size:10px;'>"+
												"金额(元)</th><th style='font-size:10px;'>气量(m³)</th></tr></thead>"+
												"<tbody></tbody>"+
												"</table>") ;
							fragment.appendChild( table[0] ) ;
					} ;
					
					//设置充值缴费参数,异步调用中会有ajax获取的到的数据无法存入params对象,用generator解?
					var setRechargeParams = function(userdata){
							var maxamount = null ;
							var minamount = null ;
							var balance = null ;
							var gasamount = null ;
							$.customAjax(''+config.basePath+config.getAccountPayId , {accountid : userdata.accountid , deviceid : userdata.deviceid } , function(flag , data){
									maxamount = data.data.maxamount;//最大充值限额
									minamount = data.data.minamount;//最小充值限额	
									balance = data.data.balance;//账户剩余金额
									gasamount = data.data.gasamount;//账户剩余气量	
							}) ;
							var params =  { accountid : userdata.accountid , deviceid : userdata.deviceid , usecard : userdata.usecard , accountno : userdata.accountno ,
													ownername : userdata.ownername , paymode : 1 , runmode : userdata.runmode , 
													chargemodename : $.parseDoubleValue( userdata.chargemode , "后付费" , "预付费") ,
													balance : userdata.balance , chargemode : userdata.chargemode , cardType : (userdata.cardType == 1 ? 0 : 1) } ;
							return params ;
					} ;
					
					//金额表modifyInner内容回显
					var reRenderModifyInner = function( userdata , button){
							var inputs = modifyInner.find(".chintInput") ;
							inputs.each(function( index , dom ){
										var value = userdata[dom.name] ;
										if( "chargemode" == dom.name){
												value =  $.parseDoubleValue(value , "后付费" , "预付费" ) ; ;
										}
										if( "runmode" == dom.name){
												value =  $.parseDoubleValue(value , "金额表" , "气量表" ) ; ;
										}
										if(0 !== value && undefined == userdata[dom.name]) value = "" ;
										dom.value = value ;
							}) ;
							var transmoney = inputs.filter("#transmoney") ;
							$.floatNumberInput( transmoney ) ;//只能输入小数点后两位的浮点数
							var pricemode = inputs.filter("#pricemode") ;
							pricemode.val("单阶") ;
							//设置充值缴费参数
							var params = setRechargeParams( userdata ) ;
							button.attr( "rechargeParams" , JSON.stringify( params ) ) ;
							button.attr("syschargeflag" , userdata.syschargeflag) ;
							//气量表panel中标签值渲染
							if(	0 == userdata.runmode	){
									var caculateButton = modifyInner.find("button[name='caculate']") ;
									caculateButton.attr("caculateParams" , JSON.stringify({ accountid : userdata.accountid , deviceid : userdata.deviceid}) ) ;
									//为冲入气量和冲入金额绑定只能输入小数点后两位的浮点数事件
									var transmoney = modifyInner.find("#transmoneyval") ;
									var gasamount = modifyInner.find("#gasamountval") ;
									$.floatNumberInput( transmoney ) ;
									$.floatNumberInput( gasamount ) ;
									$.choseOnlyOne(  gasamount , transmoney ) ;//气量和金额只能有一个可以进行输入
									$.customAjax(''+config.basePath+config.getGasMeterPrice , {accountid : userdata.accountid , deviceid : userdata.deviceid } , function(flag , data){
												var trData = data.data ;
												var total = parseInt( trData.stepAmount ) ;
												var fragment = document.createDocumentFragment();
												modifyInner.find("#lastamount").val(data.data.lastamount) ;
												var tbody = modifyInner.find("tbody") ;
												for( var i=1 ; i < total+1 ; i++ ){
														fragment.appendChild($("<tr><td style='font-size:10px;'>"+i+"阶("+(1==i ? 0 : trData["step"+i])+"-"+trData["step"+(i+1)]+"m³)</td>"+
																	"<td>"+trData["price"+i]+"</td><td id='transmoney"+i+"'/><td id='gasamount"+i+"'/></tr>")[0]) ;
												}
												var totalTr = $("<tr><td>合计</td><td>"+trData.stepAmount+"阶</td><td id='transmoney'/><td id='gasamount'/></tr>") ;
												fragment.appendChild( totalTr[0] ) ;
												tbody.append( fragment ) ;
									}) ;
							}
					} ;
					
					//充值缴费panel,并设置info信息
					var rechargeFunction = function(){
							var userdata = JSON.parse( $(this).closest("tr").attr("userdata") ) ;
							modifyInner.empty() ;
							var fragment = document.createDocumentFragment();
							(1 == userdata.runmode) ? amountPanel( fragment ) :  gasMeter(fragment) ;//根据runmode判断是金额表还是气量表
							var button = $("<button class='confirm-button'>确定</button>") ;
							button.on( "click" , rechargeConfirm ) ;
							fragment.appendChild(button[0]) ;
							modifyInner.append(fragment).trigger("create") ;
							reRenderModifyInner(userdata , button) ;
							modifyPanel.panel().panel("open");
					} ;
					
					//补发操作确认
					var reissueConfirm = function(){
							var reIssueParams = JSON.parse( $(this).attr("reIssueParams") ) ;
							var inputs = modifyInner.find(".chintInput") ;
							inputs.each(function( index , dom){
										if( "runmode" != dom.name ){
													reIssueParams[dom.name] = dom.value ;
										}
							}) ;
							if(!inputs[inputs.length-1].value){
										$.fadeInPlugin("请填写补气金额/气量") ;
										return ;
							}							
							$.customAjax(''+config.basePath+config.supplementGas , reIssueParams , function(flag , data){
										setTimeout( function(){ modifyPanel.panel().panel("close") } , 500) ;
										tableDataHandle({rows:1000}) ;
										$.fadeInPlugin( data.msg ) ;
							}) ;
					} ;
					
					//补发panel内容反显
					var reRenderReissue = function( userdata ){
							var inputs = modifyInner.find(".chintInput") ;
							inputs.each(function( index , dom ){
									dom.value = userdata[dom.name] ;
									if( "runmode" == dom.name){
											dom.value = $.parseDoubleValue( userdata[dom.name] , "金额表" , "气量表" )
									}
							}) ;
					} ;
					
					//获取非零参数并将null和undefined转换为""
					var valueParse = function(data){
							if(!data){
									return data===0 ? 0 : "" ;
							}else{
									return data ;
							}
					} ;
					
					//补发
					var reissueFunction = function(){
							var userdata = JSON.parse( $(this).closest("tr").attr("userdata") ) ;
							var array = [] ;
							array = array.concat( paramData.reissuePanel.inputs ) ;
							modifyInner.empty() ;
							var fragment = document.createDocumentFragment();
							fragment.appendChild($("<label>补发</label>")[0]) ;
							( 0 == userdata.syschargeflag ) ? ( array = array.concat( paramData.reissuePanel.amountInputs ) ) : ( array = array.concat( paramData.reissuePanel.gasInputs )) ;
							array.forEach(function(data , index){
										fragment.appendChild( inputPlugin.init( null , {} , {labelName : data.label , id : data.name , name : data.name , readonly : data.readonly } ).render() ) ;
							}) ;
							var reIssueParams = { accountid : valueParse( userdata.accountid ) , deviceid : valueParse( userdata.deviceid ) , usecard : valueParse( userdata.usecard ) , 
										 accountno : valueParse( userdata.accountno ) , ownername : valueParse( userdata.ownername ) , cardno : valueParse( userdata.cardno ) , 
										 cardType : valueParse( userdata.cardType ) , chargeTimes : valueParse( userdata.chargeTimes ) ,runmode : valueParse( userdata.runmode ) ,
										 balance : valueParse( userdata.balance ) , balancegas : valueParse( userdata.balancegas ) , transmoney : valueParse( userdata.transmoney ) ,
										 gasamount : valueParse( userdata.gasamount )} ;
							var button = $("<button class='confirm-button'>确定</button>") ;
							button.on( "click" , reissueConfirm) ;
							button.attr( "reIssueParams" , JSON.stringify(reIssueParams)) ;
							fragment.appendChild(button[0]) ;
							modifyInner.append(fragment).trigger("create") ;
							reRenderReissue(userdata) ;
							modifyPanel.panel().panel("open");
					} ;
					
					//添加table导航栏功能
					var navigationOperation = function(tr){
							//充值缴费
							var rechargeOption = tr.find(".ui-icon-edit")  ;
							rechargeOption.on( "click" , rechargeFunction ) ;
							
							//补发
							var reissueOption = tr.find(".ui-icon-recycle") ;
							reissueOption.on( "click" , reissueFunction ) ;
					} ;

					;(function(){
							$.emptyInnerPanel() ;//清空chintBodyPanel中的内容
							var chintMainInnerHtml   =  ''  ;
								  chintMainInnerHtml += '<h2 id="userInfo">充值缴费</h2>' ;
								  chintMainInnerHtml += '<a id="filterConditionElement" href="#" data-ajax="false" style="float:right;margin-top:-3em;">过滤条件</a>' ;
								  chintMainInnerHtml += '<table id="waitDeviceTable" data-role="table" data-column-btn-theme="b" data-column-popup-theme="a" data-mode="" class="table-stroke">' ;
							      chintMainInnerHtml += 		'<thead><tr class="th-groups"><th style="width:4.15em;">用户名</th><th style="width:4.15em;">用户类型</th>' ;
							      chintMainInnerHtml += 		'<th style="width:4.15em;">账户余额</th><th style="width:4.15em;">是否欠费</th></tr></thead>' ;
							  	  chintMainInnerHtml +=		 '<tbody></tbody>' ;
							  	  chintMainInnerHtml += '</table>' ;
							  	  chintMainInnerHtml += '<span style="float:right;"></span>'  ;
							chintBodyMain.append(chintMainInnerHtml).trigger("create") ;
							tableDataHandle({rows:1000}) ;//渲染充值缴费table内容
							clickFilterConditionEle() ;		//点击过滤条件标签打开过滤panel
							renderFilterPanel() ;		//渲染过滤条件panel
					})() ;
　　　　};
　　　　return {
　　　　　　init: showPay
　　　　};
});