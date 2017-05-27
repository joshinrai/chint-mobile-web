define(function (){
　　　　var gasAnalysisByDevice = function (){
					!(function(){
							$.emptyInnerPanel() ;//清空mainbody的内容
							var chintMainInnerHtml   =  ''  ;
								  chintMainInnerHtml += '<h2>逐月单用户用气分析</h2>'  ;
								  chintMainInnerHtml += '<a id="filterConditionElement" href="#" data-ajax="false" style="float:right;margin-top:-3em;">过滤条件</a>' ;
							chintBodyMain.append(chintMainInnerHtml).trigger("create") ;
					})() ;
					return "逐月单用户用气分析" ;
　　　　};
　　　　return {
　　　　　　init: gasAnalysisByDevice
　　　　};
});