define(function (){
　　　　var showScadaLastData = function (){
			new realTimeData() ;
　　　　};

		var realTimeData = Container.extends({
			//静态数据
			paramData : { filterPanel : {
				inputs : [ 	{label:'户号',name:'accountno'} , {label:'用户名',name:'accountname'} , 
							{label:'表号',name:'devicecode'} , {label:'集中器编号',name:'concentratorcode'} , 
							{label:'集中器名称',name:'concentratorname'} ] 
			}},
			//获取表具实时数据
			getRealTimeData : function(params , scope){
				var self = this == window ? scope : this ;
				$.customAjax(''+config.basePath+config.searchScadaLastData , params , function(flag , data){
					if('success' === flag){
						//渲染分页，table数据使用callback回调函数渲染
						chintPlugins.pageBreakPlugin.init(chintBodyMain.find('#realTimeTableSpan'),data,{pageCount:5}).render(self.renderTableBody , self) ;
					}
				}) ;
			},
			//获取连接器状态
			getConnectStateData : function(params , scope){
				var self = this == window ? scope : this ;
				$.customAjax(''+config.basePath+config.getConcentratorState , params , function(flag , data){
					if('success' === flag){
						//渲染分页，table数据使用callback回调函数渲染
						chintPlugins.pageBreakPlugin.init(chintBodyMain.find('#connectStateTableSpan'),data,{pageCount:5}).render(self.renderConnectStateTable , self) ;
					}
				}) ;
			},
			//渲染表头
			renderTableHead : function(){
				var self = this ;
				var chintMainInnerHtml   =  [
					  '<h2>表具实时数据</h2>'  ,
					  '<a id="filterConditionElement" href="#" data-ajax="false" style="float:right;margin-top:-3em;">过滤条件</a>' ,
					  '<table id="realTimeTable" data-role="table" data-column-btn-theme="b" data-column-popup-theme="a" data-mode="" class="table-stroke">' ,
					  		'<thead><tr class="th-groups"><th style="width:4.15em;">用户名</th><th style="width:4.15em;">联机状态</th>' ,
					  		'<th style="width:6.15em;">累计冲入金额</th><th style="width:4.15em;">阀门状态</th></tr></thead>' ,
					  	 '<tbody></tbody>' ,
					  '</table>' ,
					  '<span id="realTimeTableSpan" style="float:right;"></span>'  ,
					  '<h2 style="margin-top:2em;">集中器连接状态</h2>'  ,
					  '<table id="connectStateTable" data-role="table" data-column-btn-theme="b" data-column-popup-theme="a" data-mode="" class="table-stroke">' ,
					  		'<thead><tr class="th-groups"><th style="width:5.15em;">集中器编号</th><th style="width:5.15em;">集中器名称</th>' ,
					  		'<th style="width:4.15em;">通讯标识</th><th style="width:4.15em;">所属区域</th></tr></thead>' ,
					  	 '<tbody></tbody>' ,
					  '</table>' ,
					  '<span id="connectStateTableSpan" style="float:right;"></span>'].join("")  ;
		 		chintBodyMain.append(chintMainInnerHtml).trigger("create") ;
		 		self.getRealTimeData( {rows : 10000} ) ;		//渲染表具实时数据table
			},
			//渲染表体
			renderTableBody : function(data , scope){
				var self = this == window ? scope : this;
				var fragment = document.createDocumentFragment();
				var optionTable = $(chintBodyMain).find('#realTimeTable tbody') ;
				optionTable.empty() ;//先清空table中的内容再渲染table
				data.rows.forEach(function(data,index){
					var state = String(data.state) ;
					state = "1" === state ? "已连接" : "未连接" ;
					var valvestate = String(data.valvestate) ;
					valvestate = "null" === valvestate ? "N/A" : ( 1 === valvestate ? "开" : "关" ) ;
					var tr = $("<tr><td  style='border:0;word-break:break-all;'>"+data.accountname+"</td><td  style='border:0;'>"+state +
								"</td><td  style='border:0;'>"+valvestate+"</td><td  style='border:0;'>"+$.parseVoidValue(data.pv01,"N/A")+"</td></tr>"+
								"<tr><td  style='font-weight:bold ;border:0;'>表号</td><td colspan='3' style='border:0;'>"+data.devicecode+"</td></tr>"+
								"<tr><td colspan='2'  style='font-weight:bold ;border:0;'>累计消费金额</td><td colspan='2' style='border:0;'>"+$.parseVoidValue(data.pv02,"N/A")+"</td></tr>"+
								"<tr><td  style='font-weight:bold ;border:0;'>剩余金额</td><td style='border:0;'>"+$.parseVoidValue(data.pv03,"N/A")+
								"</td><td  style='font-weight:bold ;border:0;'>上次购入金额</td><td style='border:0;'>"+$.parseVoidValue(data.pv04,"N/A")+"</td></tr>"+
								"<tr><td  style='font-weight:bold ;border:0;'>累计用气量</td><td style='border:0;'>"+$.parseVoidValue(data.pv07,"N/A")+
								"</td><td  style='font-weight:bold ;border:0;'>累计购入气量</td><td style='border:0;'>"+$.parseVoidValue(data.pv06,"N/A")+"</td></tr>"+
								"<tr><td  style='font-weight:bold ;border:0;'>剩余气量</td><td style='border:0;'>"+$.parseVoidValue(data.pv08,"N/A")+
								"</td><td  style='font-weight:bold ;border:0;'>上次购入气量</td><td style='border:0;'>"+$.parseVoidValue(data.pv09,"N/A")+"</td></tr>"+
								"<tr><td  style='font-weight:bold ;border:0;'>更新时间</td><td colspan='3' style='border:0;'>"+$.parseVoidValue(data.updatedate)+"</td></tr>"+
								"<tr><td  style='font-weight:bold ;border:0;'>户号</td><td colspan='3' style='border:0;'>"+data.accountno+"</td></tr>"+
								"<tr><td  style='font-weight:bold ;border:0;'>区域</td><td colspan='3' style='border:0;'>"+data.zonename+"</td></tr>"+
								"<tr><td  style='font-weight:bold ;border:0;'>地址</td><td colspan='3' style='border:0;'>"+data.address+"</td></tr>"+
								"<tr><td  style='font-weight:bold ;border:0;'>集中器编号</td><td colspan='3' style='border:0;'>"+$.parseVoidValue(data.concentratorcode)+"</td></tr>"+
								"<tr><td  style='font-weight:bold ;'>集中器名称</td><td colspan='3'>"+$.parseVoidValue(data.concentratorname)+"</td></tr>"+
								"<tr/>") ;
					tr.each(function(index){
						fragment.appendChild(this) ;
						chintPlugins.tablePlugin.trColorSetting(this,index,{total:12,tds:[1,3]}) ;//行点击效果
					}) ;
				}) ;
				optionTable.append(fragment).trigger("create") ;
			},
			//渲染集中器连接状态
			renderConnectStateTable : function(data , scope){
				var fragment = document.createDocumentFragment();
				var optionTable = $(chintBodyMain).find('#connectStateTable tbody') ;
				optionTable.empty() ;//先清空table中的内容再渲染table
				data.rows.forEach(function(data,index){
					var state = data.state ;
					state = "1" === String(data.state) ? "在线" : "离线" ; 
					var tr = $("<tr><td  style='border:0;word-break:break-all;'>"+data.concentratorcode+"</td><td  style='border:0;'>"+data.concentratorname +
									"</td><td  style='border:0;'>"+data.mid+"</td><td  style='border:0;'>"+data.zonename+"</td></tr>"+
									"<tr><td  style='font-weight:bold ;border:0;'>网络类型</td><td style='border:0;'>"+data.netname+"</td>"+
											"<td  style='font-weight:bold ;border:0;'>状态</td><td style='border:0;'>"+state+"</td></tr>"+
									"<tr><td  style='font-weight:bold ;border:0;'>气表关联数</td><td style='border:0;'>"+data.metercount+"</td>"+
											"<td  style='font-weight:bold ;border:0;'>中继器关联数</td><td style='border:0;'>"+data.repeatercount+"</td></tr>"+
											"<tr><td  style='font-weight:bold;'>安装时间</td><td colspan='3'>"+data.installdate+"</td></tr>"+
									"<tr/>") ;
					tr.each(function(index){
						fragment.appendChild(this) ;
						chintPlugins.tablePlugin.trColorSetting(this,index,{total:4,tds:[1,3]}) ;//行点击效果
					}) ;
				}) ;
				optionTable.append(fragment).trigger("create") ;
			},
			//渲染价格过滤条件panel
			renderFilterPanel : function(){
				var self = this ;
				var inputPlugin = chintPlugins.inputPlugin ;
				var fragment = document.createDocumentFragment();
				fragment.appendChild($("<label>过滤条件</label>")[0]) ;
				self.paramData.filterPanel.inputs.forEach(function(data , index){
					fragment.appendChild( inputPlugin.init( null , {} , {labelName : data.label , id : data.name , name : data.name } ).render() ) ;
				}) ;
				var button = $("<button  class='confirm-button'>确认</button>") ;
				button.on("touchstart" , function(){
					$.queryContext( filterInner , filterPanel , self.getRealTimeData , null , self ) ;
				}) ;
				fragment.appendChild(button[0]) ;
				filterInner.append(fragment).trigger("create") ;
				//绑定touch事件
				$(chintBodyMain).find('#filterConditionElement').on('touchstart',function(){
					filterPanel.find("input").val("") ;
					filterPanel.panel().panel("open");
				}) ;
			},
			init : function(){
				var self = this ;
				$.emptyInnerPanel() ;//清空mainbody的内容
				self.renderTableHead() ;//初始化表头
				self.renderFilterPanel() ;//渲染过滤条件panel
				self.getConnectStateData({rows:10000}) ;//获取集中器连接状态
			}
		}) ;

　　　　return {
　　　　　　init: showScadaLastData
　　　　};
});