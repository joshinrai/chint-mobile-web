define(function (){
　　　　var showArrears = function (){
					var inputPlugin = chintPlugins.inputPlugin ;
					
					var key = null ;
					
					var paramData = {
							filterPanel : { 
															inputs : [ {label:'户号',name:'accountno'} , {label:'用户名',name:'ownername'} , {label:'表号',name:'devicecode'} ,
															 {label:'证件号',name:'pidcardno'} , {label:'手机',name:'mobileno'} ]
												}
					} ;
					
					//获取table数据
					var tableDataHandle = function(params){
							$.customAjax(''+config.basePath+config.getDataListArrears , params , function(flag , data){
									if('success' === flag){
										key = data.key ;
										data.total = "0" === String( data.total ) ? data.rows.length : data.total ;
										//渲染分页，table数据使用callback回调函数渲染
										chintPlugins.pageBreakPlugin.init(chintBodyMain.find('#arrearageSpan'),data,{pageCount:5}).render(renderTblOptionTable) ;
									}
							}) ;
					}
					
					//渲染菜单管理table
					var renderTblOptionTable = function(data){
							var fragment = document.createDocumentFragment();
							var optionTable = $(chintBodyMain).find('#arrearageDispose tbody') ;
							optionTable.empty() ;//先清空table中的内容再渲染table
							data.rows.forEach(function(data,index){
									var balance = "" ;
									"1" === String(data.syschargeflag) ? ( balance = null == data.balancegas ? "" : data.balancegas+"m³") : ( balance = null == data.balance ? "" : data.balance+"元") ;
									var tr= $("<tr><td  style='border:0;'>"+data.ownername+"</td><td  style='border:0;'>"+ data.typename +
													"</td><td  style='border:0;'>"+balance+"</td><td  style='border:0;'>"+
													((data.arrearageFlag < 0 ) ? "是" : "否")+"</td></tr>"+
													"<tr><td  style='font-weight:bold ;border:0;'>户号</td><td colspan='3' style='border:0;'>"+data.accountno+"</td></tr>"+
													"<tr><td  style='font-weight:bold ;border:0;'>用户表具</td><td colspan='3' style='border:0;'>"+data.devicenames+"</td></tr>"+
													"<tr><td  style='font-weight:bold ;border:0;'>手机</td><td style='border:0;'>"+data.mobileno+
														"</td><td  style='font-weight:bold ;border:0;'>付费模式</td><td style='border:0;'>"+data.chargemode+"</td></tr>"+
													"<tr><td  style='font-weight:bold ;border:0;'>计费模式</td><td style='border:0;'>"+data.syschargeflag+
														"</td><td  style='font-weight:bold ;border:0;'>所属地区</td><td style='border:0;'>"+data.zonename+"</td></tr>"+
													"<tr><td  style='font-weight:bold ;'>地址</td><td colspan='3'>"+data.address+"</td></tr>"+
													"<tr/>") ;
									tr.each(function(index){
										fragment.appendChild(this) ;
										chintPlugins.tablePlugin.trColorSetting(this,index,{total:5,tds:[1,3]}) ;//行点击效果
									}) ;
									tr.attr("userData" , JSON.stringify({ accountid : data.accountid , deviceid : data.deviceid}) ) ;
									tr.on("touchstart" , showMsgDetail  ) ;
							}) ;
							optionTable.append(fragment).trigger("create") ;
					}
					
					//添加点击欠费处理的某条数据获取短信详情信息
					var showMsgDetail = function(){
							var arrearsData = JSON.parse($(this).attr("userData")) ;
							$.customAjax(''+config.basePath+config.getMsgDetail , arrearsData , function(flag , data){
									if('success' === flag)
											chintPlugins.pageBreakPlugin.init(chintBodyMain.find('#msgDetailSpan'),data,{pageCount:5}).render(renderMsgDetailTable) ;
							}) ;
					}
					
					var renderMsgDetailTable = function(data){
							var fragment = document.createDocumentFragment();
							var optionTable = $(chintBodyMain).find('#shortMsgDetails tbody') ;
							optionTable.empty() ;//先清空table中的内容再渲染table
							data.rows.forEach(function(data,index){
									var sendflag = String(data.sendflag) , type = String(data.type);
									sendflag = "1" === sendflag  ? "是" : ( "0" === sendflag ? "否" : "") ;
									type = "1" === type ? "欠费通知" : ( "2" === type ? "故障报警" : ( "3" === type ? "发布信息" : "") ) ; 
									var tr= $("<tr><td  style='border:0;'>"+data.mobileno+"</td><td  style='border:0;'>"+data.username +
													"</td><td  style='border:0;'>"+sendflag+"</td><td  style='border:0;'>"+type+"</td></tr>"+
													"<tr><td  style='font-weight:bold ;border:0;'>户号</td><td colspan='3' style='border:0;'>"+data.accountno+"</td></tr>"+
													"<tr><td  style='font-weight:bold ;border:0;'>短信内容</td><td colspan='3' style='border:0;'>"+data.message+"</td></tr>"+
													"<tr><td  style='font-weight:bold ;'>生成时间</td><td colspan='3'>"+data.createdate+"</td></tr><tr/>") ;
									tr.each(function(index){
										fragment.appendChild(this) ;
										chintPlugins.tablePlugin.trColorSetting(this,index,{total:4,tds:[1,3]}) ;//行点击效果
									}) ;
							}) ;
							optionTable.append(fragment).trigger("create") ;
					}
					
					//渲染过滤条件panel
					var renderFilterPanel = function(){
							var fragment = document.createDocumentFragment();
							fragment.appendChild($("<label>过滤条件</label>")[0]) ;
							paramData.filterPanel.inputs.forEach(function(data , index){
										fragment.appendChild( inputPlugin.init( null , {} , {labelName : data.label , id : data.name , name : data.name } ).render() ) ;
							}) ;
							var button = $("<button class='confirm-button'>确认</button>") ;
							button.on("touchstart" , function(){
									$.queryContext( filterInner , filterPanel , tableDataHandle , {key : key , arrearageFlag : "1" }) ;
							}) ;
							fragment.appendChild(button[0]) ;
							filterInner.append(fragment).trigger("create") ;
					}
					
					//点击过滤条件标签显示过滤条件filterPanel并清空filterPanel中组件的内容
					var clickFilterConditionEle = function(){
							//显示过滤查询panel
							$(chintBodyMain).find('#filterConditionElement').on('click',function(){
									filterPanel.find("input").val("") ;
									filterPanel.panel().panel("open");
							}) ;
					}
					
					/*!(function(){
							$.emptyInnerPanel() ;//清空mainbody的内容
							var chintMainInnerHtml   =  ''  ;
								  chintMainInnerHtml += '<h2>欠费处理</h2>'  ;
								  chintMainInnerHtml += '<a id="filterConditionElement" href="#" data-ajax="false" style="float:right;margin-top:-3em;">过滤条件</a>' ;
								  chintMainInnerHtml += '<table id="arrearageDispose" data-role="table" data-column-btn-theme="b" data-column-popup-theme="a" data-mode="" class="table-stroke">' ;
								  chintMainInnerHtml += 		'<thead><tr class="th-groups"><th style="width:4.15em;">用户名</th><th style="width:4.15em;">用户类型</th>' ;
								  chintMainInnerHtml += 		'<th style="width:4.15em;">账户余额</th><th style="width:4.15em;">是否欠费</th></tr></thead>' ;
								  chintMainInnerHtml +=		 '<tbody></tbody>' ;
								  chintMainInnerHtml += '</table>' ;
								  chintMainInnerHtml += '<span id="arrearageSpan" style="float:right;"></span>'  ;
								  chintMainInnerHtml += '<h2 style="margin-top:2em;">短信详情</h2>'  ;
								  chintMainInnerHtml += '<table id="shortMsgDetails" data-role="table" data-column-btn-theme="b" data-column-popup-theme="a" data-mode="" class="table-stroke">' ;
								  chintMainInnerHtml += 		'<thead><tr class="th-groups"><th style="width:4.15em;">手机</th><th style="width:4.15em;">发送人</th>' ;
								  chintMainInnerHtml += 		'<th style="width:4.15em;">是否发送</th><th style="width:4.15em;">短信类型</th></tr></thead>' ;
								  chintMainInnerHtml +=		 '<tbody></tbody>' ;
								  chintMainInnerHtml += '</table>' ;
								  chintMainInnerHtml += '<span id="msgDetailSpan" style="float:right;"></span>'  ;
							chintBodyMain.append(chintMainInnerHtml).trigger("create") ;
							tableDataHandle( {arrearageFlag:'1',rows:10000} ) ;		//渲染table
							renderFilterPanel() ;		//渲染过滤条件panel
							clickFilterConditionEle() ;		//过滤条件标签点击事件
					})() ;*/
			new gasShowArrears() ;
			return "欠费处理" ;
　　　　};
	var gasShowArrears = Container.extends({
		//获取欠费处理数据
		getArrearsData : function(params , _this){
			var self = this == window ? _this : this ;
			$.customAjax(''+config.basePath+config.getDataListArrears , params , function(flag , data){
				if('success' === flag){
					key = data.key ;
					data.total = "0" === String( data.total ) ? data.rows.length : data.total ;
					//渲染分页，table数据使用callback回调函数渲染
					chintPlugins.pageBreakPlugin.init(chintBodyMain.find('#arrearageSpan'),data,{pageCount:5}).render(self.renderTableBody , self) ;
				}
			}) ;
		},
		//渲染欠费处理表头
		renderTableHeader : function(){
			var self = this ;
			var chintMainInnerHtml   =  [
				  '<h2>欠费处理</h2>'  ,
				  '<a id="filterConditionElement" href="#" data-ajax="false" style="float:right;margin-top:-3em;">过滤条件</a>' ,
				  '<table id="arrearageDispose" data-role="table" data-column-btn-theme="b" data-column-popup-theme="a" data-mode="" class=",able-stroke">' ,
				  		'<thead><tr class="th-groups"><th style="width:4.15em;">用户名</th><th style="width:4.15em;">用户类型</th>' ,
				  		'<th style="width:4.15em;">账户余额</th><th style="width:4.15em;">是否欠费</th></tr></thead>' ,
				  	 '<tbody></tbody>' ,
				  '</table>' ,
				  '<span id="arrearageSpan" style="float:right;"></span>'  ,
				  '<h2 style="margin-top:2em;">短信详情</h2>'  ,
				  '<table id="shortMsgDetails" data-role="table" data-column-btn-theme="b" data-column-popup-theme="a" data-mode="" class="table-stroke">' ,
				  		'<thead><tr class="th-groups"><th style="width:4.15em;">手机</th><th style="width:4.15em;">发送人</th>' ,
				  		'<th style="width:4.15em;">是否发送</th><th style="width:4.15em;">短信类型</th></tr></thead>' ,
				  	 '<tbody></tbody>' ,
				  '</table>' ,
				  '<span id="msgDetailSpan" style="float:right;"></span>'].join("")  ;
			chintBodyMain.append(chintMainInnerHtml).trigger("create") ;
			self.getArrearsData({rows:10000}) ;
		},
		//渲染欠费处理表体
		renderTableBody : function(data , _this){
			var fragment = document.createDocumentFragment();
			var optionTable = $(chintBodyMain).find('#arrearageDispose tbody') ;
			optionTable.empty() ;//先清空table中的内容再渲染table
			data.rows.forEach(function(data,index){
				var balance = "" ;
				"1" === String(data.syschargeflag) ? ( balance = null == data.balancegas ? "" : data.balancegas+"m³") : ( balance = null == data.balance ? "" : data.balance+"元") ;
				var tr= $(["<tr><td  style='border:0;'>",data.ownername,"</td><td  style='border:0;'>", data.typename +
						"</td><td  style='border:0;'>",balance,"</td><td  style='border:0;'>",
						((data.arrearageFlag < 0 ) ? "是" : "否"),"</td></tr>",
						"<tr><td  style='font-weight:bold ;border:0;'>户号</td><td colspan='3' style='border:0;'>",data.accountno+"</td></tr>",
						"<tr><td  style='font-weight:bold ;border:0;'>用户表具</td><td colspan='3' style='border:0;'>",data.devicenames,"</td></tr>",
						"<tr><td  style='font-weight:bold ;border:0;'>手机</td><td style='border:0;'>",data.mobileno,
							"</td><td  style='font-weight:bold ;border:0;'>付费模式</td><td style='border:0;'>",data.chargemode,"</td></tr>",
						"<tr><td  style='font-weight:bold ;border:0;'>计费模式</td><td style='border:0;'>",data.syschargeflag,
							"</td><td  style='font-weight:bold ;border:0;'>所属地区</td><td style='border:0;'>",data.zonename,"</td></tr>",
						"<tr><td  style='font-weight:bold ;'>地址</td><td colspan='3'>",data.address,"</td></tr>",
						"<tr/>"].join("")) ;
				tr.each(function(index){
					fragment.appendChild(this) ;
					chintPlugins.tablePlugin.trColorSetting(this,index,{total:5,tds:[1,3]}) ;//行点击效果
				}) ;
				tr.attr("userData" , JSON.stringify({ accountid : data.accountid , deviceid : data.deviceid}) ) ;
				tr.on("touchstart" , null ) ;//showMsgDetail  ) ;
			}) ;
			optionTable.append(fragment).trigger("create") ;
		} ,
		//渲染过滤条件panel
		renderFilterPanel : function(){
			var fragment = document.createDocumentFragment();
			fragment.appendChild($("<label>过滤条件</label>")[0]) ;
			paramData.filterPanel.inputs.forEach(function(data , index){
				fragment.appendChild( inputPlugin.init( null , {} , {labelName : data.label , id : data.name , name : data.name } ).render() ) ;
			}) ;
			var button = $("<button class='confirm-button'>确认</button>") ;
			button.on("touchstart" , function(){
				$.queryContext( filterInner , filterPanel , tableDataHandle , {key : key , arrearageFlag : "1" }) ;
			}) ;
			fragment.appendChild(button[0]) ;
			filterInner.append(fragment).trigger("create") ;
		},
		init : function(){
			var self = this ;
			$.emptyInnerPanel() ;//清空mainbody的内容
			self.renderTableHeader() ;//渲染欠费处理表头
		}
	}) ;
　　return {
　　　　init: showArrears
　　};
});