define(function (){
　　　　var showScadaLastData = function (){
					 
					 //获取表具实时数据
					var tableDataHandle = function(params){
							$(this).customAjax(''+config.basePath+config.searchScadaLastData , params , function(flag , data){
									if('success' === flag){
										//渲染分页，table数据使用callback回调函数渲染
										ChintPlugins.pageBreakPlugin.init(chintBodyMain.find('#realTimeTableSpan'),data,{pageCount:5}).render(renderRealTimeTable) ;
									}
							}) ;
					}
					
					//渲染表具实时数据table
					var renderRealTimeTable = function(data){
						var fragment = document.createDocumentFragment();
						var optionTable = $(chintBodyMain).find('#realTimeTable tbody') ;
						optionTable.empty() ;//先清空table中的内容再渲染table
						data.rows.forEach(function(data,index){
								var state = String(data.state) ;
								state = "1" === state ? "已连接" : "未连接" ;
								var valvestate = String(data.valvestate) ;
								valvestate = "null" === valvestate ? "N/A" : ( 1 === valvestate ? "开" : "关" ) ;
								var tr = $("<tr><td  style='border:0;word-break:break-all;'>"+data.accountname+"</td><td  style='border:0;'>"+state +
													"</td><td  style='border:0;'>"+valvestate+"</td><td  style='border:0;'>"+$.parseVoidValue(data.pv01,"N/A")+"</td></tr>"+
													"<tr><td  style='font-weight:bold ;border:0;'>表号</td><td colspan='3' style='border:0;'>"+data.devicecode+"</td></tr>"+
													"<tr><td colspan='2'  style='font-weight:bold ;border:0;'>累计消费金额</td><td colspan='2' style='border:0;'>"+$.parseVoidValue(data.pv02,"N/A")+"</td></tr>"+
													"<tr><td  style='font-weight:bold ;border:0;'>剩余金额</td><td style='border:0;'>"+$.parseVoidValue(data.pv03,"N/A")+
													"</td><td  style='font-weight:bold ;border:0;'>上次购入金额</td><td style='border:0;'>"+$.parseVoidValue(data.pv04,"N/A")+"</td></tr>"+
													"<tr><td  style='font-weight:bold ;border:0;'>累计用气量</td><td style='border:0;'>"+$.parseVoidValue(data.pv07,"N/A")+
													"</td><td  style='font-weight:bold ;border:0;'>累计购入气量</td><td style='border:0;'>"+$.parseVoidValue(data.pv06,"N/A")+"</td></tr>"+
													"<tr><td  style='font-weight:bold ;border:0;'>剩余气量</td><td style='border:0;'>"+$.parseVoidValue(data.pv08,"N/A")+
													"</td><td  style='font-weight:bold ;border:0;'>上次购入气量</td><td style='border:0;'>"+$.parseVoidValue(data.pv09,"N/A")+"</td></tr>"+
													"<tr><td  style='font-weight:bold ;border:0;'>更新时间</td><td colspan='3' style='border:0;'>"+$.parseVoidValue(data.updatedate)+"</td></tr>"+
													"<tr><td  style='font-weight:bold ;border:0;'>户号</td><td colspan='3' style='border:0;'>"+data.accountno+"</td></tr>"+
													"<tr><td  style='font-weight:bold ;border:0;'>区域</td><td colspan='3' style='border:0;'>"+data.zonename+"</td></tr>"+
													"<tr><td  style='font-weight:bold ;border:0;'>地址</td><td colspan='3' style='border:0;'>"+data.address+"</td></tr>"+
													"<tr><td  style='font-weight:bold ;border:0;'>集中器编号</td><td colspan='3' style='border:0;'>"+$.parseVoidValue(data.concentratorcode)+"</td></tr>"+
													"<tr><td  style='font-weight:bold ;'>集中器名称</td><td colspan='3'>"+$.parseVoidValue(data.concentratorname)+"</td></tr>"+
													"<tr/>") ;
								tr.each(function(index){
									fragment.appendChild(this) ;
									ChintPlugins.tablePlugin.trColorSetting(this,index,{total:12,tds:[1,3]}) ;//行点击效果
								}) ;
						}) ;
						optionTable.append(fragment).trigger("create") ;
					}
					
					//获取集中器连接状态数据
					var getConnectStateData = function(params){
							$(this).customAjax(''+config.basePath+config.getConcentratorState , params , function(flag , data){
									if('success' === flag){
										//渲染分页，table数据使用callback回调函数渲染
										ChintPlugins.pageBreakPlugin.init(chintBodyMain.find('#connectStateTableSpan'),data,{pageCount:5}).render(renderConnectStateTable) ;
									}
							}) ;
					}
					
					//渲染集中器连接状态table
					var renderConnectStateTable = function(data){
							var fragment = document.createDocumentFragment();
							var optionTable = $(chintBodyMain).find('#connectStateTable tbody') ;
							optionTable.empty() ;//先清空table中的内容再渲染table
							data.rows.forEach(function(data,index){
									var state = data.state ;
									state = "1" === String(data.state) ? "在线" : "离线" ; 
									var tr = $("<tr><td  style='border:0;word-break:break-all;'>"+data.concentratorcode+"</td><td  style='border:0;'>"+data.concentratorname +
													"</td><td  style='border:0;'>"+data.mid+"</td><td  style='border:0;'>"+data.zonename+"</td></tr>"+
													"<tr><td  style='font-weight:bold ;border:0;'>网络类型</td><td style='border:0;'>"+data.netname+"</td>"+
															"<td  style='font-weight:bold ;border:0;'>状态</td><td style='border:0;'>"+state+"</td></tr>"+
													"<tr><td  style='font-weight:bold ;border:0;'>气表关联数</td><td style='border:0;'>"+data.metercount+"</td>"+
															"<td  style='font-weight:bold ;border:0;'>中继器关联数</td><td style='border:0;'>"+data.repeatercount+"</td></tr>"+
															"<tr><td  style='font-weight:bold;'>安装时间</td><td colspan='3'>"+data.installdate+"</td></tr>"+
													"<tr/>") ;
									tr.each(function(index){
										fragment.appendChild(this) ;
										ChintPlugins.tablePlugin.trColorSetting(this,index,{total:4,tds:[1,3]}) ;//行点击效果
									}) ;
							}) ;
							optionTable.append(fragment).trigger("create") ;
					}
					 
					 !(function(){
					 		$.emptyInnerPanel() ;//清空mainbody的内容
					 		var chintMainInnerHtml   =  ''  ;
								  chintMainInnerHtml += '<h2>表具实时数据</h2>'  ;
								  chintMainInnerHtml += '<a id="filterConditionElement" href="#" data-ajax="false" style="float:right;margin-top:-3em;">过滤条件</a>' ;
								  chintMainInnerHtml += '<table id="realTimeTable" data-role="table" data-column-btn-theme="b" data-column-popup-theme="a" data-mode="" class="table-stroke">' ;
								  chintMainInnerHtml += 		'<thead><tr class="th-groups"><th style="width:4.15em;">用户名</th><th style="width:4.15em;">联机状态</th>' ;
								  chintMainInnerHtml += 		'<th style="width:6.15em;">累计冲入金额</th><th style="width:4.15em;">阀门状态</th></tr></thead>' ;
								  chintMainInnerHtml +=		 '<tbody></tbody>' ;
								  chintMainInnerHtml += '</table>' ;
								  chintMainInnerHtml += '<span id="realTimeTableSpan" style="float:right;"></span>'  ;
								  chintMainInnerHtml += '<h2 style="margin-top:2em;">集中器连接状态</h2>'  ;
								  chintMainInnerHtml += '<table id="connectStateTable" data-role="table" data-column-btn-theme="b" data-column-popup-theme="a" data-mode="" class="table-stroke">' ;
								  chintMainInnerHtml += 		'<thead><tr class="th-groups"><th style="width:5.15em;">集中器编号</th><th style="width:5.15em;">集中器名称</th>' ;
								  chintMainInnerHtml += 		'<th style="width:4.15em;">通讯标识</th><th style="width:4.15em;">所属区域</th></tr></thead>' ;
								  chintMainInnerHtml +=		 '<tbody></tbody>' ;
								  chintMainInnerHtml += '</table>' ;
								  chintMainInnerHtml += '<span id="connectStateTableSpan" style="float:right;"></span>'  ;
					 		chintBodyMain.append(chintMainInnerHtml).trigger("create") ;
					 		tableDataHandle( {rows : 10000} ) ;		//渲染表具实时数据table
					 		getConnectStateData({rows:10000})  ;//渲染集中器连接状态table
					 })() ;
					  return "实时数据" ;
　　　　};
　　　　return {
　　　　　　init: showScadaLastData
　　　　};
});