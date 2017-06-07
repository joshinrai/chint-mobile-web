define(function (){
　　var operateLog = function (){
		new sysOperateLog() ;
		return "操作记录" ;
　　};
	
	var sysOperateLog = Container.extends({
		//静态数据
		paramData : {
			filterPanel : { 
				inputs : [ {label:'户号',name:'accountNo'} , {label:'用户名',name:'ownerName'} , 
				{label:'表号',name:'deviceCode'} , {label:'表名',name:'deviceName'} , 
				{label:'卡号',name:'cardNo'}, {label:'操作员',name:'userName'} ]
			}
		},
		//获取操作日志数据
		getDataListLogs : function(params , _this){
			var self = this == window ? _this : this ;
			$.customAjax(''+config.basePath+config.getDataListLogs , params , function(flag , data){
				if('success' === flag)
					//渲染分页，table数据使用callback回调函数渲染
					chintPlugins.pageBreakPlugin.init(chintBodyMain.find('#opreateLogSpan'),data,{pageCount:5}).render(self.renderTblOptionTable , self) ;
			}) ;
		},
		//渲染table主体
  		renderTableBody : function(){
  			var self = this ;
			var chintMainInnerHtml   = ['<h2>操作日志</h2>',
					'<a id="filterConditionElement" href="#" data-ajax="false" style="float:right;margin-top:-3em;">过滤条件</a>' ,
					'<table id="opreateLog" data-role="table" data-column-btn-theme="b" data-column-popup-theme="a" data-mode="" class="table-stroke">' ,
					 	'<thead><tr class="th-groups"><th style="width:4.15em;">类型</th><th style="width:4.15em;">信息</th>' ,
						'<th colspan="2" style="width:8.3em;">户号</th></tr></thead>' ,
						'<tbody></tbody>' ,
					'</table>' ,
					'<span id="opreateLogSpan" style="float:right;"></span>'].join("") ;
			chintBodyMain.append(chintMainInnerHtml).trigger("create") ;
			self.getDataListLogs({rows:10000}) ;
			self.clickFilterConditionEle() ;//为过滤条件标签绑定事件
		},
		//渲染操作日志table
		renderTblOptionTable : function(data , _this){
			var self = this == window ? _this : this;
			var fragment = document.createDocumentFragment();
			var optionTable = $(chintBodyMain).find('#opreateLog tbody') ;
			optionTable.empty() ;//先清空table中的内容再渲染table
			data.rows.forEach(function(data,index){
				var operateType = String(data.operateType) ;
				//operateType = self.getOpetateType(operateType) ;
				var tr= $(["<tr><td  style='border:0;'>",operateType,"</td><td style='border:0;'>",data.message,
								"</td><td colspan='2'  style='border:0;'>",data.accountNo,"</td></tr>",
								"<tr><td  style='font-weight:bold ;border:0;'>用户名</td><td style='border:0;'>",data.ownerName,"</td><td  style='font-weight:bold ;border:0;'>",
								"时间</td><td style='border:0;'>",data.createDate,"</td></tr>",
								"<tr><td  style='font-weight:bold ;border:0;'>新户号</td><td style='border:0;'>",$.parseVoidValue(data.accountNo2),"</td><td ",
								" style='font-weight:bold ;border:0;min-width:3.15em'>新户名</td><td style='border:0;'>",$.parseVoidValue(data.ownerName2),"</td></tr>",
								"<tr><td  style='font-weight:bold ;border:0;'>表具</td><td colspan='3' style='border:0;'>",$.parseVoidValue(data.deviceName),"</td></tr>",
								"<tr><td  style='font-weight:bold ;border:0;'>新表具</td><td colspan='3' style='border:0;'>",$.parseVoidValue(data.deviceName2),"</td></tr>",
								"<tr><td  style='font-weight:bold ;'>卡号</td><td>",$.parseVoidValue(data.cardNo),"</td><td style='font-weight:bold ;min-width:3.15em'>操作员</td><td>"
								,$.parseVoidValue(data.userName),"</td></tr>",
								"<tr/>"].join("")) ;
				tr.each(function(index){
					fragment.appendChild(this) ;
					chintPlugins.tablePlugin.trColorSetting(this,index,{total:5,tds:[1,3]}) ;//行点击效果
				}) ;
			}) ;
			optionTable.append(fragment).trigger("create") ;
		},
		//渲染过滤条件panel
		renderFilterPanel : function(){
			var self = this ;
			var inputPlugin = chintPlugins.inputPlugin ;
			var datetimepickerPlugin = chintPlugins.datetimepickerPlugin ;
			var fragment = document.createDocumentFragment();
			fragment.appendChild($("<label>过滤条件</label>")[0]) ;
			var startTime = datetimepickerPlugin.init( { labelName : "生效时间" , name : "transdate_start" } ).render() ;
			var endTime = datetimepickerPlugin.init( { labelName : "截止时间" , name : "transdate_end" } ).render() ;
			fragment.appendChild(startTime) ;
			fragment.appendChild(endTime) ;
			self.paramData.filterPanel.inputs.forEach(function(data , index){
				fragment.appendChild( inputPlugin.init( null , {} , {labelName : data.label , id : data.name , name : data.name } ).render() ) ;
			}) ;
			var button = $("<button class='confirm-button'>确认</button>") ;
			button.on("touchstart" , function(){
				$.queryContext( filterInner , filterPanel , self.getDataListLogs , null , self ) ;
			}) ;
			fragment.appendChild(button[0]) ;
			filterInner.append(fragment).trigger("create") ;
		},
		//点击过滤条件标签显示过滤条件filterPanel并清空filterPanel中组件的内容
		clickFilterConditionEle : function(){
			//显示过滤查询panel
			$(chintBodyMain).find('#filterConditionElement').on('touchstart',function(){
				filterPanel.find("input").val("") ;
				filterPanel.panel().panel("open");
			}) ;
		},
		//获取操作类型
		getOpetateType : function(operateType){
			switch(operateType){
				case "1" : operateType = "开户" ;
					break ;
				case "2" : operateType = "销户" ;
					break ;
				case "3" : operateType = "过户" ;
					break ;
				case "4" : operateType = "停户" ;
					break ;
				case "5" : operateType = "启户" ;
					break ;
				case "6" : operateType = "换表" ;
					break ;
				case "11" : operateType = "发卡" ;
					break ;
				case "12" : operateType = "回收" ;
					break ;
				case "13" : operateType = "挂失" ;
					break ;
				case "14" : operateType = "解挂" ;
					break ;
				case "15" : operateType = "补卡" ;
					break ;
				default : operateType = "" ;
					break ;
			}
			return operateType ;
		},
		init : function(){
			var self = this ;
			$.emptyInnerPanel() ;//清空mainbody的内容
			self.renderTableBody() ;//渲染table主体
			self.renderFilterPanel() ;//渲染过滤条件panel
		}
	}) ;

　　return {
　　　　init: operateLog
　　};
});