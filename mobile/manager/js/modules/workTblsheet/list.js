define(function (){
　　var list = function (){
		new worksheet() ;
　　};
	var worksheet = Container.extends({
		paramData : { filterPanel : {
			inputs : [ 	{label:'工单号',name:'sheetno'} , {label:'填单人员',name:'username'} , 
						{label:'出工人员',name:'workersname'}  ] 
		}} ,
		//获取工单数据
		getWorksheetData : function(params , scope){
			var self = this == window ? scope : this ;
			$.customAjax(''+config.basePath+config.workTblsheetData , params , function(flag , data){
				if('success' === flag)
					//渲染分页，table数据使用callback回调函数渲染
					chintPlugins.pageBreakPlugin.init(chintBodyMain.find('#workSheetSpan'),data,{pageCount:5}).render(self.renderTableBody , self) ;
			}) ;
		},
		//渲染工单管理表头
		renderTableHead : function(){
			var self = this ;
			var chintMainInnerHtml   = [
				  '<h2>工单管理</h2>'  ,
				  '<a id="filterConditionElement" href="#" data-ajax="false" style="float:right;margin-top:-3em;">过滤条件</a>' ,
				  '<table id="workSheetTable" data-role="table" data-column-btn-theme="b" data-column-popup-theme="a" data-mode="" class="table-stroke">' ,
				  		'<thead><tr class="th-groups"><th style="width:4.15em;">工单号</th><th style="width:4.15em;">起始日期</th>' ,
				  		'<th style="width:4.15em;">截止日期</th><th style="width:4.15em;">任务类别</th></tr></thead>' ,
				  	 '<tbody></tbody>' ,
				  '</table>' ,
				  '<span id="workSheetSpan" style="float:right;"></span>'].join("")  ;
			chintBodyMain.append(chintMainInnerHtml).trigger("create") ;
			self.getWorksheetData({rows:10000}) ;
		},
		//渲染工单管理内容
		renderTableBody : function(data , scope){
			var self = this == window ? scope : this;
			var fragment = document.createDocumentFragment();
			var optionTable = $(chintBodyMain).find('#workSheetTable tbody') ;
			optionTable.empty() ;//先清空table中的内容再渲染table
			data.rows.forEach(function(data,index){
				var tr = $(["<tr><td  style='border:0;word-break:break-all;'>",data.sheetno,"</td><td  style='border:0;word-break:break-all;'>",data.workdate ,
								"</td><td  style='border:0;'>",data.expiredate,"</td><td  style='border:0;'>",$.parseVoidValue(data.tasktype),"</td></tr>",
								"<tr><td  style='font-weight:bold ;border:0;'>允许操作</td><td colspan='3' style='border:0;'>",$.parseVoidValue(data.allowcommandnames),"</td></tr>",
								"<tr><td  style='font-weight:bold ;border:0;'>气表</td><td colspan='3' style='border:0;'>",$.parseVoidValue(data.devicedata),"</td></tr>",
								"<tr><td  style='font-weight:bold ;border:0;'>出工人员</td><td style='border:0;'>",$.parseVoidValue(data.workersname),"</td>",
								"<td  style='font-weight:bold ;border:0;'>处理状态</td><td style='border:0;'>",$.parseVoidValue(data.state),"</td></tr>",
								"<tr><td  style='font-weight:bold ;border:0;'>填报日期</td><td style='border:0;'>",$.parseVoidValue(data.recorddate),"</td>",
								"<td  style='font-weight:bold ;border:0;'>填报人</td><td style='border:0;'>",$.parseVoidValue(data.recordusername),"</td></tr>",
								"<tr><td  style='font-weight:bold ;'>工作描述</td><td colspan='3'>",$.parseVoidValue(data.description),"</td></tr>",
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
			var fragment = document.createDocumentFragment();
			fragment.appendChild($("<label>过滤条件</label>")[0]) ;
			self.paramData.filterPanel.inputs.forEach(function(data , index){
				fragment.appendChild( inputPlugin.init( null , {} , {labelName : data.label , id : data.name , name : data.name } ).render() ) ;
			}) ;
			var button = $("<button  class='confirm-button'>确认</button>") ;
			button.on("touchstart" , function(){
				$.queryContext( filterInner , filterPanel , self.getWorksheetData , null , self ) ;
			}) ;
			fragment.appendChild(button[0]) ;
			filterInner.append(fragment).trigger("create") ;
			//为过滤条件标签绑定touch事件
			$(chintBodyMain).find('#filterConditionElement').on('touchstart',function(){
				filterPanel.find("input").val("") ;
				filterPanel.panel().panel("open");
			}) ;
		} ,
		init : function(){
			var self = this ;
			$.emptyInnerPanel() ;//清空mainbody的内容
			self.renderTableHead() ;//渲染工单管理表头
			self.renderFilterPanel() ;//渲染过滤条件panel
		}
	}) ;
　　return {
　　　　init: list
　　};
});