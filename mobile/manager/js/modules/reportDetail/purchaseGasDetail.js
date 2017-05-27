define(function (){
　　　　var list = function (){
					
					//获取购气清单数据
					var getBussinessPartHandle = function(params){
							$(this).customAjax(''+config.basePath+config.getBussinessPart , params , function(flag , data){
									if('success' === flag){
										//渲染分页，table数据使用callback回调函数渲染
										ChintPlugins.pageBreakPlugin.init(chintBodyMain.find('#purchaseGasDetailSpan'),data,{pageCount:5}).render(renderBussinessTable) ;
									}
							}) ;
					}
					
					//渲染购气清单table
					var renderBussinessTable = function(data){
							var fragment = document.createDocumentFragment();
							var optionTable = $(chintBodyMain).find('#purchaseGasDetailTable tbody') ;
							optionTable.empty() ;//先清空table中的内容再渲染table
							data.rows.forEach(function(data,index){
									var transtype = data.transtype ;
									transtype = 1 == transtype ? "充值" : (3 == transtype ? "缴费" : "") ;
									var tr = $("<tr><td  style='border:0;word-break:break-all;'>"+data.accountno+"</td><td  style='border:0;word-break:break-all;'>"+data.ownername +
													"</td><td  style='border:0;'>"+data.typename+"</td><td  style='border:0;'>"+$.parseVoidValue(data.transdate)+"</td></tr>"+
													"<tr><td  style='font-weight:bold ;border:0;'>费用项目</td><td  style='border:0;'>"+$.parseVoidValue(transtype)+"</td>"+
													"<td  style='font-weight:bold ;border:0;'>地址</td><td  style='border:0;'>"+$.parseVoidValue(data.address)+"</td></tr>"+
													"<tr><td  style='font-weight:bold ;border:0;'>业务类型</td><td style='border:0;'>"+$.parseVoidValue(data.typemode)+"</td>"+
													"<td  style='font-weight:bold ;border:0;'>购气量</td><td style='border:0;'>"+$.parseVoidValue(data.gasamount)+"</td></tr>"+
													"<tr><td  style='font-weight:bold ;border:0;'>阶数</td><td style='border:0;'>"+$.parseVoidValue(data.unitPrice)+"</td>"+
													"<td  style='font-weight:bold ;border:0;'>应收金额</td><td style='border:0;'>"+$.parseVoidValue(data.transmoney)+"</td></tr>"+
													"<tr><td  style='font-weight:bold ;border:0;'>滞纳金</td><td style='border:0;'>"+$.parseVoidValue(data.penalty)+"</td>"+
													"<td  style='font-weight:bold ;border:0;'>实收金额</td><td style='border:0;'>"+$.parseVoidValue(data.summoeny)+"</td></tr>"+
													"<tr><td  style='font-weight:bold ;border:0;'>发票号</td><td style='border:0;'>"+$.parseVoidValue(data.invoiceNo)+"</td>"+
													"<td  style='font-weight:bold ;border:0;'>收款人</td><td style='border:0;'>"+$.parseVoidValue(data.username)+"</td></tr>"+
													"<tr/>") ;
									tr.each(function(index){
										fragment.appendChild(this) ;
										ChintPlugins.tablePlugin.trColorSetting(this,index,{total:5,tds:[1,3]}) ;//行点击效果
									}) ;
							}) ;
							optionTable.append(fragment).trigger("create") ;
					}

					!(function(){
							$.emptyInnerPanel() ;//清空mainbody的内容
							var chintMainInnerHtml   =  ''  ;
								  chintMainInnerHtml += '<h2>营业厅购气明细表</h2>'  ;
								  chintMainInnerHtml += '<a id="filterConditionElement" href="#" data-ajax="false" style="float:right;margin-top:-3em;">过滤条件</a>' ;
								  chintMainInnerHtml += '<table id="purchaseGasDetailTable" data-role="table" data-column-btn-theme="b" data-column-popup-theme="a" data-mode="" class="table-stroke">' ;
								  chintMainInnerHtml += 		'<thead><tr class="th-groups"><th style="width:4.15em;">用户号</th><th style="width:4.15em;">用户名称</th>' ;
								  chintMainInnerHtml += 		'<th style="width:4.15em;">客户类型</th><th style="width:4.15em;">收费时间</th></tr></thead>' ;
								  chintMainInnerHtml +=		 '<tbody></tbody>' ;
								  chintMainInnerHtml += '</table>' ;
								  chintMainInnerHtml += '<span id="purchaseGasDetailSpan" style="float:right;"></span>'  ;
							chintBodyMain.append(chintMainInnerHtml).trigger("create") ;
							getBussinessPartHandle({rows:10000}) ;//获取购气清单数据
					})() ;
					return "营业厅购气明细表" ;
　　　　};
　　　　return {
　　　　　　init: list
　　　　};
});