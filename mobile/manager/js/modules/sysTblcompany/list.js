define(function (){
　　　　var list = function (){
						//初始化chintBodyMain中内容
						var init = function(){
							   $.emptyInnerPanel() ;
							   var chintMainInnerHtml   =  ''  ;
							   chintMainInnerHtml += '<h2>公司信息</h2>'  ;
							   chintMainInnerHtml += '<div">'  ;
							   chintMainInnerHtml += 		'<a id="addElement" href="#" data-ajax="false" class="addElement">添加</a>' ;
							   chintMainInnerHtml += 		'<a id="filterConditionElement" href="#" data-ajax="false" class="filterConditionElement">过滤查询</a>' ;
							   chintMainInnerHtml += '</div>'  ;
						 	   chintMainInnerHtml += '<table data-role="table" data-column-btn-theme="b" data-column-popup-theme="a" data-mode="" class="table-stroke">' ;
							   chintMainInnerHtml += 		'<thead><tr class="th-groups"><th style="width:4.15em">公司全称</th><th style="width:4.15em">公司简称</th>' ;
							   chintMainInnerHtml += 		'<th style="width:4.15em">备注</th> ' ;
							   chintMainInnerHtml += 		'</tr></thead>' ;
							   chintMainInnerHtml +=		 '<tbody></tbody>' ;
							   chintMainInnerHtml += '</table>' ;
							   chintMainInnerHtml += '<span style="float:right;"></span>'  ;
							   chintBodyMain.append(chintMainInnerHtml).trigger("create") ;
							   tableDataHandle({rows:1000}) ;  //设置初始查询为1000条数据，并将数据存入到sessionStorage中
							   renderFilterPanel() ;  //查询panel
							   renderModifyPanel() ;		//修改panel
						}
						
						//table数据处理
						var tableDataHandle = function(params){
								//添加table数据
								$(this).customAjax(''+config.basePath+config.sysTblCompanyDataList , params , function(flag , data){
										if('success' === flag){
											//渲染分页，table数据使用callback回调函数渲染
											ChintPlugins.pageBreakPlugin.init(chintBodyMain.find('span'),data,{pageCount:4}).render(renderTblCompanyTable) ;
										}
								}) ;
						}
						
						//渲染菜单管理table
						var renderTblCompanyTable = function(data){
								var fragment = document.createDocumentFragment();
								var optionTable = $(chintBodyMain).find('table tbody') ;
								optionTable.empty() ;//先清空table中的内容再渲染table
								data.rows.forEach(function(data,index){
										var companyname2 = data.companyname2 ;
										companyname2 = companyname2 ? companyname2 : "无" ;
										data.id = data.companyid ;
										var trData = JSON.stringify({data:data,index:index}) ;
										//去掉json中影响数据解析的HTML标签
										var length = trData.split("<").length ;
										for( var i = 0 ; i < (length-1) ; i++ ){
														trData = trData.replace( trData.substring( trData.indexOf("<") , trData.indexOf(">")+1)  , "" ) ;
										}
										var tr = $("<tr><td style='border:0 ;'>"+data.companyname+"</td><td style='border:0 ;'>"+companyname2+"</td><td style='border:0 ;'>"+
															data.description +"</td></tr>"+
														"<tr userData="+trData+"><td/><td><a style='font-weight:300;float:right;'>修改</a></td><td>"+
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
												var url = config.basePath+config.sysTblCompanyDelete ;
												$.deleteSelectedData(this , url , tableDataHandle ) ;
										}) ;
								
								}) ;
								optionTable.append(fragment).trigger("create") ;
						}
						
						//添加过滤查询panel内容
						var renderFilterPanel = function(){
								var inputPlugin = ChintPlugins.inputPlugin ;
								//显示过滤查询panel
								$(chintBodyMain).find('#filterConditionElement').on('click',function(){
										filterPanel.find(".chintInput").val("") ;
										filterPanel.panel().panel("open");
								}) ;
								var fragment = document.createDocumentFragment();
								var label = $("<label>过滤查询</label>") ;
								fragment.appendChild(label[0]) ;
								var dataArray = [{label:'公司全称',name:'companyname'} , {label:'公司简称',name:'companyname2'} , {label:'备注',name:'description'}] ;
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
									var radioPlugin = ChintPlugins.radioPlugin ;
									var chintInput = filterInner.find('.chintInput') ;
									chintInput.each(function(index , data){
											params[data.name] = data.value ;
									}) ;
									tableDataHandle(params) ;
									filterPanel.panel().panel("close") ;
						}
						
						//添加 修改panel内容
						var renderModifyPanel = function(){
									chintBodyMain.find('#addElement').on('click',function(){
													modifyInner.find('label')[0].textContent = '添加' ;
													modifyInner.find(".hintLabel").hide() ;
													modifyInner.find(".chintInput").val("") ;
													modifyInner.find("button").attr("companyid" , "") ;
													modifyPanel.panel().panel("open");
									}) ;
									var inputPlugin = ChintPlugins.inputPlugin ;
									var radioPlugin = ChintPlugins.radioPlugin ;
									var fragment = document.createDocumentFragment() ;
									fragment.appendChild($("<label>")[0]) ;
									var dataArray = [{label:'公司全称',name:'companyname'} , {label:'公司简称',name:'companyname2'}] ;
									dataArray.forEach(function(data , index){
												fragment.appendChild( inputPlugin.init( null , {} , {labelName : data.label , id : data.name , name : data.name , type : data.type } ).render() ) ;
									}) ;
									var textArea = ChintPlugins.textareaPlugin.init( null , {} , {labelName:'描述',id:'description',name:'description'} ).render() ;
									fragment.appendChild(textArea) ;
									var hintLabel = $("<label style='color:red;' class='hintLabel'></label>") ;
									fragment.appendChild(hintLabel[0]) ;
									var button = $("<button>确认</button>") ;
									button.on("click" , modifyPanelOpration) ;
									fragment.appendChild(button[0]) ;
									modifyInner.append(fragment).trigger("create") ;
						}
						
						//添加 修改button点击操作
						var modifyPanelOpration = function(){
									var radioPlugin = ChintPlugins.radioPlugin ;
									var label = modifyInner.find(".hintLabel") ;
									label.show() ;
									var params = {} ;
									var chintInput = modifyInner.find('.chintInput') ;
									chintInput.each(function(index , data){
											params[data.name] = data.value ;
									}) ;
									if(!chintInput[0].value){
											$.hintLabel(label , "请输入公司全称") ;
											return ;
									}
									if(!chintInput[1].value){
											$.hintLabel(label , "请输入公司简称") ;
											return ;
									}
									var descript = modifyInner.find("textarea") ;
									params[descript[0].name] = descript[0].value ;
									var button = modifyInner.find("button") ;
									var companyid = button.attr("companyid") ;
									params.companyid = companyid ? companyid : "" ;
									$(this).customAjax(''+config.basePath+config.sysTblCompanySave , params , function(flag , data){
												var lable = modifyInner.find(".ui-panel-inner .hintLabel") ;//$(chintBodyMain).parent().find('#modifyPanel .ui-panel-inner .hintLabel') ;
												$.hintLabel(label , data.msg , "green") ;
												setTimeout( tableDataHandle( {rows:1000} ) , 500 ) ;
												setTimeout(function(){ modifyPanel.panel().panel("close") } , 500) ;
									}) ;
						}
						
						//修改操作
						var modifyEvent = function(self){
									var radioPlugin = ChintPlugins.radioPlugin ;
									var userDatas = self.parentNode.parentNode.attributes ;
									var userData = JSON.parse( parseJSONData(userDatas) );
									modifyPanel.find("label")[0].textContent = "修改" ;
									var inputs = modifyPanel.find('input') ;
									inputs.each(function(data,index){
											this.value = userData.data[this.name] ;
									}) ;
									var textarea = modifyPanel.find('textarea') ;
									textarea[0] = userData.data.description ;
									var button = modifyInner.find("button") ;
									button.attr("companyid" , userData.data.companyid) ;
									modifyInner.find(".hintLabel").hide() ;
									modifyPanel.panel().panel("open");
						}
						
						//JSON数据转换 , 删除无用的HTML标签
						var parseJSONData = function(userDatas){
									var data = "" ;
									for( var i = 0 ; i < 2 ; i++ ){
												data += userDatas[i] ? (( ""==userDatas[i].value ) ? userDatas[i].nodeName : userDatas[i].value) : "" ;  
									}
									return data ;
						}
						
						init() ;
　　　　};
　　　　return {
　　　　　　	init: list
　　　　};
});