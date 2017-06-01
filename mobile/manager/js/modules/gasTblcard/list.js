define(function (){
　　　　var list = function (){
					var inputPlugin = chintPlugins.inputPlugin ;
					var radioPlugin = chintPlugins.radioPlugin ;
					var paramData = { filterPanel : {
																inputs : [ {label:'户号',name:'accountNo'} , {label:'用户名',name:'ownerName'} , 
																				{label:'表号',name:'deviceCode'} , {label:'卡号',name:'cardNo'}] ,
																collasibleRadios : [{data : [{text : "全部" , id : " " } , {text : "是" , id : "1" } , {text : "否" , id : "-1" }] , 
																								options : {title:'是否有卡' ,  id:'hasCard' , height : '8.2em' }}]
													} , 
													modifyPanel : {
																inputs : [ {label:'户号',name:'accountNo' , readonly : true } , {label:'户名',name:'ownerName' , readonly : true } , 
																				{label:'用户表具',name:'deviceName' , readonly : true } , {label:'计量模式',name:'runMode' , readonly : true } , 
																				{label:'卡号',name:'cardNo' , readonly : true } , {label:'卡状态',name:'state' , readonly : true } ,
																				{label:'卡类型',name:'cardType' , readonly : true } , {label:'补卡次数',name:'remakeTimes' , readonly : true } , 
																				{label:'购气次数',name:'chargeTimes' , readonly : true }]
													} , 
													cardManage : {
																forbiddenCard : {
																			options :  {h1:'挂失',h3:'确认挂失？',a0:'确定',a1:'取消'}
																} , 
																deleteCard : {
																			options :  {h1:'回收',h3:'确认回收该卡？',a0:'确定',a1:'取消'}
																}
													}} ;
													
					//组件动态数据列表
					var collapsibleDataHandle = function(){
							//选择区域数据列表
							$.customAjax(''+config.basePath+config.baseTblZoneTree , {showEmptyNode:0,keyId:''} , function(flag , data){
										var zoneTree = $("#filterZoneTree").empty() ;
										var filterPlugin = chintPlugins.radioPlugin.init(null , data , {title:'区域选择' ,  id:'zoneID' , height : '8.2em' }).radioIconsRender( ) ;
										zoneTree.append(filterPlugin) ;
										zoneTree.trigger("create") ;
							}) ;
					} ;
					
					//table数据处理
					var tableDataHandle = function(params){
							//添加table数据
							$.customAjax(''+config.basePath+config.gasTblcardDataList , params , function(flag , data){
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
									var tr = $("<tr><td  style='border:0;'>"+data.ownerName+"</td><td  style='border:0;'>"+data.zoneName+"</td>"+
									"<td  style='border:0;'>"+$.parseDoubleValue(data.runMode , "金额表" , "气量表" )+"</td><td  style='border:0;'>"+$.parseValue(data.cardType , "SLE4442卡" , "M1射频卡")+"</td></tr>"+
									"<tr><td  style='font-weight:bold ;border:0;'>户号</td><td colspan='3'  style='border:0;'>"+data.accountNo+"</td></tr>"+
									"<tr><td  style='font-weight:bold ;border:0;'>用户表具</td><td colspan='3'  style='border:0;'>"+data.deviceName+"</td></tr>"+
									"<tr><td  style='font-weight:bold ;border:0;'>是否有卡</td><td style='border:0;'>"+$.parseMinusPlusDouble(data.hasCard, "是" , "否")+"</td><td  style='font-weight:bold ;border:0;'>卡状态"+
									"</td><td style='border:0;'>"+$.parseTribleWithT(data.state , "正常" , "挂失" , "销卡" )+"</td></tr>"+
									"<tr><td  style='font-weight:bold ;border:0;'>卡号</td><td colspan='3'  style='border:0;'>"+data.cardNo+"</td></tr>"+
									"<tr><td  style='font-weight:bold ;border:0;'>创建时间</td><td colspan='3'  style='border:0;'>"+data.createDate+"</td></tr>"+
									"<tr><td  style='font-weight:bold ;border:0;'>补卡次数</td><td  style='border:0;'>"+data.remakeTimes+"</td><td  style='font-weight:bold ;border:0;'>购气次数</td><td  style='border:0;'>"+data.chargeTimes+"</td></tr>"+
									"<tr><td  style='font-weight:bold ;border:0;'>购气量</td><td style='border:0;'>"+$.parseVoidValue(data.totalChargeAmount)+"</td><td  style='font-weight:bold ;border:0;'>销卡时间</td><td style='border:0;'>"+$.parseVoidValue(data.revokeDate)+"</td></tr>"+
									"<tr><td colspan='2'/><td colspan='2'>"+
									"<div role='navigation' class='ui-navbar' data-role='navbar' data-iconpos='left'>"+
													"<ul class='ui-grid-b'>"+
													//"<li class='ui-block-a'><button class='ui-btn ui-icon-edit ui-btn-icon-left' data-icon='edit'>发卡</button></li>"+
													//"<li class='ui-block-b'><button class='ui-btn ui-icon-recycle ui-btn-icon-left' data-icon='recycle'>补卡</button></li>"+
													"<li class='ui-block-a'><button class='ui-btn ui-icon-forbidden ui-btn-icon-left orange-4' data-icon='forbidden'>"+
															"<a href='#modifyPopup' data-rel='popup' data-position-to='window' data-transition='pop' style='border:0;padding:0;' aria-haspopup='true' aria-owns='modifyPopup' aria-expanded='false' class='ui-link orange-4'>挂失/解挂</a>"+
													"</button></li>"+
													//"<li class='ui-block-d'><button class='ui-btn ui-icon-delete ui-btn-icon-left' data-icon='delete' >"+
															//"<a href='#modifyPopup' data-rel='popup' data-position-to='window' data-transition='pop' style='border:0;padding:0;' aria-haspopup='true' aria-owns='modifyPopup' aria-expanded='false' class='ui-link'>回收</a>"+
													//"</button></li>"+
									"</ul></div>"+
									"</td></tr>") ;
									tr.each(function(index){
										fragment.appendChild(this) ;
										chintPlugins.tablePlugin.trColorSetting(this,index,{total:8,tds:[1,3]} , true) ;//行点击效果
									}) ;
									$(tr[tr.length-1]).attr("userData" , JSON.stringify(data) ) ;
									navigationOperation(tr) ;
							}) ;
							optionTable.append(fragment).trigger("create") ;
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
							button.on("click" , function(){
										$.queryContext( filterInner , filterPanel , tableDataHandle ) ;
							}) ;
							fragment.appendChild(button[0]) ;
							filterInner.append(fragment).trigger("create") ;
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
					
					//挂失、回收通用方法
					var commonMethod = function(options){
							var popup = $.renderPopup(  $('#modifyPopup')  , options ) ;
					} ;
					
					//发卡操作
					var editIssue = function(){
							var userData = JSON.parse($(this).closest("tr").attr("userdata")) ;
							var hasCard = userData.hasCard ;
							if( 1 == hasCard ){
									$.fadeInPlugin( "该用户已存在IC卡，请使用补卡功能" ) ;
									return false ;
							}else if( -1 == hasCard ){
									//发卡
									var params = {} ;
									params.accountID = userData.accountID ;
									params.deviceID = userData.deviceID ;
									$.customAjax(''+config.basePath+config.gasTblcardUserCard , params , function(flag , data){
											if('success' === flag){
													var cardData =  data.data ;
													if(cardData.runMode == 0){//气量表
													
													}else if(cardData.runMode == 1){//金额表
															if(cardData.sp1 == null || cardData.sp1 == ''){
																	$.fadeInPlugin("获取价格信息失败") ;
															}
													}
											}
									}) ;
							}
							console.log("this is editIssue ...") ;
					} ;
					
					//渲染补卡panel内容
					var renderReIssuePanel = function(){
							var fragment = document.createDocumentFragment();
							fragment.appendChild($("<label>补卡</label>")[0]) ;
							paramData.modifyPanel.inputs.forEach(function(data , index){
										fragment.appendChild( inputPlugin.init( null , {} , {labelName : data.label , id : data.name , name : data.name , readonly : data.readonly } ).render() ) ;
							}) ;
							var button = $("<button>补卡</button>") ;
							button.on("click" , function(){
									var params = JSON.parse($(this).attr("ids")) ;
									/*$.customAjax(''+config.basePath+config.gasTblcardUserCard , params , function(flag , data){
									
									}) ;*/
									console.log("this is button click ..." , params) ;
							}) ;
							fragment.appendChild(button[0]) ;
							modifyInner.append(fragment).trigger("create") ;
					} ;
					
					//补卡操作
					var recycleReissue = function(){
							var userData = JSON.parse($(this).closest("tr").attr("userdata")) ;
							var inputs = modifyInner.find(".chintInput") ;
							inputs.each(function( index , dom ){
									dom.value = userData[dom.name] ;
							}) ;
							var ids = {} ;
							ids.accountID = userData.accountID ;
							ids.deviceID = userData.deviceID ;
							modifyInner.find("button").attr("ids" , JSON.stringify(ids)) ;
							modifyPanel.panel().panel("open");
					} ;
					
					//挂失操作
					var forbiddenIssue = function(){
							var params = {} ;
							var promptOpions = paramData.cardManage.forbiddenCard.options ;
							var userData = JSON.parse( $(this).closest("tr").attr("userdata") ) ;
							var hasCard = userData.hasCard ;
							var state = userData.state ;
							var loseFlag = null ;
							if( -1 == hasCard ){
									$.fadeInPlugin("该用户无IC卡") ;
									return false ;
							}else if( 1 == hasCard ){
									if( -1 == state ){
											$.fadeInPlugin("该卡已注销") ;
											return ;
									}else if( 1 == state ){
											loseFlag = "挂失" ;
									}else if( 2 == state ){
											loseFlag = "解挂" ;
									}
							} 
							promptOpions.h3 = "确认"+loseFlag +"?";
							promptOpions.h1 = loseFlag ;
							commonMethod( promptOpions ) ;
							params = { accountID : userData.accountID , deviceID : userData.deviceID , cardID : userData.cardID, state : userData.state } ;
							var confirmLabel = popup.find("a")[0] ;
							$( confirmLabel ).off("click") ; //重复操作点击挂失或者解挂会导致该按钮绑定过多click事件
							$(confirmLabel).on( "click" , function(){
									$.customAjax(''+config.basePath+config.lossReport , params , function(flag , data){
												if('success' === flag){
														$.fadeInPlugin( loseFlag + "成功!") ;
												}else{
														$.fadeInPlugin( loseFlag + "失败!") ;
												}
												tableDataHandle() ;
									}) ;
							}) ;
					} ;
					
					//回收操作
					var deleteIssue = function(){
							commonMethod(paramData.cardManage.deleteCard.options) ;
					} ;
					
					//导航按钮组点击操作
					var navigationOperation = function(tr){
							var lis = $(tr).find("ul > li") ;
							//发卡按钮点击操作
							lis.find(".ui-icon-edit").on("click" ,  editIssue ) ;
							
							//补卡按钮点击操作
							lis.find(".ui-icon-recycle").on("click" ,  recycleReissue ) ;
							
							//挂失操作
							lis.find(".ui-icon-forbidden").on("click" ,  forbiddenIssue ) ;
							
							//回收操作
							lis.find(".ui-icon-delete").on("click" ,  deleteIssue ) ;
					} ;

					;(function(){
							$.emptyInnerPanel() ;//清空chintBodyPanel中的内容
							var chintMainInnerHtml   =  ''  ;
								  chintMainInnerHtml += '<h2 id="userInfo">IC卡管理</h2>' ;
								  chintMainInnerHtml += '<a id="filterConditionElement" href="#" data-ajax="false" style="float:right;margin-top:-3em;">过滤条件</a>' ;
								  chintMainInnerHtml += '<table id="waitDeviceTable" data-role="table" data-column-btn-theme="b" data-column-popup-theme="a" data-mode="" class="table-stroke">' ;
							      chintMainInnerHtml += 		'<thead><tr class="th-groups"><th style="width:4.15em;">用户名</th><th style="width:4.15em;">区域</th>' ;
							      chintMainInnerHtml += 		'<th style="width:4.15em;">计量模式</th><th style="width:4.15em;">卡类型</th></tr></thead>' ;
							  	  chintMainInnerHtml +=		 '<tbody></tbody>' ;
							  	  chintMainInnerHtml += '</table>' ;
							  	  chintMainInnerHtml += '<span style="float:right;"></span>'  ;
							chintBodyMain.append(chintMainInnerHtml).trigger("create") ;
							collapsibleDataHandle() ;	//区域列表渲染
							renderFilterPanel() ;		//渲染过滤条件panel
							clickFilterConditionEle() ;		//点击过滤条件标签
							tableDataHandle() ;	//渲染table
							renderReIssuePanel() ;//渲染补卡panel
					})() ;
　　　　};
　　　　return {
　　　　　　init: list
　　　　};
});