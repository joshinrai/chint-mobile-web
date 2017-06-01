define(function (){
　　　　var list = function (){
					var inputPlugin = chintPlugins.inputPlugin ;
					var paramData = { filterPanel : {
																inputs : [ {label:'工单号',name:'sheetno'} , {label:'填单人员',name:'username'} , {label:'出工人员',name:'workersname'}  ] 
												}} ;
					//获取工单数据
					var incidentAlertDataHandle = function(params){
							$.customAjax(''+config.basePath+config.workTblsheetData , params , function(flag , data){
									if('success' === flag){
										//渲染分页，table数据使用callback回调函数渲染
										chintPlugins.pageBreakPlugin.init(chintBodyMain.find('#workSheetSpan'),data,{pageCount:5}).render(renderWorkSheetTable) ;
									}
							}) ;
					}
					
					//渲染工单数据table
					var renderWorkSheetTable = function(data){
							var fragment = document.createDocumentFragment();
							var optionTable = $(chintBodyMain).find('#workSheetTable tbody') ;
							optionTable.empty() ;//先清空table中的内容再渲染table
							data.rows.forEach(function(data,index){
									var tr = $("<tr><td  style='border:0;word-break:break-all;'>"+data.sheetno+"</td><td  style='border:0;word-break:break-all;'>"+data.workdate +
													"</td><td  style='border:0;'>"+data.expiredate+"</td><td  style='border:0;'>"+$.parseVoidValue(data.tasktype)+"</td></tr>"+
													"<tr><td  style='font-weight:bold ;border:0;'>允许操作</td><td colspan='3' style='border:0;'>"+$.parseVoidValue(data.allowcommandnames)+"</td></tr>"+
													"<tr><td  style='font-weight:bold ;border:0;'>气表</td><td colspan='3' style='border:0;'>"+$.parseVoidValue(data.devicedata)+"</td></tr>"+
													"<tr><td  style='font-weight:bold ;border:0;'>出工人员</td><td style='border:0;'>"+$.parseVoidValue(data.workersname)+"</td>"+
													"<td  style='font-weight:bold ;border:0;'>处理状态</td><td style='border:0;'>"+$.parseVoidValue(data.state)+"</td></tr>"+
													"<tr><td  style='font-weight:bold ;border:0;'>填报日期</td><td style='border:0;'>"+$.parseVoidValue(data.recorddate)+"</td>"+
													"<td  style='font-weight:bold ;border:0;'>填报人</td><td style='border:0;'>"+$.parseVoidValue(data.recordusername)+"</td></tr>"+
													"<tr><td  style='font-weight:bold ;'>工作描述</td><td colspan='3'>"+$.parseVoidValue(data.description)+"</td></tr>"+
													"<tr/>") ;
									tr.each(function(index){
										fragment.appendChild(this) ;
										chintPlugins.tablePlugin.trColorSetting(this,index,{total:5,tds:[1,3]}) ;//行点击效果
									}) ;
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
							var button = $("<button  class='confirm-button'>确认</button>") ;
							button.on("touchstart" , function(){
										$.queryContext( filterInner , filterPanel , incidentAlertDataHandle ) ;
							}) ;
							fragment.appendChild(button[0]) ;
							filterInner.append(fragment).trigger("create") ;
					} ;
					
					//点击过滤条件标签显示过滤条件filterPanel并清空filterPanel中组件的内容
					var clickFilterConditionEle = function(){
							//显示过滤查询panel
							$(chintBodyMain).find('#filterConditionElement').on('touchstart',function(){
									filterPanel.find("input").val("") ;
									filterPanel.panel().panel("open");
							}) ;
					} ;
					!(function(){
							$.emptyInnerPanel() ;//清空mainbody的内容
							var chintMainInnerHtml   =  ''  ;
								  chintMainInnerHtml += '<h2>工单管理</h2>'  ;
								  chintMainInnerHtml += '<a id="filterConditionElement" href="#" data-ajax="false" style="float:right;margin-top:-3em;">过滤条件</a>' ;
								  chintMainInnerHtml += '<table id="workSheetTable" data-role="table" data-column-btn-theme="b" data-column-popup-theme="a" data-mode="" class="table-stroke">' ;
								  chintMainInnerHtml += 		'<thead><tr class="th-groups"><th style="width:4.15em;">工单号</th><th style="width:4.15em;">起始日期</th>' ;
								  chintMainInnerHtml += 		'<th style="width:4.15em;">截止日期</th><th style="width:4.15em;">任务类别</th></tr></thead>' ;
								  chintMainInnerHtml +=		 '<tbody></tbody>' ;
								  chintMainInnerHtml += '</table>' ;
								  chintMainInnerHtml += '<span id="workSheetSpan" style="float:right;"></span>'  ;
							chintBodyMain.append(chintMainInnerHtml).trigger("create") ;
							incidentAlertDataHandle({rows:10000}) ; //获取工单数据
							renderFilterPanel() ;				//渲染过滤条件panel
					 		clickFilterConditionEle() ;		//过滤条件标签点击事件
					})() ;
					return "工单管理" ;
　　　　};
　　　　return {
　　　　　　init: list
　　　　};
});