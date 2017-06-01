define(function (){
　　　　var list = function (){
						var chintBodyMain = $('#chintBodyMain') ;
						var filterPanel = $(chintBodyMain).parent().find('#filterPanel') ;
						var filterInner = $(chintBodyMain).parent().find('#filterPanel .ui-panel-inner') ;
						var modifyPanel = $(chintBodyMain).parent().find('#modifyPanel') ;
						var modifyInner = $(chintBodyMain).parent().find('#modifyPanel .ui-panel-inner') ;
						
						//初始化chintBodyMain中内容
						var init = function(){
							   var chintMainInnerHtml   =  ''  ;
							   chintMainInnerHtml += '<h2>新闻编辑</h2>'  ;
							   chintMainInnerHtml += '<div">'  ;
							   chintMainInnerHtml += 		'<a id="addElement" href="#" data-ajax="false" class="addElement">添加</a>' ;
							   chintMainInnerHtml += 		'<a id="filterConditionElement" href="#" data-ajax="false" class="filterConditionElement">过滤查询</a>' ;
							   chintMainInnerHtml += '</div>'  ;
						 	   chintMainInnerHtml += '<table data-role="table" data-column-btn-theme="b" data-column-popup-theme="a" data-mode="" class="table-stroke">' ;
							   chintMainInnerHtml += 		'<thead><tr class="th-groups"><th style="width:4.15em">标题</th><th style="width:4.15em">是否发布</th>' ;
							   chintMainInnerHtml += 		'<th style="width:4.15em">新闻类别</th><th style="width:4.15em">创建者</th> ' ;
							   chintMainInnerHtml += 		'</tr></thead>' ;
							   chintMainInnerHtml +=		 '<tbody></tbody>' ;
							   chintMainInnerHtml += '</table>' ;
							   chintMainInnerHtml += '<span style="float:right;"></span>'  ;
							   chintBodyMain.append(chintMainInnerHtml).trigger("create") ;
							   tableDataHandle({rows:1000}) ;  //设置初始查询为1000条数据，并将数据存入到sessionStorage中
							   renderFilterPanel() ;  //查询panel
							   //renderModifyPanel() ;		//修改panel
						}
						
						//table数据处理
						var tableDataHandle = function(params){
								//添加table数据
								$.customAjax(''+config.basePath+config.issueTblnewsDataList , params , function(flag , data){
										if('success' === flag){
											//渲染分页，table数据使用callback回调函数渲染
											chintPlugins.pageBreakPlugin.init(chintBodyMain.find('span'),data,{pageCount:4}).render(renderissueTblnewsTable) ;
										}
								}) ;
						}
						
						//渲染菜单管理table
						var renderissueTblnewsTable = function(data){
								var fragment = document.createDocumentFragment();
								var optionTable = $(chintBodyMain).find('table tbody') ;
								optionTable.empty() ;//先清空table中的内容再渲染table
								data.rows.forEach(function(data,index){
										var state = data.state ;
										state = ( 0==state ) ? "否" : (( 1==state ) ? "是" : "") ; 
										var mobile = data.mobile ;
										mobile = ( 0==mobile ) ? "内部新闻" : (( 1==mobile ) ? "用户公告" : "") ; 
										var tr = $("<tr><td style='border:0 ;'>"+data.title+"</td><td style='border:0 ;'>"+state+"</td><td style='border:0 ;'>"+
															mobile+"</td><td style='border:0 ;'>"+data.createuser+"</td></tr>"+
														"<tr><td  style='font-weight:bold;border:0;'>内容</td><td colspan='3' style='border:0;'>"+data.content+"</td></tr>"+
														"<tr><td  style='font-weight:bold;border:0;'>创建时间</td><td style='border:0;'>"+data.createtime+"</td>"+
															"<td  style='font-weight:bold;border:0;'>更新时间</td><td style='border:0;'>"+data.updatetime+"</td></tr>"+
														"<tr><td  style='font-weight:bold;border:0;'>更改者</td><td colspan='3' style='border:0;'>"+data.updateuser+"</td></tr>"+
														"<tr userData="+JSON.stringify({data:data,index:index})+"><td colspan='2'/><td><a style='font-weight:300;float:right;'>修改</a></td><td>"+
														"<a href='#modifyPopup' data-rel='popup' data-position-to='window' data-transition='pop' style='font-weight:300;text-decoration:none;float:right;'>删除</a>"+
														"</td></tr>") ;
								
										tr.each(function(index){
											fragment.appendChild(this) ;
											chintPlugins.tablePlugin.trColorSetting(this,index,{total:4,tds:[1 , 3]}) ;//行点击效果
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
						
						//添加过滤查询panel内容
						var renderFilterPanel = function(){
								var inputPlugin = chintPlugins.inputPlugin ;
								//显示过滤查询panel
								$(chintBodyMain).find('#filterConditionElement').on('click',function(){
										filterPanel.find(".chintInput").val("") ;
										filterPanel.panel().panel("open");
								}) ;
								var fragment = document.createDocumentFragment();
								var label = $("<label>过滤查询</label>") ;
								fragment.appendChild(label[0]) ;
								var dataArray = [{label:'信息标题',name:'title'}] ;
								dataArray.forEach(function(data , index){
											fragment.appendChild( inputPlugin.init( null , {} , {labelName : data.label , id : data.name , name : data.name} ).render() ) ;
								}) ;
								var button = $("<button>查询</button>") ;
								button.on("click" , filterPanelQuery) ;
								fragment.appendChild(button[0]) ;
								filterInner.append(fragment).trigger("create") ;
						}
						
						//查询符合的内容
						var filterPanelQuery = function(){
									var params = {} ;
									params.rows = 1000 ;
									var radioPlugin = chintPlugins.radioPlugin ;
									var chintInput = filterInner.find('.chintInput') ;
									chintInput.each(function(index , data){
											params[data.name] = data.value ;
									}) ;
									tableDataHandle(params) ;
									filterPanel.panel().panel("close") ;
						}
						
						//处理逻辑：先销毁chintBodyMain，filterPanel，modifyPanel中的内容，然后再重新渲染chintBodyMain
						chintBodyMain.empty() ;
						filterInner.empty() ;
						modifyInner.empty() ;
						init() ;
						return "新闻编辑" ;
　　　　};
　　　　return {
　　　　　　	init: list
　　　　};
});