define(function (){
　　　　var showBillsLL = function (){
					;(function(){
							$.emptyInnerPanel() ;//清空chintBodyPanel中的内容
							var chintMainInnerHtml   =  ''  ;
								  chintMainInnerHtml += '<h2 id="userInfo">用户账单（醴陵）</h2>' ;
								  chintMainInnerHtml += '<a id="filterConditionElement" href="#" data-ajax="false" style="float:right;margin-top:-3em;">过滤条件</a>' ;
								  chintMainInnerHtml += '<table id="waitDeviceTable" data-role="table" data-column-btn-theme="b" data-column-popup-theme="a" data-mode="" class="table-stroke">' ;
							      chintMainInnerHtml += 		'<thead><tr class="th-groups"><th style="width:4.15em;">用户名</th><th style="width:4.15em;">交易类型</th>' ;
							      chintMainInnerHtml += 		'<th style="width:4.15em;">交易方式</th><th style="width:4.15em;">金额(元)</th></tr></thead>' ;
							  	  chintMainInnerHtml +=		 '<tbody></tbody>' ;
							  	  chintMainInnerHtml += '</table>' ;
							  	  chintMainInnerHtml += '<span style="float:right;"></span>'  ;
							chintBodyMain.append(chintMainInnerHtml).trigger("create") ;
							//tableDataHandle({rows:1000}) ;//渲染充值缴费table内容
							//clickFilterConditionEle() ;		//点击过滤条件标签打开过滤panel
							//renderFilterPanel() ;		//渲染过滤条件panel
					})() ;
　　　　};
　　　　return {
　　　　　　init: showBillsLL
　　　　};
});