define(function (){
　　　　var list = function (){
					var inputPlugin = chintPlugins.inputPlugin ;
					var paramData = { filterPanel : {
																inputs : [ {label:'表号',name:'devicecode'} , {label:'表名',name:'devicename'} , {label:'确认人',name:'confirmuser'} ,
																			  {label:'处理人',name:'recorduser'} , {label:'报警内容',name:'alertmsg'} , {label:'处理结果',name:'processrecord'} ] 
												}} ;
					var incidentAlertDataHandle = function(params){
							$.customAjax(''+config.basePath+config.searchIncidentAlert , params , function(flag , data){
									if('success' === flag){
										//渲染分页，table数据使用callback回调函数渲染
										chintPlugins.pageBreakPlugin.init(chintBodyMain.find('#incidentAlertSpan'),data,{pageCount:5}).render(renderIncidentAlertTable) ;
									}
							}) ;
					}
					
					//渲染事件报警table
					var renderIncidentAlertTable = function(data){
							var fragment = document.createDocumentFragment();
							var optionTable = $(chintBodyMain).find('#incidentAlertTable tbody') ;
							optionTable.empty() ;//先清空table中的内容再渲染table
							data.rows.forEach(function(data,index){
									var tr = $("<tr><td  style='border:0;word-break:break-all;'>"+data.alertdate+"</td><td  style='border:0;word-break:break-all;'>"+data.devicecode +
													"</td><td  style='border:0;'>"+data.devicename+"</td><td  style='border:0;'>"+$.parseVoidValue(data.zonename)+"</td></tr>"+
													"<tr><td  style='font-weight:bold ;border:0;'>内容</td><td style='border:0;'>"+$.parseVoidValue(data.alertmsg)+"</td>"+
													"<td  style='font-weight:bold ;border:0;'>确认标记</td><td style='border:0;'>"+$.parseVoidValue(data.confirmflag)+"</td></tr>"+
													"<tr><td  style='font-weight:bold ;border:0;'>确认人</td><td style='border:0;'>"+$.parseVoidValue(data.confirmuser)+"</td>"+
													"<td  style='font-weight:bold ;border:0;'>是否处理</td><td style='border:0;'>"+$.parseVoidValue(data.processflag)+"</td></tr>"+
													"<tr><td  style='font-weight:bold ;border:0;'>处理结果</td><td colspan='3' style='border:0;'>"+$.parseVoidValue(data.processrecord)+"</td></tr>"+
													"<tr><td  style='font-weight:bold ;'>处理结果填写人</td><td colspan='3'>"+$.parseVoidValue(data.recorduser)+"</td></tr>"+
													"<tr/>") ;
									tr.each(function(index){
										fragment.appendChild(this) ;
										chintPlugins.tablePlugin.trColorSetting(this,index,{total:4,tds:[1,3]}) ;//行点击效果
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
								  chintMainInnerHtml += '<h2>事件报警</h2>'  ;
								  chintMainInnerHtml += '<a id="filterConditionElement" href="#" data-ajax="false" style="float:right;margin-top:-3em;">过滤条件</a>' ;
								  chintMainInnerHtml += '<table id="incidentAlertTable" data-role="table" data-column-btn-theme="b" data-column-popup-theme="a" data-mode="" class="table-stroke">' ;
								  chintMainInnerHtml += 		'<thead><tr class="th-groups"><th style="width:4.15em;">日期</th><th style="width:4.15em;">表号</th>' ;
								  chintMainInnerHtml += 		'<th style="width:4.15em;">表名</th><th style="width:4.15em;">所属区域</th></tr></thead>' ;
								  chintMainInnerHtml +=		 '<tbody></tbody>' ;
								  chintMainInnerHtml += '</table>' ;
								  chintMainInnerHtml += '<span id="incidentAlertSpan" style="float:right;"></span>'  ;
							chintBodyMain.append(chintMainInnerHtml).trigger("create") ;
							incidentAlertDataHandle({rows:10000}) ;//获取事件报警数据
					 		renderFilterPanel() ;				//渲染过滤条件panel
					 		clickFilterConditionEle() ;		//过滤条件标签点击事件
					})() ;
					return "事件报警" ;
　　　　};
　　　　return {
　　　　　　init: list
　　　　};
});