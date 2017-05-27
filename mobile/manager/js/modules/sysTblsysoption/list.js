define(function (){
　　　　	var list = function (){
						
						//获取系统参数列表
						var getOptiongroup = function(){
								$(this).customAjax(''+config.basePath+config.optionGroups , {} , function(flag , data){
											var filterOptiongroup = filterInner.find("#filterOptiongroup").empty() ;
											var filterPlugin = ChintPlugins.radioPlugin.init(null , data , {title:'参数组名' ,  id:'menuTree' , height : '200px' }).radioIconsRender( ) ;
											filterOptiongroup.append(filterPlugin) ;
											$(chintBodyMain).parent().find('#filterPanel').trigger("create") ;
								}) ;
						}
						
						//初始化chintBodyMain中内容
						var init = function(){
							$.emptyInnerPanel() ;
							var chintMainInnerHtml   =  ''  ;
								  chintMainInnerHtml += '<h2>系统参数</h2>'  ;
								  chintMainInnerHtml += '<a id="filterConditionElement" href="#" data-ajax="false" style="float:right;margin-top:-3em;">过滤查询</a>' ;
								  chintMainInnerHtml += '<table data-role="table" data-column-btn-theme="b" data-column-popup-theme="a" data-mode="" class="table-stroke">' ;
								  chintMainInnerHtml += 		'<thead><tr class="th-groups"><th style="width:5.5em;">参数英文名</th><th style="width:5.5em;">参数中文名</th>' ;
								  chintMainInnerHtml += 		'<th style="width:4.5em;">参数组名</th><th style="width:3.5em;">参数值</th></tr></thead>' ;
								  chintMainInnerHtml +=		 '<tbody></tbody>' ;
								  chintMainInnerHtml += '</table>' ;
								  chintMainInnerHtml += '<span style="float:right;"></span>'  ;
							chintBodyMain.append(chintMainInnerHtml).trigger("create") ;
							tableDataHandle({rows:1000}) ;  //设置初始查询为1000条数据，并将数据存入到sessionStorage中
							renderFilterPanel() ;		//查询panel
							renderModifyPanel() ;		//修改panel
							getOptiongroup() ;			//获取系统参数列表
						}
						
						//table数据处理
						var tableDataHandle = function(params){
								//添加table数据
								$(this).customAjax(''+config.basePath+config.sysOptionsDataList , params , function(flag , data){
										if('success' === flag){
											//渲染分页，table数据使用callback回调函数渲染
											ChintPlugins.pageBreakPlugin.init(chintBodyMain.find('span'),data,{pageCount:5}).render(renderTblOptionTable) ;
										}
								}) ;
						}
						
						//渲染菜单管理table
						var renderTblOptionTable = function(data){
								var fragment = document.createDocumentFragment();
								var optionTable = $(chintBodyMain).find('table tbody') ;
								optionTable.empty() ;//先清空table中的内容再渲染table
								data.rows.forEach(function(data,index){
										var tr= $("<tr><td  style='border:0;'>"+data.optionname+"</td><td  style='border:0;'>"+data.optionnamecn+"</td><td  style='border:0;'>"+
														data.optiongroup+"</td><td  style='border:0;'>"+data.optionvalue+"</td></tr>"+
														"<tr><td  style='font-weight:bold ;border:0;'>说明</td><td colspan='3' style='border:0;'>"+data.optiondescription+"</td></tr>"+
														"<tr userData="+JSON.stringify({data:data,index:index})+"><td colspan='3'/><td><a style='font-weight:300;'>修改</a></td></tr>") ;
										tr.each(function(index){
											fragment.appendChild(this) ;
											ChintPlugins.tablePlugin.trColorSetting(this,index,{total:2,tds:[1,3]}) ;//行点击效果
										}) ;
										aTds = tr.find('a') ;
										//修改
										$(aTds[0]).on('click',function(){
												modifyEvent(this) ;
										}) ;
								}) ;
								optionTable.append(fragment).trigger("create") ;
						}
						
						//添加过滤查询panel内容
						var renderFilterPanel = function(){
								var inputPlugin = ChintPlugins.inputPlugin ;
								//显示过滤查询panel
								$(chintBodyMain).find('#filterConditionElement').on('click',function(){
										filterPanel.find("input").val("") ;
										ChintPlugins.radioPlugin.reRenderRadioIcons( filterInner.find("#filterOptiongroup") , "" ) ;
										filterPanel.panel().panel("open");
								}) ;
								var fragment = document.createDocumentFragment();
								var label = $("<label>过滤查询</label>") ;
								fragment.appendChild(label[0]) ;
								var dataArray = [{label:'参数英文名称',name:'optionname'} , {label:'参数中文名称',name:'optionnamecn'}] ;
								dataArray.forEach(function(data , index){
											fragment.appendChild( inputPlugin.init( null , {} , {labelName : data.label , id : data.name , name : data.name} ).render() ) ;
								}) ;
								var optiongroup = $("<div id='filterOptiongroup' style='margin: .3em 0 ;'></div>") ;
								fragment.appendChild(optiongroup[0]) ;
								var button = $("<button>确认</button>") ;
								button.on("click" , filterPanelQuery) ;
								fragment.appendChild(button[0]) ;
								filterInner.append(fragment).trigger("create") ;
						}
						
						//过滤查询button点击操作
						var filterPanelQuery = function(){
								var params = {} ;
								params.rows = 1000 ;
								var radioPlugin = ChintPlugins.radioPlugin ;
								var chintInput = filterInner.find('.chintInput') ;
								chintInput.each(function(index , data){
										params[data.name] = data.value ;
								}) ;
								var radioChecked = filterInner.find('.radioChecked')[0] ;
								params.optiongroup = radioChecked ? radioPlugin.getValueFromEle(radioChecked) : "" ;
								tableDataHandle(params) ;
								filterPanel.panel().panel("close") ;
						}
						
						//修改panel内容
						var renderModifyPanel = function(){
								var inputPlugin = ChintPlugins.inputPlugin ;
								var fragment = document.createDocumentFragment() ;
								fragment.appendChild($("<label>")[0]) ;
								var dataArray = [{label:'参数英文名',name:'optionname' , readonly : true} , {label:'参数中文名',name:'optionnamecn' , readonly : true } ,
															 {label:'参数组名',name:'optiongroup' , readonly : true } ,  {label:'参数值',name:'optionvalue'}] ;
								dataArray.forEach(function(data , index){
											fragment.appendChild( inputPlugin.init( null , {} , {labelName : data.label , id : data.name , name : data.name , readonly : data.readonly } ).render() ) ;
								}) ;
								var textArea = ChintPlugins.textareaPlugin.init( null , {} , {labelName:'说明',id:'description',name:'optiondescription'} ).render() ;
								fragment.appendChild(textArea) ;
								var hintLabel = $("<label style='color:red;' class='hintLabel'></label>") ;
								fragment.appendChild(hintLabel[0]) ;
								var button = $("<button>确认</button>") ;
								button.on("click" , modifyPanelOpration) ;
								fragment.appendChild(button[0]) ;
								modifyInner.append(fragment).trigger("create") ;
						}
						
						//修改点击操作
						var modifyEvent = function(self){
									var radioPlugin = ChintPlugins.radioPlugin ;
									modifyPanel.find("label")[0].textContent = "修改" ;
									var userData = JSON.parse(self.parentNode.parentNode.attributes.userData.value) ;
									var inputs = modifyPanel.find('input') ;
									inputs.each(function(index , data){
											this.value = userData.data[this.name] ;
									}) ;
									var textarea = modifyInner.find("textarea") ;
									textarea[0].value = userData.data.optiondescription ;
									modifyPanel.find("button").attr("dataId" , userData.data.id)
									modifyPanel.find(".hintLabel").hide() ;
									modifyPanel.panel().panel("open");
						}
						
						//修改button点击操作
						var modifyPanelOpration = function(){
									var params = {} ;
									var chintInput = modifyInner.find('.chintInput') ;
									chintInput.each(function(index , data){
											params[data.name] = data.value ;
									}) ;
									var textArea = modifyInner.find("textarea") ;
									params.optiondescription = textArea[0].value ;
									params.id = modifyInner.find("button").attr("dataId") ;
									$(this).customAjax(''+config.basePath+config.sysOptionsDataModify , params , function(flag , data){
												var hintLabel = modifyPanel.find(".hintLabel") ;
												hintLabel[0].textContent = data.msg  ;
												hintLabel[0].style.color = "green"  ;
												hintLabel.show() ;
												setTimeout( function(){modifyPanel.panel().panel("close")} , 1000) ;
									}) ;
						}
						
						init() ;
　　　　};
　　　　return {
　　　　　　init: list
　　　　};
});