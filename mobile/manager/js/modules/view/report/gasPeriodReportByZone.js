define(function (){
　　　　var gasPeriodReportByZone = function (){
					!(function(){
							$.emptyInnerPanel() ;//清空mainbody的内容
							var chintMainInnerHtml   =  ''  ;
								  chintMainInnerHtml += '<h2>区域逐月报表</h2>'  ;
								  chintMainInnerHtml += '<a id="filterConditionElement" href="#" data-ajax="false" style="float:right;margin-top:-3em;">过滤条件</a>' ;
								  chintMainInnerHtml += '<table id="periodReportTable" data-role="table" data-column-btn-theme="b" data-column-popup-theme="a" data-mode="" class="table-stroke">' ;
								  chintMainInnerHtml += 		'<thead><tr class="th-groups"><th style="width:3.15em;">区域</th><th style="width:5.15em;">当月用气量</th>' ;
								  chintMainInnerHtml += 		'<th style="width:4.15em;">当月用气金额</th><th style="width:4.15em;">当月缴费金额</th></tr></thead>' ;
								  chintMainInnerHtml +=		 '<tbody></tbody>' ;
								  chintMainInnerHtml += '</table>' ;
								  chintMainInnerHtml += '<span id="periodReportSpan" style="float:right;"></span>'  ;
							chintBodyMain.append(chintMainInnerHtml).trigger("create") ;
					})() ;
					return "区域月报表" ;
　　　　};
　　　　return {
　　　　　　init: gasPeriodReportByZone
　　　　};
});