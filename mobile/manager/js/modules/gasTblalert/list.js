define(function (){
　　var list = function (){
		new gasAlert() ;
　　};
	var gasAlert = Container.extends({
		//静态数据
		paramData : { filterPanel : {
						inputs : [ {label:'表号',name:'devicecode'} , {label:'表名',name:'devicename'} , {label:'确认人',name:'confirmuser'} ,
									  {label:'处理人',name:'recorduser'} , {label:'报警内容',name:'alertmsg'} , {label:'处理结果',name:'processrecord'} ] 
		}} ,
		//获取事件报警数据
		getAlertData : function(params , scope){
			var self = this == window ? scope : this ;
			$.customAjax(''+config.basePath+config.searchIncidentAlert , params , function(flag , data){
				if('success' === flag)
					//渲染分页，table数据使用callback回调函数渲染
					chintPlugins.pageBreakPlugin.init(chintBodyMain.find('#incidentAlertSpan'),data,{pageCount:5}).render(self.renderTableBody , self) ;
			}) ;
		},
		//渲染事件报警表头
		renderTableHead : function(){
			var self = this ;
			var chintMainInnerHtml   = [
				  '<h2>事件报警</h2>' ,
				  '<a id="filterConditionElement" href="#" data-ajax="false" style="float:right;margin-top:-3em;">过滤条件</a>' ,
				  '<table id="incidentAlertTable" data-role="table" data-column-btn-theme="b" data-column-popup-theme="a" data-mode="" class="table-stroke">' ,
				  		'<thead><tr class="th-groups"><th style="width:4.15em;">日期</th><th style="width:4.15em;">表号</th>' ,
				  		'<th style="width:4.15em;">表名</th><th style="width:4.15em;">所属区域</th></tr></thead>' ,
				  	 '<tbody></tbody>' ,
				  '</table>' ,
				  '<span id="incidentAlertSpan" style="float:right;"></span>'].join("")  ;
			chintBodyMain.append(chintMainInnerHtml).trigger("create") ;
			self.getAlertData({rows:10000}) ;
		},

		//渲染事件报警内容
		renderTableBody : function(data){
			var fragment = document.createDocumentFragment();
			var optionTable = $(chintBodyMain).find('#incidentAlertTable tbody') ;
			optionTable.empty() ;//先清空table中的内容再渲染table
			data.rows.forEach(function(data,index){
				var tr = $(["<tr><td  style='border:0;word-break:break-all;'>",data.alertdate,"</td><td  style='border:0;word-break:break-all;'>",data.devicecode ,
								"</td><td  style='border:0;'>",data.devicename,"</td><td  style='border:0;'>",$.parseVoidValue(data.zonename),"</td></tr>",
								"<tr><td  style='font-weight:bold ;border:0;'>内容</td><td style='border:0;'>",$.parseVoidValue(data.alertmsg),"</td>",
								"<td  style='font-weight:bold ;border:0;'>确认标记</td><td style='border:0;'>",$.parseVoidValue(data.confirmflag),"</td></tr>",
								"<tr><td  style='font-weight:bold ;border:0;'>确认人</td><td style='border:0;'>",$.parseVoidValue(data.confirmuser),"</td>",
								"<td  style='font-weight:bold ;border:0;'>是否处理</td><td style='border:0;'>",$.parseVoidValue(data.processflag),"</td></tr>",
								"<tr><td  style='font-weight:bold ;border:0;'>处理结果</td><td colspan='3' style='border:0;'>",$.parseVoidValue(data.processrecord),"</td></tr>",
								"<tr><td  style='font-weight:bold ;'>处理结果填写人</td><td colspan='3'>",$.parseVoidValue(data.recorduser),"</td></tr>",
								"<tr/>"].join("")) ;
				tr.each(function(index){
					fragment.appendChild(this) ;
					chintPlugins.tablePlugin.trColorSetting(this,index,{total:4,tds:[1,3]}) ;//行点击效果
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
				$.queryContext( filterInner , filterPanel , self.getAlertData , null , self ) ;
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
			self.renderTableHead() ;//渲染事件报警表头
			self.renderFilterPanel() ;//渲染过滤条件panel
		}
	}) ;
　　return {
　　　　init: list
　　};
});