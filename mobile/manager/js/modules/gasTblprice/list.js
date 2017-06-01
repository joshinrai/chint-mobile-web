define(function (){
　　　　var list = function (){
					var radioPlugin = chintPlugins.radioPlugin ;
					var datetimepickerPlugin = chintPlugins.datetimepickerPlugin ;
					var paramData = { filterPanel : {
																collasibleRadios : [{data : [ {text : "全部" , id : "" } , {text : "未启用" , id : "0" } , {text : "已启用" , id : "1" }] , 
																								options : {title:'状态' ,  id:'state' , height : '8.2em' }}] 
												}} ;
												
					//使用promise获取用户类型数据
					var getTypeCodeTree = function(){
							var p = new Promise(function(resolve, reject){
									$.customAjax(''+config.basePath+config.getTypeCodeTree , {showEmptyNode:1,keyId:''} , function(flag , data){
											if('success' === flag){
													resolve(data) ;
											}
									}) ;
							}) ;
							return p ;
					}
												
					//获取table数据
					var tableDataHandle = function(params){
							$.customAjax(''+config.basePath+config.getTblPrice , params , function(flag , data){
									if('success' === flag){
										//渲染分页，table数据使用callback回调函数渲染
										chintPlugins.pageBreakPlugin.init(chintBodyMain.find('#priceManageSpan'),data,{pageCount:2}).render(renderTblOptionTable) ;
									}
							}) ;
					}
					
					//渲染菜单管理table
					var renderTblOptionTable = function(data){
							var fragment = document.createDocumentFragment();
							var optionTable = $(chintBodyMain).find('#priceManage tbody') ;
							optionTable.empty() ;//先清空table中的内容再渲染table
							data.rows.forEach(function(data,index){
									var pricemode = String(data.pricemode) ;
									switch(pricemode){
											case "0" : pricemode = "单阶定价" ;
													break ;
											case "1" : pricemode = "月度阶梯" ;
													break ;
											case "2" : pricemode = "季度阶梯" ;
													break ;
											case "3" : pricemode = "年度阶梯" ;
													break ;
											default : pricemode = "未知定价模式" ;
													break ;
									}
									var floatflag = String(data.floatflag) ;
									floatflag = "1" === floatflag ? "按人数浮动" : "不浮动" ;
									var state = data.state ;
									state = state > 0 ? "已启用" : "未启用" ;
									var expire = data.expire ;
									expire = 1 == expire ? "已过期" : "未过期" ;
									var tr = $("<tr><td  style='border:0;'>"+data.title+"</td><td  style='border:0;'>"+ pricemode +"</td><td  style='border:0;'>"+floatflag+
													"</td><td  style='border:0;'>"+data.stepamount+"</td></tr>"+
													"<tr><td  style='font-weight:bold ;border:0;'>实施用户类型</td><td colspan='3' style='border:0;'>"+data.customerTypeNames+"</td></tr>"+
													"<tr><td  style='font-weight:bold ;border:0;'>实施日期</td><td colspan='3' style='border:0;'>"+data.begindate+"</td></tr>"+
													"<tr><td  style='font-weight:bold ;border:0;'>截止日期</td><td colspan='3' style='border:0;'>"+data.enddate+"</td></tr>"+
													"<tr><td  style='font-weight:bold ;border:0;'>实施区域</td><td colspan='3' style='border:0;'>"+data.zonenames+"</td></tr>"+
													"<tr><td  style='font-weight:bold ;border:0;'>人口基数</td><td style='border:0;'>"+data.personamount+"</td><td  style='font-weight:bold ;border:0;'>"+
													"一阶价格</td><td style='border:0;'>"+$.parseVoidValue(data.price1)+"</td></tr>"+
													"<tr><td  style='font-weight:bold ;border:0;'>二阶价格</td><td style='border:0;'>"+$.parseVoidValue(data.price2)+"</td><td  style='font-weight:bold ;border:0;'>"+
													"二阶计价气量</td><td style='border:0;'>"+$.parseVoidValue(data.step2)+"</td></tr>"+
													"<tr><td  style='font-weight:bold ;border:0;'>三阶价格</td><td style='border:0;'>"+$.parseVoidValue(data.price3)+"</td><td  style='font-weight:bold ;border:0;'>"+
													"三阶计价气量</td><td style='border:0;'>"+$.parseVoidValue(data.step3)+"</td></tr>"+
													"<tr><td  style='font-weight:bold ;border:0;'>四阶价格</td><td style='border:0;'>"+$.parseVoidValue(data.price4)+"</td><td  style='font-weight:bold ;border:0;'>"+
													"四阶计价气量</td><td style='border:0;'>"+$.parseVoidValue(data.step4)+"</td></tr>"+
													"<tr><td  style='font-weight:bold ;border:0;'>五阶价格</td><td style='border:0;'>"+$.parseVoidValue(data.price5)+"</td><td  style='font-weight:bold ;border:0;'>"+
													"五阶计价气量</td><td style='border:0;'>"+$.parseVoidValue(data.step5)+"</td></tr>"+
													"<tr><td  style='font-weight:bold ;border:0;'>人均浮动气量</td><td style='border:0;'>"+data.floatgas+"</td><td  style='font-weight:bold ;border:0;'>"+
													"发布人</td><td style='border:0;'>"+data.username+"</td></tr>"+
													"<tr><td  style='font-weight:bold ;border:0;'>当前状态</td><td style='border:0;'>"+state+"</td><td  style='font-weight:bold ;border:0;'>"+
													"生效状态</td><td style='border:0;'>"+expire+"</td></tr>"+
													"<tr><td  style='font-weight:bold ;'>生成时间</td><td colspan='3'>"+data.createdate+"</td></tr>"+
													"<tr/>") ;
									tr.each(function(index){
											fragment.appendChild(this) ;
											chintPlugins.tablePlugin.trColorSetting(this,index,{total:12,tds:[1,3]}) ;//行点击效果
									}) ;
									tr.attr("priceid" , data.priceid ) ;
									tr.on("touchstart" , showPushResult ) ;
							}) ;
							optionTable.append(fragment).trigger("create") ;
					}
					
					//显示推送结果
					var showPushResult = function(){
							var params ={ priceid : $(this).attr("priceid")} ;
							$.customAjax(''+config.basePath+config.getPricePushInfo , params , function(flag , data){
									data.total = !data.total ? data.rows.length : data.total ;
									if('success' === flag){
											chintPlugins.pageBreakPlugin.init(chintBodyMain.find('#pushResultSpan'),data,{pageCount:5}).render(renderPushResultTable) ;
									}
							}) ;
					}
					
					//格式化时间,去掉时间最后的小数点
					var formatTime = function(time){
							return time.substr(0,time.lastIndexOf('.')) ;
					}
					
					//渲染推送结果table
					var renderPushResultTable = function(data){
							var fragment = document.createDocumentFragment();
							var optionTable = $(chintBodyMain).find('#pushResult tbody') ;
							optionTable.empty() ;//先清空table中的内容再渲染table
							data.rows.forEach(function(data,index){
									var createdate = formatTime( $.parseVoidValue(data.createdate) ) ;
									var senddate = formatTime( $.parseVoidValue(data.senddate) ) ;
									var sendflag = data.sendflag ;
									sendflag = sendflag > 0 ? "已下发" : "未下发" ;
									var tr = $("<tr><td  style='border:0;'>"+data.zonename+"</td><td  style='border:0;'>"+ data.devicecode +"</td></tr>"+
													"<tr><td  style='font-weight:bold ;border:0;'>表具名称</td><td style='border:0;'>"+$.parseVoidValue(data.devicename)+"</td></tr>"+
													"<tr><td  style='font-weight:bold ;border:0;'>下发状态</td><td style='border:0;'>"+sendflag+"</td></tr>"+
													"<tr><td  style='font-weight:bold ;border:0;'>推送时间</td><td style='border:0;'>"+createdate+"</td></tr>"+
													"<tr><td  style='font-weight:bold ;'>下发时间</td><td>"+senddate+"</td></tr>"+
													"<tr/>") ;
									tr.each(function(index){
										fragment.appendChild(this) ;
										chintPlugins.tablePlugin.trColorSetting(this,index,{total:5,tds:[1,3]}) ;//行点击效果
									}) ;
							}) ;
							optionTable.append(fragment).trigger("create") ;
					}
					
					//点击过滤条件标签显示过滤条件filterPanel并清空filterPanel中组件的内容
					var clickFilterConditionEle = function(){
							//显示过滤查询panel
							$(chintBodyMain).find('#filterConditionElement').on('click',function(){
									filterPanel.find("input").val("") ;
									filterPanel.panel().panel("open");
							}) ;
					}
					
					//渲染过滤条件panel
					var renderFilterPanel = function(){
							getTypeCodeTree().then(function(data){
									paramData.filterPanel.collasibleRadios.unshift( {data : data , options : {title:'用户类型' ,  id:'customerTypeCodes' , height : '8.2em' } } );
									return "" ;
							}).then(function(data){
									var fragment = document.createDocumentFragment();
									fragment.appendChild($("<label>过滤条件</label>")[0]) ;
									var startTime = datetimepickerPlugin.init( { labelName : "生效时间" , name : "transdate_start" } ).render() ;
									var endTime = datetimepickerPlugin.init( { labelName : "截止时间" , name : "transdate_end" } ).render() ;
									fragment.appendChild(startTime) ;
									fragment.appendChild(endTime) ;
									radioPlugin.renderCollasibleRadio( paramData.filterPanel.collasibleRadios , fragment ) ;//绘制下拉单选组件
									var button = $("<button class='confirm-button'>确认</button>") ;
									button.on("click" , function(){
												$.queryContext( filterInner , filterPanel , tableDataHandle ) ;
									}) ;
									fragment.appendChild(button[0]) ;
									filterInner.append(fragment).trigger("create") ;
							}) ;
					}
			
					!(function(){
							$.emptyInnerPanel() ;//清空mainbody的内容
							var chintMainInnerHtml   =  ''  ;
								  chintMainInnerHtml += '<h2>价格管理</h2>'  ;
								  chintMainInnerHtml += '<a id="filterConditionElement" href="#" data-ajax="false" style="float:right;margin-top:-3em;">过滤条件</a>' ;
								  chintMainInnerHtml += '<table id="priceManage" data-role="table" data-column-btn-theme="b" data-column-popup-theme="a" data-mode="" class="table-stroke">' ;
								  chintMainInnerHtml += 		'<thead><tr class="th-groups"><th style="width:4.15em;">价格名称</th><th style="width:4.15em;">价格模式</th>' ;
								  chintMainInnerHtml += 		'<th style="width:4.15em;">浮动阶梯</th><th style="width:4.15em;">阶数</th></tr></thead>' ;
								  chintMainInnerHtml +=		 '<tbody></tbody>' ;
								  chintMainInnerHtml += '</table>' ;
								  chintMainInnerHtml += '<span id="priceManageSpan" style="float:right;"></span>'  ;
								  chintMainInnerHtml += '<h2 style="margin-top:2em;">推送结果</h2>'  ;
								  chintMainInnerHtml += '<table id="pushResult" data-role="table" data-column-btn-theme="b" data-column-popup-theme="a" data-mode="" class="table-stroke">' ;
								  chintMainInnerHtml += 		'<thead><tr class="th-groups"><th style="width:8em;">区域</th><th style="width:8em;">编号</th></tr></thead>' ;
								  chintMainInnerHtml +=		 '<tbody></tbody>' ;
								  chintMainInnerHtml += '</table>' ;
								  chintMainInnerHtml += '<span id="pushResultSpan" style="float:right;"></span>'  ;
							chintBodyMain.append(chintMainInnerHtml).trigger("create") ;
							tableDataHandle({rows:10000}) ;		//渲染table
							renderFilterPanel() ;		//渲染过滤条件panel
							clickFilterConditionEle() ;		//过滤条件标签点击事件
					})() ;
　　　　};
　　　　return {
　　　　　　init: list
　　　　};
});