define(function (){
　　　　var deviceGroupSetting = function (){
						var chintBodyMain = $('#chintBodyMain') ;
						var filterPanel = $(chintBodyMain).parent().find('#filterPanel') ;
						var filterInner = $(chintBodyMain).parent().find('#filterPanel .ui-panel-inner') ;
						var modifyPanel = $(chintBodyMain).parent().find('#modifyPanel') ;
						var modifyInner = $(chintBodyMain).parent().find('#modifyPanel .ui-panel-inner') ;
						
						//初始化chintBodyMain中内容
						var init = function(){
							   var chintMainInnerHtml   =  ''  ;
							   chintMainInnerHtml += '<h2>表具批量设置</h2>'  ;
							   chintMainInnerHtml += '<div">'  ;
							   chintMainInnerHtml += 		'<a id="addElement" href="#" data-ajax="false" class="addElement">添加</a>' ;
							   chintMainInnerHtml += 		'<a id="filterConditionElement" href="#" data-ajax="false" class="filterConditionElement">过滤查询</a>' ;
							   chintMainInnerHtml += '</div>'  ;
						 	   chintMainInnerHtml += '<table data-role="table" data-column-btn-theme="b" data-column-popup-theme="a" data-mode="" class="table-stroke">' ;
							   chintMainInnerHtml += 		'<thead><tr class="th-groups"><th style="min-width:4.15em">表号</th><th style="min-width:4.15em">表名</th>' ;
							   chintMainInnerHtml += 		'<th style="min-width:4.15em">所属区域</th><th style="min-width:4.15em">启用状态</th> ' ;
							   chintMainInnerHtml += 		'</tr></thead>' ;
							   chintMainInnerHtml +=		 '<tbody></tbody>' ;
							   chintMainInnerHtml += '</table>' ;
							   chintMainInnerHtml += '<span style="float:right;"></span>'  ;
							   chintBodyMain.append(chintMainInnerHtml).trigger("create") ;
							   //tableDataHandle({rows:1000}) ;  //设置初始查询为1000条数据，并将数据存入到sessionStorage中
							   //renderFilterPanel() ;  //查询panel
							   //renderModifyPanel() ;		//修改panel
						}
						
						//table数据处理
						var tableDataHandle = function(params){
								//添加table数据
								$(this).customAjax(''+config.basePath+config.sysTblCompanyDataList , params , function(flag , data){
										if('success' === flag){
											//渲染分页，table数据使用callback回调函数渲染
											ChintPlugins.pageBreakPlugin.init(chintBodyMain.find('span'),data,{pageCount:4}).render(renderTblDeviceGroupTable) ;
										}
								}) ;
						}
						
						//渲染菜单管理table
						var renderTblDeviceGroupTable = function(data){
								var fragment = document.createDocumentFragment();
								var optionTable = $(chintBodyMain).find('table tbody') ;
								optionTable.empty() ;//先清空table中的内容再渲染table
								data.rows.forEach(function(data,index){
										var companyname2 = data.companyname2 ;
										companyname2 = companyname2 ? companyname2 : "无" ;
										var tr = $("<tr><td style='border:0 ;'>"+data.companyname+"</td><td style='border:0 ;'>"+companyname2+"</td><td style='border:0 ;'>"+
															data.description +"</td></tr>"+
														"<tr userData="+JSON.stringify({data:data,index:index})+"><td/><td><a style='font-weight:300;float:right;'>修改</a></td><td>"+
														"<a href='#modifyPopup' data-rel='popup' data-position-to='window' data-transition='pop' style='font-weight:300;text-decoration:none;float:right;'>删除</a>"+
														"</td></tr>") ;
								
										tr.each(function(index){
											fragment.appendChild(this) ;
											ChintPlugins.tablePlugin.trColorSetting(this,index,{total:1,tds:[1]}) ;//行点击效果
										}) ;
										
										aTds = tr.find('a') ;
										//修改
										$(aTds[0]).on('click',function(){
												modifyEvent(this) ;
										}) ;
										//删除
										$(aTds[1]).on('click',function(){
												deletePopupEvent(this) ;
										}) ;
								
								}) ;
								optionTable.append(fragment).trigger("create") ;
						}
						
						//处理逻辑：先销毁chintBodyMain，filterPanel，modifyPanel中的内容，然后再重新渲染chintBodyMain
						chintBodyMain.empty() ;
						filterInner.empty() ;
						modifyInner.empty() ;
						init() ;

						return "表具批量设置" ;
　　　　};
　　　　return {
　　　　　　	init: deviceGroupSetting
　　　　};
});