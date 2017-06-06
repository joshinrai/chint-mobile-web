define(function (){
　　　　var list = function (){
					//营业厅数据、角色名称和区域数据列表
					var collapsibleDataHandle = function(){
								//营业厅数据
								$.customAjax(''+config.basePath+config.sysTbldepartDataList , {showEmptyNode:0,keyId:''} , function(flag , data){
										var filterLobby = $("#filterLobbyDataList").empty() ;
										var filterPlugin = chintPlugins.collapsiblePlugin.init(null , data , {title:'营业厅' ,  id:'allLobbyFilter' , height : '200px' }).legendRender( ) ;
										filterLobby.append(filterPlugin) ;
										filterInner.trigger("create") ;
										
										var modifyLobby = $("#modifyLobbyDataList").empty() ;
										var modifyPlugin = chintPlugins.radioPlugin.init(null , data , {title : '营业厅' , id : 'allLobbyModify' }).radioIconsRender() ;
										modifyLobby.append(modifyPlugin) ;
										modifyInner.trigger("create") ;
								}) ;
								
								//角色名称列表
								$.customAjax(''+config.basePath+config.sysTblroleGetAllRole , {} , function(flag , data){
										var filterRole = $("#filterRoleDataList").empty() ;
										var filterPlugin = chintPlugins.collapsiblePlugin.init(null , data , {title:'角色名称',id:'allRoleFilter' , height : '200px' }).legendRender() ;
										filterRole.append(filterPlugin) ;
										filterInner.trigger("create") ;
										
										var modifyRole = $("#modifyRoleDataList").empty() ;
										var modifyPlugin = chintPlugins.collapsiblePlugin.init(null , data , {title:'角色名称' ,  id:'allRoleModify' , height : '200px' }).legendRender( ) ;
										modifyRole.append(modifyPlugin) ;
										modifyInner.trigger("create") ;
								}) ;
											
								//数据区域列表
								$.customAjax(''+config.basePath+config.baseTbZoneGetZoneTree , {showEmptyNode:0,keyId:''} , function(flag , data){
										var modifyZone = $("#modifyZoneDataList").empty() ;
										var plugin = chintPlugins.collapsiblePlugin.init(null , data , {title:'区域数据访问权限' , id:'allZoneModify' , height : '200px' }).legendRender() ;
										modifyZone.append(plugin) ;
										modifyInner.trigger("create") ;
								}) ;
					}
					
					//初始化chintBodyMain中内容
					var init = function(){
						$.emptyInnerPanel() ;
						var chintMainInnerHtml   =  ''  ;
							  chintMainInnerHtml += '<h2>人员管理</h2>'  ;
							  chintMainInnerHtml += '<div">'  ;
							  chintMainInnerHtml += 		'<a id="addElement" href="#" data-ajax="false" class="addElement">添加</a>' ;
							  chintMainInnerHtml += 		'<a id="filterConditionElement" href="#" data-ajax="false" class="filterConditionElement">过滤查询</a>' ;
							  chintMainInnerHtml += '</div>'  ;
							  chintMainInnerHtml += '<table data-role="table" data-column-btn-theme="b" data-column-popup-theme="a" data-mode="" class="table-stroke">' ;
							  chintMainInnerHtml += 		'<thead><tr class="th-groups"><th style="width:4.15em;">登录账号</th><th style="width:3.15em;">用户名</th>' ;
							  chintMainInnerHtml += 		'<th style="min-width:5.15em;">超级管理员</th><th style="width:5.15em;">所属营业厅</th></tr></thead>' ;
							  chintMainInnerHtml +=		 '<tbody></tbody>' ;
							  chintMainInnerHtml += '</table>' ;
							  chintMainInnerHtml += '<span style="float:right;"></span>'  ;
						chintBodyMain.append(chintMainInnerHtml).trigger("create") ;
						tableDataHandle({rows:1000}) ;  //设置初始查询为1000条数据，并将数据存入到sessionStorage中
						collapsibleDataHandle() ;//设置角色名称、区域数据和营业厅数据
						renderModifyPanel() ;	//修改panel
						renderAddPanel() ;			//添加panel
						renderFilterPanel() ;		//查询panel
					}
					
					//table数据处理
					var tableDataHandle = function(params){
							//添加table数据
							$.customAjax(''+config.basePath+config.sysTblUserDataList , params , function(flag , data){
								if('success' === flag){
									//渲染分页，table数据使用callback回调函数渲染
									chintPlugins.pageBreakPlugin.init(chintBodyMain.find('span'),data,{pageCount:2}).render(renderTbluserTable) ;
								}
							}) ;
					}
					
					//渲染人员管理table
					var renderTbluserTable = function(data){
						var fragment = document.createDocumentFragment();
						var optionTable = $(chintBodyMain).find('table tbody') ;
						optionTable.empty() ;//先清空table中的内容再渲染table
						data.rows.forEach(function(data,index){
								var isAdmin = (1==data.sysflag)?'是':'否' ;
								var isForbid = (1==data.deletedflag)?'禁用':'启用' ;
								//设置操作对象
								var userData = {} ;
								for( var key in data ){
									if('createtime' == key ||'logintime' == key ||'updatetime' == key) continue ;
									userData[key] = data[key];//data中没有object
									if( "userid" == key ) userData.id = data[key] ;//删除判定条件需要用到id，所以将id设置为userid
								}
								//将数据绑定到最后一个tr的userData中，方便修改、删除、重置密码操作
								var tr = $("<tr><td style='border:0;'>"+data.userno+"</td><td style='border:0;'>"+data.username+"</td><td style='border:0;'>"+isAdmin+"</td><td style='border:0;'>"+data.departmentname+"</td></tr>"+
												"<tr><td style='font-weight:bold;border:0;'>所属角色</td><td style='border:0;'>"+data.rolenames+"</td><td style='font-weight:bold;border:0;'>座机</td><td style='border:0;'>"+data.phoneno+"</td></tr>"+
												"<tr><td style='font-weight:bold;border:0;'>移动电话</td><td style='border:0;'>"+data.telno+"</td><td style='font-weight:bold;border:0;'>状态</td><td style='border:0;'>"+isForbid+"</td></tr>"+
												"<tr><td style='font-weight:bold;border:0;'>登录次数</td><td style='border:0;'>"+data.logincount+"</td><td style='font-weight:bold;border:0;'>创建人</td><td style='border:0;'>"+data.createByUserName+"</td></tr>"+
												"<td style='font-weight:bold;border:0;'>最后登录时间</td><td style='border:0;' colspan='3'>"+data.logintime+"</td>"+
												"<tr><td style='font-weight:bold;border:0;'>创建时间</td><td style='border:0;' colspan='3'>"+data.createtime+"</td></tr>"+
												"<tr><td style='font-weight:bold;border:0;'>最后修改时间</td><td style='border:0;'>"+data.updatetime+"</td><td style='font-weight:bold;border:0;'>最后修改人</td><td style='border:0;'>"+data.updateByUserName+"</td></tr>"+
												"<tr userData="+JSON.stringify({data:userData,index:index})+"><td/>"+
														"<td><a style='font-weight:300 ;'>修改</a></td>"+
														"<td><a href='#modifyPopup' data-rel='popup' data-position-to='window' data-transition='pop' style='font-weight:300;text-decoration:none;'>删除</a></td>"+
														"<td><a href='#modifyPopup' data-rel='popup' data-position-to='window' data-transition='pop' style='font-weight:300;text-decoration:none;'>重置密码</a></td>"+
												"</tr>") ;
								tr.each(function(index){
									fragment.appendChild(this) ;
									chintPlugins.tablePlugin.trColorSetting(this,index,{total:7,tds:[1,3]}) ;//行点击效果
								}) ;
								aTds = tr.find('a') ;
								//修改
								$(aTds[0]).on('click',function(){
										modifyEvent(this) ;
								}) ;
								//删除
								$(aTds[1]).on('click',function(){
										var url = config.basePath+config.sysTblRoleDelete ;
										$.deleteSelectedData(this , url , tableDataHandle ) ;
								}) ;
								//重置密码
								$(aTds[2]).on('click',function(){
										resetPopupEvent(this) ;
								}) ;
						}) ;
						optionTable.append(fragment).trigger("create") ;
					} 
					
					//添加
					var renderAddPanel = function(){
								chintBodyMain.find('#addElement').on('click',function(){
										var collapsiblePlugin = chintPlugins.collapsiblePlugin ;
										var inputPlugin = chintPlugins.inputPlugin ;
										var fragment = document.createDocumentFragment() ;
										
										modifyInner.find(".hintLabel").hide() ;
										
										modifyInner.find('label')[0].textContent = '添加' ;
										var inputs = modifyInner.find('input') ;
										modifyInner.find(".chintInput").val("") ;
										inputs[2].placeholder = "" ;
										inputs[3].placeholder = "" ;
										var inputPwd = modifyInner.find('#password')  ;
										var confirmPwd = modifyInner.find('#confirmPwd') ;
										
										chintPlugins.radioPlugin.reRenderRadioIcons( modifyInner.find("#modifyLobbyDataList") , "") ;
										collapsiblePlugin.legendreRender( modifyInner.find("#modifyRoleDataList") , "") ;
										collapsiblePlugin.legendreRender( modifyInner.find("#modifyZoneDataList") , "") ;
										
										var userMsg = JSON.parse(sessionStorage.userMsg) ;
										var button = modifyInner.find("button") ; 
										button[0].attributes.userid = "" ;
										button[0].attributes.createby = userMsg.data.userid ;
										button[0].attributes.updateby = userMsg.data.userid ;
										
										showInputPwd( inputPwd.parent() , confirmPwd.parent() , true) ;
										modifyPanel.panel().panel("open");
								}) ;
					}
					
					//添加过滤查询panel内容
					var renderFilterPanel = function(){
								filterInner.append("<label>过滤查询</label>") ;
								chintPlugins.inputPlugin.init(filterInner , {} , {labelName:'登录账号',id:'userno',name:'userno',style:true}).render() ;
								chintPlugins.inputPlugin.init(filterInner , {} , {labelName:'用户名称',id:'username',name:'username',style:true}).render() ;
								filterInner.append("<div id='filterLobbyDataList' style='margin: .3em 0 ;'></div>") ;
								filterInner.append("<div id='filterRoleDataList' style='margin: .3em 0 ;'></div>") ;
								filterInner.append("<button>查询</button>").trigger('create') ;
								//显示过滤查询panel
								$(chintBodyMain).find('#filterConditionElement').on('click',function(){
										filterInner.find('.chintInput').val("") ;
										filterPanel.panel().panel("open");
								}) ;
								//点击查询按钮操作
								filterInner.find('button').on('click',filterPanelQuery) ;
					}
					
					//查询符合的内容
					var filterPanelQuery = function(){
								var params = {} ;
								var lobbyArray = [] ;
								var roleArray = [] ;
								var collapsiblePlugin = chintPlugins.collapsiblePlugin ;
								params.rows = 1000 ;
								var chintInput = filterInner.find('.chintInput') ;
								chintInput.each(function(index , data){
										params[data.name] = data.value ;
								}) ;
								params.departmentid = collapsiblePlugin.getValueFromEle(filterInner.find('#filterLobbyDataList .ui-checkbox-on')) ;
								params.roleids = collapsiblePlugin.getValueFromEle(filterInner.find('#filterRoleDataList .ui-checkbox-on') ) ;
								
								tableDataHandle(params) ;
								filterPanel.panel().panel("close");
					}
					
					//添加 修改panel内容
					var renderModifyPanel = function(){
								var inputPlugin = chintPlugins.inputPlugin ;
								var radioPlugin = chintPlugins.radioPlugin ;
								var fragment = document.createDocumentFragment() ;
								fragment.appendChild($("<label>")[0]) ;
								
								var dataArray = [{label:'登录账号',name:'userno'} , {label:'用户名称',name:'username'} , {label:'密码',name:'password' , type : 'password'} , {label:'确认密码',
															name:'confirmPwd' , type : 'password'}, {label:'电子邮箱',name:'email'} , {label:'移动电话',name:'telno'} , {label:'座机',name:'phoneno'}] ;
								dataArray.forEach(function(data , index){
											fragment.appendChild( inputPlugin.init( null , {} , {labelName : data.label , id : data.name , name : data.name , type : data.type } ).render() ) ;
								}) ;
								var textArea = chintPlugins.textareaPlugin.init( null , {} , {labelName:'描述',id:'description',name:'optiondescription'} ).render() ;
								fragment.appendChild(textArea) ;
								fragment.appendChild(radioPlugin.init( null , [{radioName:'否' , value : '0'},{radioName:'是' , value : '1'}] , {title : '管理员' , id : 'sysflag'} ).doubleRender()[0]) ;
								fragment.appendChild(radioPlugin.init( null , [{radioName:'启用' , value : '0' },{radioName:'禁用' , value : '1'}] , {title : '状态' , id : 'deletedflag'} ).doubleRender()[0]) ;
								fragment.appendChild($("<div id='modifyLobbyDataList' style='margin: .3em 0'></div>")[0]) ;
								fragment.appendChild($("<div id='modifyRoleDataList' style='margin: .3em 0'></div>")[0]) ;
								fragment.appendChild($("<div id='modifyZoneDataList' style='margin: .3em 0'></div>")[0]) ;
								var hintLabel = $("<label style='color:red;' class='hintLabel'></label>") ;
								fragment.appendChild(hintLabel[0]) ;
								hintLabel.hide() ;
								var button = $("<button class='ui-btn ui-shadow ui-corner-all'>确定</button>") ;
								button.on("click",function(){
											modifyConfirm(modifyInner) ;
								}) ;
								fragment.appendChild(button[0]) ;
								modifyInner.append(fragment) ;
								modifyInner.trigger("create") ;
					}
					
					//添加 修改 的确定操作
					var modifyConfirm = function(panel){
								var collapsiblePlugin = chintPlugins.collapsiblePlugin ;
								var params = {} ;
								var label = panel.find(".hintLabel") ;
								var inputs = panel.find(".chintInput") ;
								inputs.each(function(index , data){
										params[data.name] = data.value ; 
								}) ;
								
								if( "" == inputs[0].value  || "" == inputs[1].value  ){
										$.hintLabel(label , "登录账号或者用户名称未填写") ;
										return ;
								}
								
								if( "block" == panel.find("#password").parent()[0].style.display ){
										if( "" == inputs[2].value  ||  "" == inputs[3].value ){
												$.hintLabel(label , "密码或确认密码未填写") ;
												return ;
										}else if(params.confirmPwd != params.password){
												$.hintLabel(label , "确认密码和密码不一致") ;
												return ;
										}
								}else{
										delete params.password ;
								}
								delete params.confirmPwd ;
								params.description = panel.find("textarea")[0].value ;
								var activeBtn = panel.find(".ui-btn-active") ;
								activeBtn.each(function(index , data){
										params[data.attributes.name.value] = data.attributes.value.value ;
								}) ;
								var radio = panel.find(".radioChecked") ;
								if(!radio[0]){
										$.hintLabel(label , "未选择营业厅") ;
										return ;
								}else{
										label.hide() ;
								}
								params.departmentid = radio[0] ? radio[0].attributes.dataId.value : "" ;
								
								params.roleids = collapsiblePlugin.getValueFromEle( panel.find("#modifyRoleDataList .ui-checkbox-on") ) ;
								params.zoneids = collapsiblePlugin.getValueFromEle( panel.find("#modifyZoneDataList .ui-checkbox-on") ) ;
								
								params.userid = panel.find("button")[0].attributes.userid ;
								params.createby = panel.find("button")[0].attributes.createby ;
								params.updateby = panel.find("button")[0].attributes.updateby ;
								
								$.customAjax(''+config.basePath+config.sysTblRoleSave , params , function(flag , data){
										var lable = $(chintBodyMain).parent().find('#modifyPanel .ui-panel-inner .hintLabel') ;
										$.hintLabel(label , data.msg , "green") ;
										tableDataHandle({rows:1000}) ;		//添加后执行查询操作
										setTimeout(function(){ modifyPanel.panel().panel("close") } , 1000) ;
								}) ;
					}
					
					//修改操作
					var modifyEvent = function(self){
								var radioPlugin = chintPlugins.radioPlugin ;
								var collapsiblePlugin = chintPlugins.collapsiblePlugin ;
								var panel = chintBodyMain.parent().find('#modifyPanel') ;
								panel.find('label')[0].textContent = '修改' ;
								panel.find(".hintLabel").hide() ;
								var userData = JSON.parse(self.parentNode.parentNode.attributes.userData.value) ;
								var inputs = panel.find('input') ;
								inputs.each(function(data,index){
										this.value = userData.data[this.name] ;
								}) ;
								
								//单选回显
								["sysflag","deletedflag"].forEach(function(data , index){
										var radio = panel.find("[name='radio-choice-"+data+"']") ;
										radioPlugin.doubleRadioreRender(radio , userData.data , data) ;
								}) ;
								
								radioPlugin.reRenderRadioIcons( panel.find("#modifyLobbyDataList") , userData.data.departmentid ) ;
								collapsiblePlugin.legendreRender( panel.find("#modifyRoleDataList") , userData.data.roleids ) ;
								collapsiblePlugin.legendreRender( panel.find("#modifyZoneDataList") , userData.data.zoneids ) ;
								
								var userMsg = JSON.parse(sessionStorage.userMsg) ;
								var button = panel.find("button") ;
								button[0].attributes.userid = userData.data.userid ;
								button[0].attributes.updateby = userMsg.data.userid ;
								button[0].attributes.createby = "" ;
								
								//隐藏密码输入框
								var inputPwd = panel.find('#password')  ;
								var confirmPwd = panel.find('#confirmPwd') ;
								if(inputPwd[0]) showInputPwd( inputPwd.parent() , confirmPwd.parent() , false) ;
								panel.panel().panel("open");
					}
					
					//是否显示密码输入框
					var showInputPwd = function(inputPwd,confirmPwd,bool){
								inputPwd.prev()[0].style.display = bool ? 'block' : 'none' ;
								inputPwd[0].style.display = bool ? 'block' : 'none' ;
								confirmPwd.prev()[0].style.display = bool ? 'block' : 'none' ;
								confirmPwd[0].style.display = bool ? 'block' : 'none' ;
					}
					
					//重置密码操作
					var resetPopupEvent = function(self){
								var options = {h1:'重置密码',h3:'确定要重置密码吗?',a0:'确定',a1:'取消'} ;
								var popup = $.renderPopup( $('#modifyPopup')  , options ) ;
								var dataId = JSON.parse($(self).parent().parent()[0].attributes.userdata.value).data.userid ;
								var popupA = $(popup.find('a')[0]) ;
								popupA.attr('resetparam',JSON.stringify({dataId : dataId})) ;
								popupA.on('click',function(){
									var dataId = this.attributes.resetparam.value ;
									$.customAjax(''+config.basePath+config.updateInitPassword , {id:dataId} , function(flag , data){
											var options = {h1:'重置密码',h3:'重置密码成功',a0:'确定',a1:'取消'} ;
											console.log("重置密码" , data) ;
									}) ;
								}) ;
					}
					
		init() ;
		//new sysTblUser() ;
　　};

	var sysTblUser = Container.extends({
		//过滤条件和修改的panel中组件静态数据
  		panelData : {
			filterPanel : {
				inputs : [{label:'登录账号',name:'userno'} , {label:'用户名称',name:'username'}]
			} ,
			modifypanel :{
				inputs : [{label:'登录账号',name:'userno'} , {label:'用户名称',name:'username'} , 
						  {label:'密码',name:'password' , type : 'password'} , 
						  {label:'确认密码',name:'confirmPwd' , type : 'password'}, 
						  {label:'电子邮箱',name:'email'} , {label:'移动电话',name:'telno'} , 
						  {label:'座机',name:'phoneno'}] ,
				textarea : [{labelName:'描述',id:'description',name:'optiondescription'}] ,
				doubleRadio : [{
									data : [{radioName:'否' , value : '0'},{radioName:'是' , value : '1'}] , 
									option : {title : '管理员' , id : 'sysflag'}
								},
								{
									data : [{radioName:'启用' , value : '0' },{radioName:'禁用' , value : '1'}] , 
									option : {title : '状态' , id : 'deletedflag'}
								}] 
			}
		} ,
		//获取营业厅数据
		getDepartDataList : function(){
			var p = new Promise(function(resolve, reject){
				$.customAjax(''+config.basePath+config.sysTbldepartDataList , {showEmptyNode:0,keyId:''} , function(flag , data){
					if('success' === flag)
						resolve(data) ;
				}) ;
			}) ;
			return p ;
		},
		//获取角色名称列表
		getAllRole : function(){
			var p = new Promise(function(resolve, reject){
				$.customAjax(''+config.basePath+config.sysTblroleGetAllRole , {} , function(flag , data){
					if('success' === flag)
						resolve(data) ;
				}) ;
			}) ;
			return p ;
		},
		//获取数据区域列表
		getZoneTree : function(){
			var p = new Promise(function(resolve, reject){
				$.customAjax(''+config.basePath+config.baseTbZoneGetZoneTree , {showEmptyNode:0,keyId:''} , function(flag , data){
					if('success' === flag)
						resolve(data) ;
				}) ;
			}) ;
			return p ;
		},
		//设置初始化异步数据
		setAsynData : function(){
			var self = this ;
			filterColl = [] ;
			modifyColl = [] ;
			self.getDepartDataList().then(function(data){//添加营业厅下拉列表框
				var option = {title:'营业厅' ,  id:'allLobbyFilter' , height : '8.2em' } ;
  				filterColl.push({data : data , options : option }) ;
  				modifyColl.push({data : data , options : option }) ;
  				return self.getAllRole() ;
  			}).then(function(data){
  				var option = {title:'角色名称' ,  id:'allRoleFilter' , height : '8.2em' } ;
  				filterColl.push({data : data , options : option }) ;
  				modifyColl.push({data : data , options : option }) ;
  				return self.getZoneTree() ;
  			}).then(function(data){
  				var option = {title:'区域数据访问权限' , id:'allZoneModify' , height : '8.2em' } ;
  				modifyColl.push({data : data , options : option}) ;
  				return "" ;
  			}).then(function(data){
  				self.renderFilterPanel(filterColl) ;//渲染过滤条件panel
  				self.renderModifyPanel(modifyColl) ;//渲染修改panel
  			}) ;
		},

		//获取人员数据
		getTblUserData : function(params,_this){
			var self = this == window ? _this : this ;
			$.customAjax(''+config.basePath+config.sysTblUserDataList , params , function(flag , data){
				if('success' === flag)
					//渲染分页，table数据使用callback回调函数渲染
					chintPlugins.pageBreakPlugin.init(chintBodyMain.find('span'),data,{pageCount:2}).render(self.renderTbluserTable , self) ;
			}) ;
		},
		//渲染table主体
		renderTableBody : function(){
			var self = this ;
			var chintMainInnerHtml = ['<h2>人员管理</h2>' ,
				  	'<div">' ,
				  		'<a id="addElement" href="#" data-ajax="false" class="addElement">添加</a>' ,
				  		'<a id="filterConditionElement" href="#" data-ajax="false" class="filterConditionElement">过滤查询</a>' ,
				  	'</div>' ,
				  	'<table data-role="table" data-column-btn-theme="b" data-column-popup-theme="a" data-mode="" class="table-stroke">' ,
				  		'<thead><tr class="th-groups"><th style="width:4.15em;">登录账号</th><th style="width:3.15em;">用户名</th>' ,
				  		'<th style="min-width:5.15em;">超级管理员</th><th style="width:5.15em;">所属营业厅</th></tr></thead>' ,
				  	 	'<tbody></tbody>' ,
				  	'</table>' ,
				  	'<span style="float:right;"></span>'].join("") ;
			chintBodyMain.append(chintMainInnerHtml).trigger("create") ;
			self.getTblUserData({rows:10000}) ;
			self.addEvent4Add() ;
		},
		//渲染人员管理table
		renderTbluserTable : function(data , _this){
			var self = this == window ? _this : this;

			var fragment = document.createDocumentFragment();
			var optionTable = $(chintBodyMain).find('table tbody') ;
			optionTable.empty() ;//先清空table中的内容再渲染table
			data.rows.forEach(function(data,index){
					var isAdmin = (1==data.sysflag)?'是':'否' ;
					var isForbid = (1==data.deletedflag)?'禁用':'启用' ;
					//设置操作对象
					var userData = {} ;
					for( var key in data ){
						if('createtime' == key ||'logintime' == key ||'updatetime' == key) continue ;
						userData[key] = data[key];//data中没有object
						if( "userid" == key ) userData.id = data[key] ;//删除判定条件需要用到id，所以将id设置为userid
					}
					//将数据绑定到最后一个tr的userData中，方便修改、删除、重置密码操作
					var tr = $(["<tr><td style='border:0;'>",data.userno,"</td><td style='border:0;'>",data.username,"</td><td style='border:0;'>",isAdmin,"</td><td style='border:0;'>",data.departmentname,"</td></tr>",
									"<tr><td style='font-weight:bold;border:0;'>所属角色</td><td style='border:0;'>",data.rolenames,"</td><td style='font-weight:bold;border:0;'>座机</td><td style='border:0;'>",data.phoneno,"</td></tr>",
									"<tr><td style='font-weight:bold;border:0;'>移动电话</td><td style='border:0;'>",data.telno,"</td><td style='font-weight:bold;border:0;'>状态</td><td style='border:0;'>",isForbid,"</td></tr>",
									"<tr><td style='font-weight:bold;border:0;'>登录次数</td><td style='border:0;'>",data.logincount,"</td><td style='font-weight:bold;border:0;'>创建人</td><td style='border:0;'>",data.createByUserName,"</td></tr>",
									"<td style='font-weight:bold;border:0;'>最后登录时间</td><td style='border:0;' colspan='3'>",data.logintime,"</td>",
									"<tr><td style='font-weight:bold;border:0;'>创建时间</td><td style='border:0;' colspan='3'>",data.createtime,"</td></tr>",
									"<tr><td style='font-weight:bold;border:0;'>最后修改时间</td><td style='border:0;'>",data.updatetime,"</td><td style='font-weight:bold;border:0;'>最后修改人</td><td style='border:0;'>",data.updateByUserName,"</td></tr>",
									"<tr userData=",JSON.stringify({data:userData,index:index}),"><td/>",
											"<td><a style='font-weight:300 ;'>修改</a></td>",
											"<td><a href='#modifyPopup' data-rel='popup' data-position-to='window' data-transition='pop' style='font-weight:300;text-decoration:none;'>删除</a></td>",
											"<td><a href='#modifyPopup' data-rel='popup' data-position-to='window' data-transition='pop' style='font-weight:300;text-decoration:none;'>重置密码</a></td>",
									"</tr>"].join("")) ;
					tr.each(function(index){
						fragment.appendChild(this) ;
						chintPlugins.tablePlugin.trColorSetting(this,index,{total:7,tds:[1,3]}) ;//行点击效果
					}) ;
					aTds = tr.find('a') ;
					//修改
					$(aTds[0]).on('click',function(){
							self.modifyEvent(this) ;
					}) ;
					//删除
					$(aTds[1]).on('click',function(){
							var url = config.basePath+config.sysTblRoleDelete ;
							$.deleteSelectedData(this , url , tableDataHandle ) ;
					}) ;
					//重置密码
					$(aTds[2]).on('click',function(){
							resetPopupEvent(this) ;
					}) ;
			}) ;
			optionTable.append(fragment).trigger("create") ;
		},
		//添加过滤查询panel内容
		renderFilterPanel : function(filterColl){
			var self = this ;
  			var inputPlugin = chintPlugins.inputPlugin ;
  			var radioPlugin = chintPlugins.radioPlugin ;
  			var filterPanelData = self.panelData.filterPanel ;
  			var filterInputs = filterPanelData.inputs ;
			var fragment = document.createDocumentFragment();

			filterInner.append("<label>过滤查询</label>") ;
			filterInputs.forEach(function(data , index){
				fragment.appendChild( inputPlugin.init( null , {} , {labelName : data.label , id : data.name , name : data.name } ).render() ) ;
			}) ;
			radioPlugin.renderCollasibleRadio( filterColl , fragment ) ;//绘制下拉单选组件

			var button = $("<button class='confirm-button'>确认</button>") ;
			fragment.appendChild(button[0]) ;
			filterInner.append(fragment).trigger("create") ;
			button.on("touchstart" , function(){
				$.queryContext( filterInner , filterPanel , self.getTblUserData , null , self) ;
			}) ;
			//显示过滤查询panel
			$(chintBodyMain).find('#filterConditionElement').on('touchstart',function(){
				filterInner.find('.chintInput').val("") ;
				filterPanel.panel().panel("open");
			}) ;
		},
		//渲染修改/添加panel
		renderModifyPanel : function(modifyColl){
			var self = this ;
			var inputPlugin = chintPlugins.inputPlugin ;
			var radioPlugin = chintPlugins.radioPlugin ;
			var modifyPanelData = self.panelData.modifypanel ;
			var modifyInputs = modifyPanelData.inputs ;
			var textarea = modifyPanelData.textarea ;
			var doubleRadio = modifyPanelData.doubleRadio ;

			var fragment = document.createDocumentFragment() ;
			fragment.appendChild($("<label>")[0]) ;
			modifyInputs.forEach(function(data , index){
				fragment.appendChild( inputPlugin.init( null , {} , {labelName : data.label , id : data.name , name : data.name , readonly : data.readonly , type : data.type } ).render() ) ;
			}) ;
			fragment.appendChild( chintPlugins.textareaPlugin.init( null , {} , textarea[0] ).render()) ;
			doubleRadio.forEach(function(data , index){
				fragment.appendChild( radioPlugin.init( null , data.data , data.option ).doubleRender()[0] ) ;
			}) ;
			radioPlugin.renderCollasibleRadio( modifyColl , fragment ) ;//绘制下拉单选组件
			
			var hintLabel = $("<label style='color:red;' class='hintLabel'></label>") ;
			fragment.appendChild(hintLabel[0]) ;
			var button = $("<button class='confirm-button'>确认</button>") ;
			fragment.appendChild(button[0]) ;
			modifyInner.append(fragment).trigger("create") ;

		},
		//为"添加"绑定事件
		addEvent4Add : function(){
			chintBodyMain.find('#addElement').on('touchstart',function(){
				var collapsiblePlugin = chintPlugins.collapsiblePlugin ;
				var inputPlugin = chintPlugins.inputPlugin ;
				var fragment = document.createDocumentFragment() ;
				
				modifyInner.find(".hintLabel").hide() ;
				
				modifyInner.find('label')[0].textContent = '添加' ;
				var inputs = modifyInner.find('input') ;
				modifyInner.find(".chintInput").val("") ;
				inputs[2].placeholder = "" ;
				inputs[3].placeholder = "" ;
				
				var userMsg = JSON.parse(sessionStorage.userMsg) ;
				var button = modifyInner.find("button") ; 
				button.attr({userid : "" , createby : userMsg.data.userid , updateby : userMsg.data.userid}) ;

				modifyPanel.panel().panel("open");
			}) ;
		},
		//修改操作
		modifyEvent : function(self){
			var radioPlugin = chintPlugins.radioPlugin ;
			var collapsiblePlugin = chintPlugins.collapsiblePlugin ;
			var panel = chintBodyMain.parent().find('#modifyPanel') ;
			panel.find('label')[0].textContent = '修改' ;
			panel.find(".hintLabel").hide() ;
			var userData = JSON.parse(self.parentNode.parentNode.attributes.userData.value) ;
			var inputs = panel.find('input') ;
			inputs.each(function(data,index){
				this.value = userData.data[this.name] ;
			}) ;
			
			//单选回显
			["sysflag","deletedflag"].forEach(function(data , index){
				var radio = panel.find("[name='radio-choice-"+data+"']") ;
				radioPlugin.doubleRadioreRender(radio , userData.data , data) ;
			}) ;
			
			//radioPlugin.reRenderRadioIcons( panel.find("#modifyLobbyDataList") , userData.data.departmentid ) ;
			//collapsiblePlugin.legendreRender( panel.find("#modifyRoleDataList") , userData.data.roleids ) ;
			//collapsiblePlugin.legendreRender( panel.find("#modifyZoneDataList") , userData.data.zoneids ) ;
			
			var userMsg = JSON.parse(sessionStorage.userMsg) ;
			var button = panel.find("button") ;
			button.attr({createby:"" , updateby : userMsg.data.userid , userid : userData.data.userid}) ;
			
			//隐藏密码输入框
			var inputPwd = panel.find('#password')  ;
			var confirmPwd = panel.find('#confirmPwd') ;
			//if(inputPwd[0]) showInputPwd( inputPwd.parent() , confirmPwd.parent() , false) ;
			panel.panel().panel("open");
		},
		//是否显示密码输入框
		showInputPwd : function(inputPwd,confirmPwd,bool){
			inputPwd.prev()[0].style.display = bool ? 'block' : 'none' ;
			inputPwd[0].style.display = bool ? 'block' : 'none' ;
			confirmPwd.prev()[0].style.display = bool ? 'block' : 'none' ;
			confirmPwd[0].style.display = bool ? 'block' : 'none' ;
		},
		init : function(){
			var self = this ;
			$.emptyInnerPanel() ;//清空内容
			self.renderTableBody() ;//渲染table主体
			self.setAsynData() ;//获取异步数据并渲染panel
		}
	}) ;

　　return {
　　　　init: list
　　};
});