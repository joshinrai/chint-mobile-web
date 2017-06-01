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
							   chintMainInnerHtml += '<h2>日志管理</h2>'  ;
							   chintMainInnerHtml += '<div">'  ;
							   chintMainInnerHtml += 		'<a id="filterConditionElement" href="#" data-ajax="false" class="filterConditionElement">过滤查询</a>' ;
							   chintMainInnerHtml += '</div>'  ;
						 	   chintMainInnerHtml += '<table data-role="table" data-column-btn-theme="b" data-column-popup-theme="a" data-mode="" class="table-stroke">' ;
							   chintMainInnerHtml += 		'<thead><tr class="th-groups"><th style="width:3.15em">用户名</th><th style="width:5.15em">访问主机IP</th>' ;
							   chintMainInnerHtml += 		'<th style="width:4.15em">日志时间</th><th style="width:4.15em">菜单名称</th> ' ;
							   chintMainInnerHtml += 		'</tr></thead>' ;
							   chintMainInnerHtml +=		 '<tbody></tbody>' ;
							   chintMainInnerHtml += '</table>' ;
							   chintMainInnerHtml += '<span style="float:right;"></span>'  ;
							   chintBodyMain.append(chintMainInnerHtml).trigger("create") ;
							   tableDataHandle({rows:5000}) ;  //设置初始查询为1000条数据，并将数据存入到sessionStorage中
							   renderFilterPanel() ;  //查询panel
						}
						
						//table数据处理
						var tableDataHandle = function(params){
								//添加table数据
								$.customAjax(''+config.basePath+config.sysTbllogDataList , params , function(flag , data){
										if('success' === flag){
											//渲染分页，table数据使用callback回调函数渲染
											chintPlugins.pageBreakPlugin.init(chintBodyMain.find('span'),data,{pageCount:5}).render(renderTblCompanyTable) ;
										}
								}) ;
						}
						
						//渲染菜单管理table
						var renderTblCompanyTable = function(data){
								var fragment = document.createDocumentFragment();
								var optionTable = $(chintBodyMain).find('table tbody') ;
								optionTable.empty() ;//先清空table中的内容再渲染table
								data.rows.forEach(function(data,index){
										var tr = $("<tr><td style='border:0 ;'>"+data.username+"</td><td style='border:0 ;'>"+data.hostip+"</td><td style='border:0 ;'>"+
															data.logdate +"</td><td style='border:0 ;'>"+data.menuname+"</td></tr>"+
														"<tr><td  style='font-weight:bold;'>访问主机名</td><td>"+data.hostname+"</td>"+
														"<td  style='font-weight:bold;'>日志信息</td><td>"+data.logmsg+"</td></tr><tr/>") ;
								
										tr.each(function(index){
											fragment.appendChild(this) ;
											chintPlugins.tablePlugin.trColorSetting(this,index,{total : 2 , tds:[1 , 3]}) ;//行点击效果
										}) ;
								
								}) ;
								optionTable.append(fragment).trigger("create") ;
						}
						
						//添加过滤查询panel内容
						var renderFilterPanel = function(){
								var inputPlugin = chintPlugins.inputPlugin ;
								var datetimepickerPlugin = chintPlugins.datetimepickerPlugin ;
								//显示过滤查询panel
								$(chintBodyMain).find('#filterConditionElement').on('click',function(){
										filterPanel.find("input").val("") ;
										filterPanel.panel().panel("open");
								}) ;
								var fragment = document.createDocumentFragment();
								var label = $("<label>过滤查询</label>") ;
								fragment.appendChild(label[0]) ;
								var startTime = datetimepickerPlugin.init( { labelName : "起始时间" , name : "starttime" } ).render() ;
								var endTime = datetimepickerPlugin.init( { labelName : "结束时间" , name : "endtime" } ).render() ;
								fragment.appendChild(startTime) ;
								fragment.appendChild(endTime) ;
								var dataArray = [{label:'用户名',name:'username'} , {label:'访问IP',name:'hostip'} , {label:'日志信息',name:'logmsg'}] ;
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
									var chintInput = filterInner.find( 'input' ) ;//.chintInput') ;
									chintInput.each(function(index , data){
											params[data.name] = data.value ;
									}) ;
									params.starttime = fmtDateFrStr(params.starttime) ;
									params.endtime = fmtDateFrStr(params.endtime) ;
									tableDataHandle(params) ;
									filterPanel.panel().panel("close") ;
						}
						
						//将字符串格式的日期转化为date类型的日期
						var fmtDateFrStr = function( str ){
									if( !str ) return "" ;
									return str +" 00:00:00" ;
						}
						
						//处理逻辑：先销毁chintBodyMain，filterPanel，modifyPanel中的内容，然后再重新渲染chintBodyMain
						chintBodyMain.empty() ;
						filterInner.empty() ;
						modifyInner.empty() ;
						init() ;
　　　　};
　　　　return {
　　　　　　	init: list
　　　　};
});