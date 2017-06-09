define(function (){
　　var list = function (){
		new sysTblLog() ;
　　};
	var sysTblLog = Container.extends({
		paramData : { filterPanel : {
			inputs : [  {label:'用户名',name:'username'} , {label:'访问IP',name:'hostip'} , 
						{label:'日志信息',name:'logmsg'}] 
		}} ,
		//获取日志数据
		getLogData : function(params , scope){
			var self = this == window ? scope : this;
			$.customAjax(''+config.basePath+config.sysTbllogDataList , params , function(flag , data){
				if('success' === flag)
					//渲染分页，table数据使用callback回调函数渲染
					chintPlugins.pageBreakPlugin.init(chintBodyMain.find('span'),data,{pageCount:5}).render(self.renderTableBody , self) ;
			}) ;
		},
		//渲染日志信息表头
		renderTableHead : function(){
			var self = this ;
			var chintMainInnerHtml   =  [
			   '<h2>日志管理</h2>'  ,
			   '<div">'  ,
			   		'<a id="filterConditionElement" href="#" data-ajax="false" class="filterConditionElement">过滤查询</a>' ,
			   '</div>'  ,
		 	   '<table data-role="table" data-column-btn-theme="b" data-column-popup-theme="a" data-mode="" class="table-stroke">' ,
			   		'<thead><tr class="th-groups"><th style="width:5.15em">用户名</th><th style="width:5.15em">访问主机IP</th>' ,
			   		'<th style="width:4.15em">菜单名称</th> ' ,
			   		'</tr></thead>' ,
			   		 '<tbody></tbody>' ,
			   '</table>' ,
			   '<span style="float:right;"></span>'].join("") ;
		   	chintBodyMain.append(chintMainInnerHtml).trigger("create") ;
		   	self.getLogData({rows:10000}) ;
		},
		//渲染日志信息内容
		renderTableBody : function(data , scope){
			var self = this == window ? scope : this;
			var fragment = document.createDocumentFragment();
			var optionTable = $(chintBodyMain).find('table tbody') ;
			optionTable.empty() ;//先清空table中的内容再渲染table
			data.rows.forEach(function(data,index){
				var tr = $(["<tr><td style='border:0 ;'>",data.username,"</td><td style='border:0 ;'>",data.hostip,
					"</td><td style='border:0 ;'>",data.menuname,"</td></tr>",
					"<tr><td  style='font-weight:bold;border:0;'>访问主机名</td><td colspan='3' style='border:0;'>",data.hostname,"</td></tr>",
					"<tr><td  style='font-weight:bold;border:0;'>日志时间</td><td colspan='3' style='border:0;'>",data.logdate,"</td></tr>",
					"<tr><td  style='font-weight:bold;'>日志信息</td><td colspan='3' style='word-break:break-all;'>",data.logmsg,"</td></tr><tr/>"].join("")) ;
		
				tr.each(function(index){
					fragment.appendChild(this) ;
					chintPlugins.tablePlugin.trColorSetting(this,index,{total : 3 , tds:[1 , 3]}) ;//行点击效果
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
			var startTime = datetimepickerPlugin.init( { labelName : "起始时间" , name : "starttime" } ).render() ;
			var endTime = datetimepickerPlugin.init( { labelName : "结束时间" , name : "endtime" } ).render() ;
			fragment.appendChild(startTime) ;
			fragment.appendChild(endTime) ;
			self.paramData.filterPanel.inputs.forEach(function(data , index){
				fragment.appendChild( inputPlugin.init( null , {} , {labelName : data.label , id : data.name , name : data.name } ).render() ) ;
			}) ;
			var button = $("<button  class='confirm-button'>确认</button>") ;
			button.on("touchstart" , function(){
				//$.queryContext( filterInner , filterPanel , self.getLogData , null , self ) ;
				self.filterPanelQuery(self) ;
			}) ;
			fragment.appendChild(button[0]) ;
			filterInner.append(fragment).trigger("create") ;
			//为过滤条件绑定touch事件
			$(chintBodyMain).find('#filterConditionElement').on('touchstart',function(){
				filterPanel.find("input").val("") ;
				filterPanel.panel().panel("open");
			}) ;
		},
		//查询符合的内容
		filterPanelQuery : function(scope){
			var params = {} ;
			params.rows = 10000 ;
			var radioPlugin = chintPlugins.radioPlugin ;
			var chintInput = filterInner.find( 'input' ) ;
			chintInput.each(function(index , data){
				params[data.name] = data.value ;
			}) ;
			params.starttime = scope.fmtDateFrStr(params.starttime) ;
			params.endtime = scope.fmtDateFrStr(params.endtime) ;
			scope.getLogData(params) ;
			filterPanel.panel().panel("close") ;
		} ,
		//将字符串格式的日期转化为date类型的日期
		fmtDateFrStr : function(str){
			if(!str) return "" ;
			return str +" 00:00:00" ;
		},
		init : function(){
			var self = this ;
			$.emptyInnerPanel() ;//清空mainbody的内容
			self.renderTableHead() ;//渲染日志表头
			self.renderFilterPanel() ;//渲染过滤条件panel
		}
	}) ;
　　return {
　　　　init: list
　　};
});