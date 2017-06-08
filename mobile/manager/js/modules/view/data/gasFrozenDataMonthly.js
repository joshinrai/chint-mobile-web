define(function (){
　　　　var gasFrozenDataMonthly = function (){
					var inputPlugin = chintPlugins.inputPlugin ;
					var paramData = { filterPanel : {
																inputs : [ {label:'表号',name:'devicecode'} , {label:'用户名',name:'ownername'} , {label:'表名',name:'devicename'} ,
																			  {label:'户号',name:'accountno'}] 
												  }} ;

					//获取月冻结数据
					var frozenMonthlyDataHandle = function(params){
							$.customAjax(''+config.basePath+config.queryFrozenDataMonthly , params , function(flag , data){
									if('success' === flag)
										//渲染分页，table数据使用callback回调函数渲染
										chintPlugins.pageBreakPlugin.init(chintBodyMain.find('#frozenByMonthSpan'),data,{pageCount:5}).render(renderFrozenMonthlyTable) ;
							}) ;
					}
					
					//渲染月冻结数据table
					var renderFrozenMonthlyTable = function(data){
						var fragment = document.createDocumentFragment();
							var optionTable = $(chintBodyMain).find('#frozenByMonthTable tbody') ;
							optionTable.empty() ;//先清空table中的内容再渲染table
							data.rows.forEach(function(data,index){
									var tr = $("<tr><td  style='border:0;word-break:break-all;'>"+data.ownername+"</td><td  style='border:0;word-break:break-all;'>"+data.devicecode +
													"</td><td  style='border:0;'>"+data.frozendate+"</td><td  style='border:0;'>"+$.parseVoidValue(data.pv08)+"</td></tr>"+
													"<tr><td  style='font-weight:bold ;border:0;'>当日用气量</td><td style='border:0;'>"+data.pv10+"</td>"+
													"<td  style='font-weight:bold ;border:0;'>累计用气量</td><td style='border:0;'>"+data.pv07+"</td></tr>"+
													"<tr><td  style='font-weight:bold ;border:0;'>上次购气量</td><td style='border:0;'>"+data.pv09+"</td>"+
													"<td  style='font-weight:bold ;border:0;'>累计购入气量</td><td style='border:0;'>"+data.pv06+"</td></tr>"+
													"<tr><td  style='font-weight:bold ;border:0;'>当日消费金额</td><td style='border:0;'>"+data.pv05+"</td>"+
													"<td  style='font-weight:bold ;border:0;'>累计消费金额</td><td style='border:0;'>"+data.pv02+"</td></tr>"+
													"<tr><td  style='font-weight:bold ;border:0;'>剩余金额</td><td style='border:0;'>"+data.pv03+"</td>"+
													"<td  style='font-weight:bold ;border:0;'>累计充入金额</td><td style='border:0;'>"+data.pv01+"</td></tr>"+
													"<tr><td  style='font-weight:bold ;border:0;'>上次购入金额</td><td style='border:0;'>"+data.pv04+"</td>"+
													"<td  style='font-weight:bold ;border:0;'>阀门状态</td><td style='border:0;'>"+data.valvestate+"</td></tr>"+
													"<tr><td  style='font-weight:bold ;border:0;'>表名</td><td style='border:0;'>"+data.devicename+"</td>"+
													"<td  style='font-weight:bold ;border:0;'>所属区域</td><td style='border:0;'>"+data.zonename+"</td></tr>"+
													"<tr><td  style='font-weight:bold ;'>户号</td><td style='word-break:break-all;'>"+data.accountno+"</td>"+
													"<td  style='font-weight:bold ;'>上传时间</td><td>"+data.createdate+"</td></tr>"+
													"<tr/>") ;
									tr.each(function(index){
										fragment.appendChild(this) ;
										chintPlugins.tablePlugin.trColorSetting(this,index,{total:7,tds:[1,3]}) ;//行点击效果
									}) ;
							}) ;
							optionTable.append(fragment).trigger("create") ;
					}

					//添加过滤查询panel内容
					var renderFilterPanel = function(){
							var fragment = document.createDocumentFragment();
							fragment.appendChild($("<label>过滤条件</label>")[0]) ;
							paramData.filterPanel.inputs.forEach(function(data , index){
										fragment.appendChild( inputPlugin.init( null , {} , {labelName : data.label , id : data.name , name : data.name } ).render() ) ;
							}) ;
							var button = $("<button  class='confirm-button'>确认</button>") ;
							button.on("touchstart" , function(){
										$.queryContext( filterInner , filterPanel , frozenMonthlyDataHandle ) ;
							}) ;
							fragment.appendChild(button[0]) ;
							filterInner.append(fragment).trigger("create") ;
					} ;
					
					//点击过滤条件标签显示过滤条件filterPanel并清空filterPanel中组件的内容
					var clickFilterConditionEle = function(){
							//显示过滤查询panel
							$(chintBodyMain).find('#filterConditionElement').on('touchstart',function(){
									filterPanel.find("input").val("") ;
									filterPanel.panel().panel("open");
							}) ;
					} ;
					
					!(function(){
							$.emptyInnerPanel() ;//清空mainbody的内容
							var chintMainInnerHtml   =  ''  ;
								  chintMainInnerHtml += '<h2>月冻结数据</h2>'  ;
								  chintMainInnerHtml += '<a id="filterConditionElement" href="#" data-ajax="false" style="float:right;margin-top:-3em;">过滤条件</a>' ;
								  chintMainInnerHtml += '<table id="frozenByMonthTable" data-role="table" data-column-btn-theme="b" data-column-popup-theme="a" data-mode="" class="table-stroke">' ;
								  chintMainInnerHtml += 		'<thead><tr class="th-groups"><th style="width:4.15em;">用户姓名</th><th style="width:4.15em;">表号</th>' ;
								  chintMainInnerHtml += 		'<th style="width:4.15em;">冻结时间</th><th style="width:4.15em;">剩余气量</th></tr></thead>' ;
								  chintMainInnerHtml +=		 '<tbody></tbody>' ;
								  chintMainInnerHtml += '</table>' ;
								  chintMainInnerHtml += '<span id="frozenByMonthSpan" style="float:right;"></span>'  ;
							chintBodyMain.append(chintMainInnerHtml).trigger("create") ;
							frozenMonthlyDataHandle({rows:1000}) ;//获取月冻结数据
							renderFilterPanel() ;				//渲染过滤条件panel
					 		clickFilterConditionEle() ;		//过滤条件标签点击事件
					})() ;
		new frozenDataMonthly() ;
		return "月冻结数据" ;
　　};
	var frozenDataMonthly = Container.extends({
		//静态数据
		paramData : { filterPanel : {
			inputs : [ 	{label:'表号',name:'devicecode'} , {label:'用户名',name:'ownername'} , 
						{label:'表名',name:'devicename'} , {label:'户号',name:'accountno'}] 
	  	}} ,
		//获取月冻结数据
		getFrozenMonthlyData : function(params , scope){
			var self = this == window ? scope : this ;
			$.customAjax(''+config.basePath+config.queryFrozenDataMonthly , params , function(flag , data){
				if('success' === flag)
					//渲染分页，table数据使用callback回调函数渲染
					chintPlugins.pageBreakPlugin.init(chintBodyMain.find('#frozenByMonthSpan'),data,{pageCount:5}).render(self.renderTableBody , self) ;
			}) ;
		},
		//渲染月冻结数据表头
		renderTableHead : function(){
			var self = this ;
			var chintMainInnerHtml = [
				  '<h2>月冻结数据</h2>'  ,
				  '<a id="filterConditionElement" href="#" data-ajax="false" style="float:right;margin-top:-3em;">过滤条件</a>' ,
				  '<table id="frozenByMonthTable" data-role="table" data-column-btn-theme="b" data-column-popup-theme="a" data-mode="" class="table-stroke">' ,
				  		'<thead><tr class="th-groups"><th style="width:4.15em;">用户姓名</th><th style="width:4.15em;">表号</th>' ,
				  		'<th style="width:4.15em;">冻结时间</th><th style="width:4.15em;">剩余气量</th></tr></thead>' ,
				  	 '<tbody></tbody>' ,
				  '</table>' ,
				  '<span id="frozenByMonthSpan" style="float:right;"></span>'].join("")  ;
			chintBodyMain.append(chintMainInnerHtml).trigger("create") ;
			self.getFrozenMonthlyData({rows:1000}) ;
		},
		//渲染月冻结数据table内容
		renderTableBody : function(data , scope){
			var fragment = document.createDocumentFragment();
			var optionTable = $(chintBodyMain).find('#frozenByMonthTable tbody') ;
			optionTable.empty() ;//先清空table中的内容再渲染table
			data.rows.forEach(function(data,index){
				var tr = $(["<tr><td  style='border:0;word-break:break-all;'>",data.ownername,"</td><td  style='border:0;word-break:break-all;'>",data.devicecode ,
								"</td><td  style='border:0;'>",data.frozendate,"</td><td  style='border:0;'>",$.parseVoidValue(data.pv08),"</td></tr>",
								"<tr><td  style='font-weight:bold ;border:0;'>当日用气量</td><td style='border:0;'>",data.pv10,"</td>",
								"<td  style='font-weight:bold ;border:0;'>累计用气量</td><td style='border:0;'>",data.pv07,"</td></tr>",
								"<tr><td  style='font-weight:bold ;border:0;'>上次购气量</td><td style='border:0;'>",data.pv09,"</td>",
								"<td  style='font-weight:bold ;border:0;'>累计购入气量</td><td style='border:0;'>",data.pv06,"</td></tr>",
								"<tr><td  style='font-weight:bold ;border:0;'>当日消费金额</td><td style='border:0;'>",data.pv05,"</td>",
								"<td  style='font-weight:bold ;border:0;'>累计消费金额</td><td style='border:0;'>",data.pv02,"</td></tr>",
								"<tr><td  style='font-weight:bold ;border:0;'>剩余金额</td><td style='border:0;'>",data.pv03,"</td>",
								"<td  style='font-weight:bold ;border:0;'>累计充入金额</td><td style='border:0;'>",data.pv01,"</td></tr>",
								"<tr><td  style='font-weight:bold ;border:0;'>上次购入金额</td><td style='border:0;'>",data.pv04,"</td>",
								"<td  style='font-weight:bold ;border:0;'>阀门状态</td><td style='border:0;'>",data.valvestate,"</td></tr>",
								"<tr><td  style='font-weight:bold ;border:0;'>表名</td><td style='border:0;'>",data.devicename,"</td>",
								"<td  style='font-weight:bold ;border:0;'>所属区域</td><td style='border:0;'>",data.zonename,"</td></tr>",
								"<tr><td  style='font-weight:bold ;'>户号</td><td style='word-break:break-all;'>",data.accountno,"</td>",
								"<td  style='font-weight:bold ;'>上传时间</td><td>",data.createdate,"</td></tr>",
								"<tr/>"].join("")) ;
				tr.each(function(index){
					fragment.appendChild(this) ;
					chintPlugins.tablePlugin.trColorSetting(this,index,{total:7,tds:[1,3]}) ;//行点击效果
				}) ;
			}) ;
			optionTable.append(fragment).trigger("create") ;
		},
		//渲染过滤条件panel
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
				$.queryContext( filterInner , filterPanel , self.getFrozenMonthlyData , null , self ) ;
			}) ;
			fragment.appendChild(button[0]) ;
			filterInner.append(fragment).trigger("create") ;
			//为过滤条件panel绑定touch事件
			$(chintBodyMain).find('#filterConditionElement').on('touchstart',function(){
				filterPanel.find("input").val("") ;
				filterPanel.panel().panel("open");
			}) ;
		} ,
		init : function(){
			var self = this ;
			$.emptyInnerPanel() ;//清空mainbody的内容
			self.renderTableHead() ;//渲染月冻结数据表头
			self.renderFilterPanel() ;//渲染过滤条件panel
		}
	}) ;
　　return {
　　　　init: gasFrozenDataMonthly
　　};
});