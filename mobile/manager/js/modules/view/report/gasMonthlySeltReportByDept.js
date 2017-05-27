define(function (){
　　　　var list = function (){
					!(function(){
							$.emptyInnerPanel() ;//清空mainbody的内容
							var chintMainInnerHtml   =  ''  ;
								  chintMainInnerHtml += '<h2>营业厅销售月报(永清)</h2>'  ;
								  chintMainInnerHtml += '<a id="filterConditionElement" href="#" data-ajax="false" style="float:right;margin-top:-3em;">过滤条件</a>' ;
								  chintMainInnerHtml += '<table id="sellMonthlyTable" data-role="table" data-column-btn-theme="b" data-column-popup-theme="a" data-mode="" class="table-stroke">' ;
								  chintMainInnerHtml += 		'<thead><tr class="th-groups"><th style="width:4.15em;">日期</th><th style="width:4.15em;">充值气量</th>' ;
								  chintMainInnerHtml += 		'<th style="width:4.15em;">退购气量</th><th style="width:4.15em;">购气量</th></tr></thead>' ;
								  chintMainInnerHtml +=		 '<tbody></tbody>' ;
								  chintMainInnerHtml += '</table>' ;
								  chintMainInnerHtml += '<span id="sellMonthlySpan" style="float:right;"></span>'  ;
							chintBodyMain.append(chintMainInnerHtml).trigger("create") ;
					})() ;
					return "营业厅销售月报(永清)" ;
　　　　};
　　　　return {
　　　　　　init: list
　　　　};
});