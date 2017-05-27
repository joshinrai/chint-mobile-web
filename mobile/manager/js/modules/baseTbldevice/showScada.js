define(function (){
　　　　var showScada = function (){
					!(function(){
							$.emptyInnerPanel() ;//清空mainbody的内容
							var chintMainInnerHtml   =  ''  ;
								  chintMainInnerHtml += '<h2>实时监测</h2>'  ;
							chintBodyMain.append(chintMainInnerHtml).trigger("create") ;
					})() ;
					return "实时监测" ;
　　　　};
　　　　return {
　　　　　　init: showScada
　　　　};
});