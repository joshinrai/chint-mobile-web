define(function (){
　　　　var gasDailyReportByDevice = function (){
					!(function(){
							$.emptyInnerPanel() ;//清空mainbody的内容
							var chintMainInnerHtml   =  ''  ;
								  chintMainInnerHtml += '<h2>单用户逐日报表</h2>'  ;
								  chintMainInnerHtml += '<a id="filterConditionElement" href="#" data-ajax="false" style="float:right;margin-top:-3em;">过滤条件</a>' ;
								  chintMainInnerHtml += '<table id="dailyReportTable" data-role="table" data-column-btn-theme="b" data-column-popup-theme="a" data-mode="" class="table-stroke">' ;
								  chintMainInnerHtml += 		'<thead><tr class="th-groups"><th style="width:3.15em;">区域</th><th style="width:5.15em;">当日用气量</th>' ;
								  chintMainInnerHtml += 		'<th style="width:4.15em;">当日用气金额</th><th style="width:4.15em;">当日缴费金额</th></tr></thead>' ;
								  chintMainInnerHtml +=		 '<tbody></tbody>' ;
								  chintMainInnerHtml += '</table>' ;
								  chintMainInnerHtml += '<span id="dailyReportSpan" style="float:right;"></span>'  ;
							chintBodyMain.append(chintMainInnerHtml).trigger("create") ;
					})() ;
					return "单用户逐日报表" ;
　　　　};
　　　　return {
　　　　　　init: gasDailyReportByDevice
　　　　};
});