define(function (){
　　　　var gasFrozenDataMonthly = function (){

					//获取月冻结数据
					var frozenMonthlyDataHandle = function(params){
							$(this).customAjax(''+config.basePath+config.queryFrozenDataMonthly , params , function(flag , data){
									if('success' === flag){
										//渲染分页，table数据使用callback回调函数渲染
										ChintPlugins.pageBreakPlugin.init(chintBodyMain.find('#frozenByMonthSpan'),data,{pageCount:5}).render(renderFrozenMonthlyTable) ;
									}
							}) ;
					}
					
					//渲染月冻结数据table
					var renderFrozenMonthlyTable = function(data){
						var fragment = document.createDocumentFragment();
							var optionTable = $(chintBodyMain).find('#frozenByMonthTable tbody') ;
							optionTable.empty() ;//先清空table中的内容再渲染table
							data.rows.forEach(function(data,index){
									var tr = $("<tr><td  style='border:0;word-break:break-all;'>"+data.ownername+"</td><td  style='border:0;word-break:break-all;'>"+data.devicecode +
													"</td><td  style='border:0;'>"+data.frozendate+"</td><td  style='border:0;'>"+$.parseVoidValue(data.pv08)+"</td></tr>"+
													"<tr><td  style='font-weight:bold ;border:0;'>当日用气量</td><td style='border:0;'>"+data.pv10+"</td>"+
													"<td  style='font-weight:bold ;border:0;'>累计用气量</td><td style='border:0;'>"+data.pv07+"</td></tr>"+
													"<tr><td  style='font-weight:bold ;border:0;'>上次购气量</td><td style='border:0;'>"+data.pv09+"</td>"+
													"<td  style='font-weight:bold ;border:0;'>累计购入气量</td><td style='border:0;'>"+data.pv06+"</td></tr>"+
													"<tr><td  style='font-weight:bold ;border:0;'>当日消费金额</td><td style='border:0;'>"+data.pv05+"</td>"+
													"<td  style='font-weight:bold ;border:0;'>累计消费金额</td><td style='border:0;'>"+data.pv02+"</td></tr>"+
													"<tr><td  style='font-weight:bold ;border:0;'>剩余金额</td><td style='border:0;'>"+data.pv03+"</td>"+
													"<td  style='font-weight:bold ;border:0;'>累计充入金额</td><td style='border:0;'>"+data.pv01+"</td></tr>"+
													"<tr><td  style='font-weight:bold ;border:0;'>上次购入金额</td><td style='border:0;'>"+data.pv04+"</td>"+
													"<td  style='font-weight:bold ;border:0;'>阀门状态</td><td style='border:0;'>"+data.valvestate+"</td></tr>"+
													"<tr><td  style='font-weight:bold ;border:0;'>表名</td><td style='border:0;'>"+data.devicename+"</td>"+
													"<td  style='font-weight:bold ;border:0;'>所属区域</td><td style='border:0;'>"+data.zonename+"</td></tr>"+
													"<tr><td  style='font-weight:bold ;'>户号</td><td style='word-break:break-all;'>"+data.accountno+"</td>"+
													"<td  style='font-weight:bold ;'>上传时间</td><td>"+data.createdate+"</td></tr>"+
													"<tr/>") ;
									tr.each(function(index){
										fragment.appendChild(this) ;
										ChintPlugins.tablePlugin.trColorSetting(this,index,{total:7,tds:[1,3]}) ;//行点击效果
									}) ;
							}) ;
							optionTable.append(fragment).trigger("create") ;
					}

					!(function(){
							$.emptyInnerPanel() ;//清空mainbody的内容
							var chintMainInnerHtml   =  ''  ;
								  chintMainInnerHtml += '<h2>月冻结数据</h2>'  ;
								  chintMainInnerHtml += '<a id="filterConditionElement" href="#" data-ajax="false" style="float:right;margin-top:-3em;">过滤条件</a>' ;
								  chintMainInnerHtml += '<table id="frozenByMonthTable" data-role="table" data-column-btn-theme="b" data-column-popup-theme="a" data-mode="" class="table-stroke">' ;
								  chintMainInnerHtml += 		'<thead><tr class="th-groups"><th style="width:4.15em;">用户姓名</th><th style="width:4.15em;">表号</th>' ;
								  chintMainInnerHtml += 		'<th style="width:4.15em;">冻结时间</th><th style="width:4.15em;">剩余气量</th></tr></thead>' ;
								  chintMainInnerHtml +=		 '<tbody></tbody>' ;
								  chintMainInnerHtml += '</table>' ;
								  chintMainInnerHtml += '<span id="frozenByMonthSpan" style="float:right;"></span>'  ;
							chintBodyMain.append(chintMainInnerHtml).trigger("create") ;
							frozenMonthlyDataHandle({rows:1000}) ;//获取月冻结数据
					})() ;
					return "月冻结数据" ;
　　　　};
　　　　return {
　　　　　　init: gasFrozenDataMonthly
　　　　};
});