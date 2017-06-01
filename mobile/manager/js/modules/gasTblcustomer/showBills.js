define(function (){
　　　　var showBills = function (){
					var inputPlugin = chintPlugins.inputPlugin ;
					var radioPlugin = chintPlugins.radioPlugin ;
					var datetimepickerPlugin = chintPlugins.datetimepickerPlugin ;
					var paramData = { filterPanel : {
																inputs : [ {label:'户号',name:'accountno'} , {label:'用户名',name:'ownername'} , 
																				{label:'证件号码',name:'pidcardno'} , {label:'手机',name:'mobileno'}] ,
																collasibleRadios : [{data : [ {text : "充值" , id : "1" } , {text : "开户费" , id : "2" } , {text : "缴费" , id : "3" } ,
																											{text : "消费" , id : "4" } , {text : "退款" , id : "5" } , {text : "补发" , id : "6" } ,
																											{text : "补贴" , id : "7" } , {text : "补贴消费" , id : "8" }] , 
																								options : {title:'交易类型' ,  id:'transtype' , height : '8.2em' }}] 
												}} ;
					//table数据处理
					var tableDataHandle = function(params){
							loading.show() ;
							//添加table数据
							$.customAjax(''+config.basePath+config.dataListBills , params , function(flag , data){
									if(0 == data.total){
											data.total = data.rows.length ;
									}
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
									var transtype = data.transtype ;
									var paymode = data.paymode ;
									switch(transtype){
											case 1 : transtype = "充值" ;
													break ;
											case 2 : transtype = "开户费" ;
													break ;
											case 3 : transtype = "缴费" ;
													break ;
											case 4 : transtype = "消费" ;
													break ;
											case 5 : transtype = "退款" ;
													break ;
											case 6 : transtype = "补发" ;
													break ;
											case 7 : transtype = "补贴" ;
													break ;
											case 8 : transtype = "补贴消费" ;
													break ;
											default : transtype = "" ;
													break ;
									}
									switch(paymode){
											case 1 : paymode = "现金" ;
													break ;
											case 2 : paymode = "银行卡" ;
													break ;
											case 3 : paymode = "微信" ;
													break ;
											case 4 : paymode = "支付宝" ;
													break ;
											default : paymode = "" ; 
													break ;
									}
									var tr = $("<tr><td  style='border:0;word-break:break-all;'>"+data.ownername+"</td><td  style='border:0;'>"+transtype+"</td>"+
													"<td  style='border:0;'>"+paymode+"</td><td  style='border:0;'>"+data.transmoney+"</td></tr>"+
													"<tr><td  style='font-weight:bold ;border:0;'>户号</td><td colspan='3'  style='border:0;'>"+data.accountno+"</td></tr>"+
													"<tr><td  style='font-weight:bold ;border:0;'>交易时间</td><td colspan='3'  style='border:0;'>"+data.transdate+"</td></tr>"+
													"<tr><td  style='font-weight:bold ;border:0;'>充值前金额(元)</td><td  style='border:0;'>"+$.parseVoidValue( data.prebalance )+"</td>"+
													"<td  style='font-weight:bold ;border:0;'>当前剩余金额(元)</td><td style='border:0;'>"+$.parseVoidValue( data.curbalance )+"</td></tr>"+
													"<tr><td  style='font-weight:bold ;border:0;'>充入气量(m³) </td><td  style='border:0;'>"+$.parseVoidValue( data.gasamount )+"</td>"+
													"<td  style='font-weight:bold ;border:0;'>充前气量(m³) </td><td style='border:0;'>"+$.parseVoidValue( data.preamount )+"</td></tr>"+
													"<tr><td  style='font-weight:bold ;border:0;'>当前剩余气量(m³) </td><td  style='border:0;'>"+$.parseVoidValue( data.curamount )+"</td>"+
													"<td  style='font-weight:bold ;border:0;'>手机 </td><td style='border:0;'>"+data.mobileno+"</td></tr>"+
													"<tr><td  style='font-weight:bold ;border:0;'>表具 </td><td colspan='3'  style='border:0;'>"+data.devicenames+"</td></tr>"+
													"<tr><td  style='font-weight:bold ;'>证件号码  </td><td colspan='3'>"+data.pidcardno+"</td></tr>") ;
									tr.each(function(index){
										fragment.appendChild(this) ;
										chintPlugins.tablePlugin.trColorSetting(this,index,{total:7,tds:[1,3]} , true) ;//行点击效果
									}) ;
									$(tr[tr.length-1]).attr("userData" , JSON.stringify(data) ) ;
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
							var startTime = datetimepickerPlugin.init( { labelName : "交易开始时间" , name : "transdate_start" } ).render() ;
							var endTime = datetimepickerPlugin.init( { labelName : "交易结束时间" , name : "transdate_end" } ).render() ;
							fragment.appendChild(startTime) ;
							fragment.appendChild(endTime) ;
							paramData.filterPanel.inputs.forEach(function(data , index){
										fragment.appendChild( inputPlugin.init( null , {} , {labelName : data.label , id : data.name , name : data.name } ).render() ) ;
							}) ;
							radioPlugin.renderCollasibleRadio( paramData.filterPanel.collasibleRadios , fragment ) ;//绘制下拉单选组件
							var button = $("<button class='confirm-button'>确认</button>") ;
							button.on("click" , function(){
										$.queryContext( filterInner , filterPanel , tableDataHandle ) ;
							}) ;
							fragment.appendChild(button[0]) ;
							filterInner.append(fragment).trigger("create") ;
					} ;
					
					;(function(){
							$.emptyInnerPanel() ;//清空chintBodyPanel中的内容
							var chintMainInnerHtml   =  ''  ;
								  chintMainInnerHtml += '<h2 id="userInfo">用户账单</h2>' ;
								  chintMainInnerHtml += '<a id="filterConditionElement" href="#" data-ajax="false" style="float:right;margin-top:-3em;">过滤条件</a>' ;
								  chintMainInnerHtml += '<table id="waitDeviceTable" data-role="table" data-column-btn-theme="b" data-column-popup-theme="a" data-mode="" class="table-stroke">' ;
							      chintMainInnerHtml += 		'<thead><tr class="th-groups"><th style="width:4.15em;">用户名</th><th style="width:4.15em;">交易类型</th>' ;
							      chintMainInnerHtml += 		'<th style="width:4.15em;">交易方式</th><th style="width:4.15em;">金额(元)</th></tr></thead>' ;
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
　　　　　　init: showBills
　　　　};
});