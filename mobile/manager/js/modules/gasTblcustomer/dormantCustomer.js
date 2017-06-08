define(function (){
　　var dormant = function (){
		new dormantCustomer() ;
　　};
	var dormantCustomer = Container.extends({
		paramData : { filterPanel : {
			collasibleRadios : [{data : [{text : "全部" , id : " " } , {text : "充值" , id : "1" } , 
									{text : "缴费" , id : "3" },{text : "消费" , id : "4" }] , 
								options : {title:'交易类型' ,  id:'transtype' , height : '10.9em' }} , 
									{data : [{text : "1个月" , id : "1" } , {text : "3个月" , id : "3" } , 
									{text : "6个月" , id : "6" },{text : "12个月" , id : "12" }] , 
								options : {title:'休眠期限' ,  id:'dormantTime' , height : '10.9em' }}]
		}} ,
		//获取休眠账户数据
		getDormantCustomerData: function(params , scope){
			var self = this == window ? scope : this ;
			$.customAjax(''+config.basePath+config.listDormantCustomer , params , function(flag , data){
				if('success' === flag)
					//渲染分页，table数据使用callback回调函数渲染
					chintPlugins.pageBreakPlugin.init(chintBodyMain.find('#dormantAccountSpan'),data,{pageCount:5}).render(self.renderTableBody , self) ;
			}) ;
		},
		springInfoHandle : function(params , scope){
			$.customAjax(''+config.basePath+config.dataListTrans , params , function(flag , data){
				if('success' === flag)
					//渲染分页，table数据使用callback回调函数渲染
					chintPlugins.pageBreakPlugin.init(chintBodyMain.find('#springInfoSpan'),data,{pageCount:5}).render(scope.renderSpringAccount , scope) ;
			}) ;
		} ,
		//渲染休眠账户表头
		renderTableHead : function(){
			var self = this ;
			var chintMainInnerHtml   =  [
			  '<h2>休眠账户</h2>'  ,
			  '<a id="filterConditionElement" href="#" data-ajax="false" style="float:right;margin-top:-3em;">过滤条件</a>' ,
			  '<table id="dormantAccountTable" data-role="table" data-column-btn-theme="b" data-column-popup-theme="a" data-mode="" class="table-stroke">' ,
			  		'<thead><tr class="th-groups"><th style="width:4.15em;">用户名</th><th style="width:4.15em;">所属区域</th>' ,
			  		'<th style="width:4.15em;">用户类型</th><th style="width:4.15em;">账户余额</th></tr></thead>' ,
			  	 '<tbody></tbody>' ,
			  '</table>' ,
			  '<span id="dormantAccountSpan" style="float:right;"></span>'  ,
			  '<h2 style="margin-top:2em;">流水信息</h2>'  ,
			  '<table id="springInfoTable" data-role="table" data-column-btn-theme="b" data-column-popup-theme="a" data-mode="" class="table-stroke">' ,
			  		'<thead><tr class="th-groups"><th style="width:4.15em;">交易类型</th><th style="width:5.15em;">交易方式</th>' ,
			  		'<th style="width:4.15em;">金额(元)</th><th style="width:4.15em;">交易时间</th></tr></thead>' ,
			  	 '<tbody></tbody>' ,
			  '</table>' ,
			  '<span id="springInfoSpan" style="float:right;"></span>'].join("") ;
			chintBodyMain.append(chintMainInnerHtml).trigger("create") ;
			self.getDormantCustomerData({rows:10000}) ;
		},
		//渲染休眠账户table主体
		renderTableBody : function(data , scope){
			var self = this == window ? scope : this;
			var fragment = document.createDocumentFragment();
			var optionTable = $(chintBodyMain).find('#dormantAccountTable tbody') ;
			optionTable.empty() ;//先清空table中的内容再渲染table
			data.rows.forEach(function(data,index){
				var chargemode = String( data.chargemode ) ;
				chargemode = "1" === chargemode ? "后付费" : ( "0" === chargemode ? "预付费" : "" ) ;
				var syschargeflag = String( data.syschargeflag ) ;
				syschargeflag = "1" === syschargeflag ? "系统计费" : ( "0" === syschargeflag ? "表具计费" : "" ) ;
				var usecard = String( data.usecard ) ;
				usecard = "1" === usecard ? "卡表" : ( "0" === usecard ? "非卡表" : "" ) ;
				var tr = $(["<tr><td  style='border:0;word-break:break-all;'>",data.ownername,"</td><td  style='border:0;'>",data.zonename ,
								"</td><td  style='border:0;'>",data.typename,"</td><td  style='border:0;'>",$.parseVoidValue(data.balance),"</td></tr>",
								"<tr><td  style='font-weight:bold ;border:0;'>户号</td><td colspan='3' style='border:0;'>",data.accountno,"</td></tr>",
								"<tr><td  style='font-weight:bold ;border:0;'>最后交易时间</td><td colspan='3' style='border:0;'>",data.transDate,"</td></tr>",
								"<tr><td  style='font-weight:bold ;border:0;'>用户表具</td><td colspan='3' style='border:0;'>",data.devicenames,"</td></tr>",
								"<tr><td  style='font-weight:bold ;border:0;'>固定电话</td><td style='border:0;'>",data.telno,"</td>",
								"<td  style='font-weight:bold ;border:0;'>手机</td><td style='border:0;'>",data.mobileno,"</td></tr>",
								"<tr><td  style='font-weight:bold ;border:0;'>付费模式</td><td style='border:0;'>",chargemode,"</td>",
								"<td  style='font-weight:bold ;border:0;'>计费模式</td><td style='border:0;'>",syschargeflag,"</td></tr>",
								"<tr><td  style='font-weight:bold ;border:0;'>是否卡表</td><td style='border:0;'>",usecard,"</td>",
								"<td  style='font-weight:bold ;border:0;'>证件类型</td><td style='border:0;'>",data.pidcardtypename,"</td></tr>",
								"<tr><td  style='font-weight:bold;'>证件号码</td><td colspan='3'>",data.pidcardno,"</td></tr>",
								"<tr/>"].join("")) ;
				tr.each(function(index){
					fragment.appendChild(this) ;
					chintPlugins.tablePlugin.trColorSetting(this,index,{total:7,tds:[1,3]}) ;//行点击效果
				}) ;
				tr.attr("userData" , JSON.stringify({accountid : data.accountid , deviceid : data.deviceid })) ;
				tr.on("touchstart" , function(){
					var params = JSON.parse($(this).attr("userData")) ;
					params.rows = 10000 ;
					self.springInfoHandle(params , self) ;
				} ) ;
			}) ;
			optionTable.append(fragment).trigger("create") ;
		},
		//渲染过滤条件panel
		renderFilterPanel : function(){
			var self = this ;
			var radioPlugin = chintPlugins.radioPlugin ;
			var fragment = document.createDocumentFragment();
			fragment.appendChild($("<label>过滤条件</label>")[0]) ;
			radioPlugin.renderCollasibleRadio( self.paramData.filterPanel.collasibleRadios , fragment ) ;//绘制下拉单选组件
			var button = $("<button  class='confirm-button'>确认</button>") ;
			button.on("touchstart" , function(){
				$.queryContext( filterInner , filterPanel , dormantAccountHandle ) ;
			}) ;
			fragment.appendChild(button[0]) ;
			filterInner.append(fragment).trigger("create") ;
			//为过滤条件标签绑定touch事件
			$(chintBodyMain).find('#filterConditionElement').on('touchstart',function(){
				filterPanel.find("input").val("") ;
				filterPanel.panel().panel("open");
			}) ;
		} ,
		//渲染流水数据table
		renderSpringAccount : function(data,scope){
			var fragment = document.createDocumentFragment();
			var optionTable = $(chintBodyMain).find('#springInfoTable tbody') ;
			optionTable.empty() ;//先清空table中的内容再渲染table
			data.rows.forEach(function(data,index){
				var transtype = scope.getTranstype( data.transtype ) ;
				
				var paymode = scope.getPaymode( data.paymode ) ;
				
				var tr = $(["<tr><td  style='border:0;word-break:break-all;'>",transtype,"</td><td  style='border:0;'>",paymode ,
								"</td><td  style='border:0;'>",data.transmoney,"</td><td  style='border:0;'>",data.transdate,"</td></tr>",
								"<tr><td  style='font-weight:bold ;border:0;'>户号</td><td colspan='3' style='border:0;'>",data.accountno,"</td></tr>",
								"<tr><td  style='font-weight:bold ;border:0;'>充值前金额(元)</td><td style='border:0;'>",$.parseVoidValue( data.prebalance ),"</td>",
								"<td  style='font-weight:bold ;border:0;'>当前剩余金额(元)</td><td style='border:0;'>",$.parseVoidValue( data.curbalance ),"</td></tr>",
								"<tr><td  style='font-weight:bold ;border:0;'>充入气量(m³)</td><td style='border:0;'>",$.parseVoidValue( data.gasamount ),"</td>",
								"<td  style='font-weight:bold ;border:0;'>充前气量(m³)</td><td style='border:0;'>",$.parseVoidValue( data.preamount ),"</td></tr>",
								"<tr><td  style='font-weight:bold ;'>当前剩余气量(m³)</td><td>",$.parseVoidValue( data.curamount ),"</td>",
								"<td  style='font-weight:bold;'>表具</td><td>",data.devicenames,"</td></tr>",
								"<tr/>"].join("")) ;
				tr.each(function(index){
					fragment.appendChild(this) ;
					chintPlugins.tablePlugin.trColorSetting(this,index,{total:5,tds:[1,3]}) ;//行点击效果
				}) ;
			}) ;
			optionTable.append(fragment).trigger("create") ;
		} ,
		//封装获取交易类型
		getTranstype : function(transtype){
			switch(transtype){
				case 1 : transtype = "充值" ;
						break ;
				case 2 : transtype = "开户费" ;
						break ;
				case 3 : transtype = "缴费" ;
						break ;
				case 4 : transtype = "消费额" ;
						break ;
				case 5 : transtype = "退款" ;
						break ;
				case 6 : transtype = "补发" ;
						break ;
				case 7 : transtype = "补贴" ;
						break ;
				case 8 : transtype = "补贴消费" ;
						break ;
				default : transtype = "" ;
						break ;
			}
			return 	transtype ;
		} ,
		
		//封装获取交易方式的方法
		getPaymode : function(paymode){
			switch(paymode){
				case 1: paymode = "现金" ;
						break ;
				case 2: paymode = "银行卡" ;
						break ;
				case 3: paymode = "微信" ;
						break ;
				case 4: paymode = "支付宝" ;
						break ;
				case 5: paymode = "转账" ;
						break ;
				default: paymode = "" ;
						break ;
			}
			return paymode ;
		} ,
		init : function(){
			var self = this ;
			$.emptyInnerPanel() ;//清空mainbody的内容
			self.renderTableHead() ;//渲染休眠账户表头
			self.renderFilterPanel() ;//渲染过滤条件panel
		}
	}) ;
　　return {
　　　　init: dormant
　　};
});