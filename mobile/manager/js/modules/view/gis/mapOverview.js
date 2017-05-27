define(function (){
　　　　var mapOverview = function (){
					!(function(){
							$.emptyInnerPanel() ;//清空mainbody的内容
							var chintMainInnerHtml   =  ''  ;
								  chintMainInnerHtml += '<h2>GIS导航</h2>'  ;
							chintBodyMain.append(chintMainInnerHtml).trigger("create") ;
					})() ;
					return "GIS导航" ;
　　　　};
　　　　return {
　　　　　　init: mapOverview
　　　　};
});