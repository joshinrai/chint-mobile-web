define(function (){
　　　　var gasAnalysisByZone = function (){
					!(function(){
							$.emptyInnerPanel() ;//清空mainbody的内容
							var chintMainInnerHtml   =  ''  ;
								  chintMainInnerHtml += '<h2>区域对比分析</h2>'  ;
								  chintMainInnerHtml += '<a id="filterConditionElement" href="#" data-ajax="false" style="float:right;margin-top:-3em;">过滤条件</a>' ;
							chintBodyMain.append(chintMainInnerHtml).trigger("create") ;
					})() ;
					return "区域对比分析" ;
　　　　};
　　　　return {
　　　　　　init: gasAnalysisByZone
　　　　};
});