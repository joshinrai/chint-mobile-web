/***
 * @author : www.joshinrai.cn
 */
define(function (){	
	var inputPlugin = chintPlugins.inputPlugin ;
	var radioPlugin = chintPlugins.radioPlugin ;
　　var show = function (){
		new openAccount() ;
　　};
	var openAccount = Container.extends({
		//组件静态参数列表
		paramData : { deviceInfo : {
				inputs : [ 	
					{label:'设备编号',name:'devicecode' , readonly : true } , {label:'设备名称',name:'devicename' , readonly : true} , 
					{label:'设备种类',name:'devicetypename' , readonly : true} , {label:'设备型号',name:'devicemodelname' , readonly : true},
					{label:'透支金额',name:'creditamount' , readonly : true} , {label:'地址',name:'deviceaddress' , readonly : true}] ,
				doubleRadios : [ 	
					{data : [ { radioName : "后付费" , value : "1" } , { radioName : "预付费" , value : "0" }] , options : {title:"计费模式" , id : "chargemode"}} , 
					{data : [ { radioName : "是" , value : "1" } , { radioName : "否" , value : "0" }] , options : {title:"系统计费" , id : "syschargeflag"}} ,
					{data : [ { radioName : "是" , value : "1" } , { radioName : "否" , value : "0" }] , options : {title:"安全停气" , id : "safeshutflag"}}
				 ]
			} , 
			userInfo : { 
				inputs : [ 	
					{label:'户号',name:'accountno' , readonly : true} , {label:'用户名',name:'ownername'} , 
					{label:'证件号码',name:'pidcardno'} ,{label:'用户状态',name:'state' , readonly : true},
					{label:'手机',name:'mobileno'},{label:'固定电话',name:'telno'} , 
					{label:'联系地址',name:'address'}] 
			} ,
			chargeInfo : {
				inputs : [ 	
					{label:'表具单价',name:'hitransmoney1'} , {label:'安装费用',name:'hitransmoney2'} ,
					{label:'合计金额',name:'hitransmoney'}
				] ,
				collasibleRadios : [
					{data : [{text : "现金" , id : "1" } , {text : "银行卡" , id : "2" } , {text : "微信" , id : "3" },{text : "支付宝" , id : "4" },{text : "转账" , id : "5" }] , 
					options : {title:'缴费方式' ,  id:'hipaymode' , height : '10.9em' }}]
			} ,
			filterPanel : { 
				inputs : [ {label:'设备编号',name:'devicecode'} , {label:'设备名称',name:'devicename'} ] , 
				collasibleRadios : [
					{data : [ { text : "全部" , id : "" } , { text : "已开户" , id : "1" } , { text : "未开户" , id : "0" }] , options : {title:"开户状态" , id : "usestate"}} , 
					{data : [ { text : "全部" , id : "" } , { text : "是" , id : "1" } , { text : "否" , id : "0" }] , options : {title : "系统计费" , id : "syschargeflag"} }
				] 
			} 
		} ,
		//获取表具信息
		getDeviceData : function(params,scope){
			$.customAjax(''+config.basePath+config.searchDeviceByZone , params , function(flag , data){
				if('success' === flag)
					//渲染分页，table数据使用callback回调函数渲染
					chintPlugins.pageBreakPlugin.init(chintBodyMain.find('span'),data,{pageCount:5}).render(scope.renderTableBody , scope) ;
			}) ;
		},
		//获取设备细节信息数据
		getDeviceDetailData : function(deviceid){
			var p = new Promise(function(resolve, reject){
				$.customAjax(''+config.basePath+config.deviceDetail , { deviceid : deviceid } , function(flag , data){
					if('success' === flag) resolve(data) ;
				}) ;
			}) ;
			return p ;
		},
		//获取区域选择列表
		getZoneTree : function(){
			var p = new Promise(function(resolve, reject){
				$.customAjax(''+config.basePath+config.baseTblZoneTree , {showEmptyNode:0,keyId:''} , function(flag , data){
					if('success' === flag) resolve(data) ;
				}) ;
			}) ;
			return p ;
		},
		//获取证件类型数据
		getPidCardData : function(){
			var p = new Promise(function(resolve, reject){
				$.customAjax(''+config.basePath+config.getPidcardTree , {showEmptyNode:0,keyId:''} , function(flag , data){
					if("success" === flag) resolve(data) ;
				}) ;
			}) ;
			return p ;
		},
		//获取用户类型数据
		getUserTypeData : function(){
			var p = new Promise(function(resolve, reject){
				$.customAjax(''+config.basePath+config.getTypeCodeTree , {showEmptyNode:0,keyId:''} , function(flag , data){
					if("success" === flag) resolve(data) ;
				}) ;
			}) ;
			return p ;
		},
		//保存开户信息
		saveAccount : function(params){
			$.customAjax(''+config.basePath+config.addInfo , params , function(flag , data){
				if("error" == flag){
					$.fadeInPlugin("开户保存失败！请重试...") ;
				}else{
					$.fadeInPlugin("开户保存成功!") ;
				}
				loading.hide() ;				
			}) ;
		},			
		//渲染表具table的表头
		renderTableHead : function(){
			var self = this ;
			var chintMainInnerHtml   = [
				'<h2>表具查询</h2>' ,
			   	'<a id="filterConditionElement" href="#" data-ajax="false" style="float:right;margin-top:-3em;">过滤条件</a>' ,
			   	'<table data-role="table" data-column-btn-theme="b" data-column-popup-theme="a" data-mode="" class="table-stroke">' ,
					'<thead><tr class="th-groups"><th style="width:4.15em;">设备名称</th><th style="width:4.15em;">开户状态</th>' ,
					'<th style="width:4.15em;">计费模式</th><th style="width:4.15em;">系统计费</th></tr></thead>' ,
					'<tbody></tbody>',
			    '</table>',
			    '<span style="float:right;"></span>',
			   	'<h2 style="margin-top:2em;">表具信息</h2>',
			   	'<div id="deviceInfoDiv" />',
			   	'<h2/>',
			   	'<div role="navigation" class="ui-navbar" data-role="navbar" data-iconpos="left">' ,
					'<ul class="ui-grid-b"><li class="ui-block-a"><button class="ui-btn ui-icon-check ui-btn-icon-left" data-icon="check">开户</button></li>'  ,
					'<li class="ui-block-b"><button class="ui-btn ui-icon-cloud ui-btn-icon-left" data-icon="cloud" >保存</button></li>'  ,
					'<li class="ui-block-c"><button class="ui-btn ui-icon-back ui-btn-icon-left" data-icon="back">取消</button></li>'  ,
			   	'</ul></div>',
			   	'<h2  style="margin-top:1em;">用户信息</h2>',
			   	'<div id="userInfo" />',
			   	'<h2 style="margin-top:1em;">收费信息</h2>',
			   	'<div id="chargeInfo" />' ].join("") ;
			chintBodyMain.append(chintMainInnerHtml).trigger("create") ;
			self.getDeviceData({rows:10000},self) ;
		},
		//渲染表具table主体
		renderTableBody : function(data,scope){
			var fragment = document.createDocumentFragment();
			var optionTable = $(chintBodyMain).find('table tbody') ;
			optionTable.empty() ;//先清空table中的内容再渲染table
			data.rows.forEach(function(data,index){
				var tr= $(
					["<tr><td style='border:0;'>",data.devicename,"</td><td  style='border:0;'>",$.parseDoubleValue( data.usestate , "已开户" , "未开户") ,
						"</td><td style='border:0;'>",$.parseDoubleValue(data.chargemode , "后付费" , "预付费"),"</td><td  style='border:0;'>",
						$.parseDoubleValue( data.syschargeflag , "系统计费" , "表具计费" ),"</td></tr>",
						"<tr><td style='font-weight:bold ;border:0;'>设备编号</td><td colspan='3' style='border:0;'>",data.devicecode,"</td></tr>",
						"<tr><td style='font-weight:bold ;'>安装地址</td><td colspan='3'>",$.parseVoidValue( data.deviceaddress ),"</td></tr><tr/>"].join("")) ;
				tr.each(function(index){
					fragment.appendChild(this) ;
					chintPlugins.tablePlugin.trColorSetting(this,index,{total:3,tds:[1,3]}) ;//行点击效果
				}) ;
				tr.attr("userData" , JSON.stringify(data.deviceid) ) ;
				tr.on("touchstart" , function(){
					var deviceid = JSON.parse($(this).attr("userData")) ;
					scope.showDeviceDetail(scope,deviceid) ;
				} ) ;
			}) ;
			optionTable.append(fragment).trigger("create") ;
		},
		//渲染表具信息
		renderDeviceInfo : function(){
			var self = this ;
			var deviceFragment = document.createDocumentFragment() ;
			//渲染输入框列表
			self.paramData.deviceInfo.inputs.forEach(function(data , index){
				deviceFragment.appendChild( inputPlugin.init( null , {} , {labelName : data.label , id : data.name , name : data.name , type : data.type , readonly : data.readonly} ).render() ) ;
			}) ;
			//渲染单选框列表
			self.paramData.deviceInfo.doubleRadios.forEach(function(data , index){
				deviceFragment.appendChild(radioPlugin.init( null , data.data  , data.options ).doubleRender()[0])  ;
			}) ;
			chintBodyMain.find("#deviceInfoDiv").append( deviceFragment ) ;
		},
		//渲染用户信息
		renderUserInfo : function(){
			var self = this ;
			var inputs = self.paramData.userInfo.inputs ;
			var inputs1 = inputs.slice(0,2) ;
			var inputs2 = inputs.slice(2,4) ;
			var inputs3 = inputs.slice(4,7) ;
			var userFragment = document.createDocumentFragment() ;
			self.getPidCardData().then(function(data){
				inputs1.forEach(function(data , index){
					userFragment.appendChild( inputPlugin.init( null , {} , {labelName : data.label , id : data.name , name : data.name , type : data.type , readonly : data.readonly } ).render() ) ;
				}) ;
				var cardtype = [{data : data , 
					options : {title:'证件类型' ,  id:'pidcardtype' , height : '8.2em' }}] ;
				radioPlugin.renderCollasibleRadio( cardtype , userFragment ) ;

				inputs2.forEach(function(data , index){
					userFragment.appendChild( inputPlugin.init( null , {} , {labelName : data.label , id : data.name , name : data.name , type : data.type , readonly : data.readonly } ).render() ) ;
				}) ;
				return self.getUserTypeData() ;
			}).then(function(data){
				var usertype = [{data : data , 
					options : {title:'用户类型' ,  id:'typecode' , height : '8.2em' }}] ;
				radioPlugin.renderCollasibleRadio( usertype , userFragment ) ;
				inputs3.forEach(function(data , index){
					userFragment.appendChild( inputPlugin.init( null , {} , {labelName : data.label , id : data.name , name : data.name , type : data.type , readonly : data.readonly } ).render() ) ;
				}) ;
				chintBodyMain.find("#userInfo").append( userFragment ) ;
				chintBodyMain.trigger("create") ;
			}) ;
			
		},
		//渲染收费信息
		renderChargeInfo : function(){
			var self = this ;
			var chargeFragment = document.createDocumentFragment() ;
			self.paramData.chargeInfo.inputs.forEach(function(data , index){
				chargeFragment.appendChild( inputPlugin.init( null , {} , {labelName : data.label , id : data.name , name : data.name , type : data.type} ).render() ) ;
			}) ;
			radioPlugin.renderCollasibleRadio( self.paramData.chargeInfo.collasibleRadios , chargeFragment ) ;
			chintBodyMain.find("#chargeInfo").append( chargeFragment ) ;
		},
		//渲染表具信息菜单栏
		createDomInfo : function(){
			var self = this ;
			
			self.renderDeviceInfo() ;//渲染表具信息
			self.renderUserInfo() ;//渲染用户信息
			self.renderChargeInfo() ;//渲染收费信息
			
			chintBodyMain.trigger("create") ;//增加一次绘制，降低性能，提高感观
		} ,
		//获取设备细节信息
		showDeviceDetail : function(scope, deviceid){
			scope.checkedDeviceId = deviceid ;
			scope.getDeviceDetailData(deviceid).then(function(data){
				var deviceInfo = chintBodyMain.find("#deviceInfoDiv") ;
				var chintInput = deviceInfo.find(".chintInput") ;//点击表具时对表具信息中的输入框反显
				var userData = data.data ;
				chintInput.each(function( index , dom){
					$(dom).val(userData[dom.name]) ;
				}) ;
				//单选回显
				scope.paramData.deviceInfo.doubleRadios.forEach(function(data , index){
					var radio = deviceInfo.find("[name='radio-choice-"+data.options.id+"']") ;
					radioPlugin.doubleRadioreRender(radio , userData , data.options.id ) ;
				}) ;
			}) ;
			scope.setOpenBtn(scope) ;
		} ,
		//设置开户按钮为活动状态
		setOpenBtn : function(scope){
			var openAccountBtn = chintBodyMain.find(".ui-navbar button")[0] ;
			$(openAccountBtn).addClass("ui-btn-active") ;//选中某个表具时设置开户按钮为可选状态
			//为开户按钮绑定点击事件
			$(openAccountBtn).on("touchstart" , function(){
				scope.setAccountno(scope,this) ;
			} ) ;
		},
		//点击开户按钮时设置用户信息中的户号并设置导航按钮组样式
		setAccountno : function(scope,_this){
			$.customAjax(''+config.basePath+config.getAccountNo , {} , function(flag , data){
				$(chintBodyMain.find("#userInfo .chintInput")[0]).val(data.accountno) ;
			}) ;
			chintBodyMain.find("#state").val("开户") ;
			var navbarButtons = chintBodyMain.find(".ui-navbar button") ;
			navbarButtons.addClass("ui-btn-active") ;
			$(_this).removeClass("ui-btn-active") ;
			$(_this).off("touchstart") ;
			$(navbarButtons[1]).on("touchstart" , function(){
				scope.saveFunction(scope) ;
			}) ;
			$(navbarButtons[2]).on("touchstart" , function(){
				scope.quitFunction(scope , this) ;
			} ) ;
		},
		//按钮中的取消操作
		quitFunction : function(scope,_this){
			var navbarButtons = chintBodyMain.find(".ui-navbar button") ;
			navbarButtons.removeClass("ui-btn-active") ;
			scope.setOpenBtn(scope) ;
			$(_this).off("touchstart") ;
			$(navbarButtons[1]).off("touchstart") ;
			$("#userInfo").find(".chintInput").val("") ;
		},
		//添加过滤查询panel内容
		renderFilterPanel : function(){
			var self = this ;
			self.getZoneTree().then(function(data){
				self.paramData.filterPanel.collasibleRadios.push( {data : data , options : {title:'区域选择' ,  id:'zoneid' , height : '8.2em' } } );
				return "" ;
			}).then(function(data){
				var fragment = document.createDocumentFragment();
				fragment.appendChild($("<label>过滤条件</label>")[0]) ;
				self.paramData.filterPanel.inputs.forEach(function(data , index){
					fragment.appendChild( inputPlugin.init( null , {} , {labelName : data.label , id : data.name , name : data.name } ).render() ) ;
				}) ;
				radioPlugin.renderCollasibleRadio( self.paramData.filterPanel.collasibleRadios , fragment ) ;//绘制下拉单选组件
				var button = $("<button class='confirm-button'>确认</button>") ;
				fragment.appendChild(button[0]) ;
				filterInner.append(fragment).trigger("create") ;
				//过滤查询button绑定事件
				button.on("touchstart" , function(){
					$.queryContext( filterInner , filterPanel , self.getDeviceData , null , self ) ;
					self.checkedZoneId = radioPlugin.setParams({} , 
							filterInner.find("input[name*='zoneid']").closest("[data-role='collapsible']")).zoneid ;//设置zoneid
				}) ;
			}) ;
			//为过滤条件标签绑定touch事件
			$(chintBodyMain).find('#filterConditionElement').on('touchstart',function(){
				filterPanel.find("input").val("") ;
				radioPlugin.reRenderRadioIcons( filterInner.find(".ui-collapsible") , "") ;
				filterPanel.panel().panel("open");
			}) ;
		} ,
		//设置导航按钮组中的保存按钮操作
		saveFunction : function(scope){
			var params = {} ;
			params.hizoneid = scope.checkedZoneId ;
			params.hideviceid = scope.checkedDeviceId ;
			inputPlugin.setParams( params , chintBodyMain.find("#chargeInfo") ) ;
			radioPlugin.setParams( params , chintBodyMain.find("#chargeInfo") ) ;
			inputPlugin.setParams( params , chintBodyMain.find("#userInfo") ) ;
			radioPlugin.setParams( params , chintBodyMain.find("#userInfo") ) ;
			params.state = "1" ;
			scope.saveAccount(params) ;
			return false ;
		},
		init : function(){
			var self = this ;
			$.emptyInnerPanel() ;
			self.renderTableHead() ;//渲染表头
			self.createDomInfo() ;//渲染表具信息菜单栏
			self.renderFilterPanel() ;//渲染过滤条件panel
		}
	}) ;
　　return {
　　　　init: show
　　};
});