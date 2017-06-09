define(function (){
　　var list = function (){
		new purchaseGasDetail() ;
　　};
	var purchaseGasDetail = Container.extends({
		//获取购气明细数据
		getDetailData: function(params , scope){
			var self = this == window ? scope : this ;
			$.customAjax(''+config.basePath+config.getBussinessPart , params , function(flag , data){
				if('success' === flag)
					//渲染分页，table数据使用callback回调函数渲染
					chintPlugins.pageBreakPlugin.init(chintBodyMain.find('#purchaseGasDetailSpan'),data,{pageCount:5}).render(self.renderTableBody , self) ;
			}) ;
		},
		//渲染营业厅购气明细表表头
		renderTableHead : function(){
			var self = this ;
			var chintMainInnerHtml   =  [
				  '<h2>营业厅购气明细表</h2>'  ,
				  '<a id="filterConditionElement" href="#" data-ajax="false" style="float:right;margin-top:-3em;">过滤条件</a>' ,
				  '<table id="purchaseGasDetailTable" data-role="table" data-column-btn-theme="b" data-column-popup-theme="a" data-mode="" class="table-stroke">' ,
				  		'<thead><tr class="th-groups"><th style="width:4.15em;">用户号</th><th style="width:4.15em;">用户名称</th>' ,
				  		'<th style="width:4.15em;">客户类型</th><th style="width:4.15em;">收费时间</th></tr></thead>' ,
				  	 '<tbody></tbody>' ,
				  '</table>' ,
				  '<span id="purchaseGasDetailSpan" style="float:right;"></span>'].join("")  ;
			chintBodyMain.append(chintMainInnerHtml).trigger("create") ;
			self.getDetailData({rows:10000}) ;
		},
		//渲染营业厅购气明细表内容
		renderTableBody : function(data){
			var fragment = document.createDocumentFragment();
			var optionTable = $(chintBodyMain).find('#purchaseGasDetailTable tbody') ;
			optionTable.empty() ;//先清空table中的内容再渲染table
			data.rows.forEach(function(data,index){
				var transtype = data.transtype ;
				transtype = 1 == transtype ? "充值" : (3 == transtype ? "缴费" : "") ;
				var tr = $("<tr><td  style='border:0;word-break:break-all;'>"+data.accountno+"</td><td  style='border:0;word-break:break-all;'>"+data.ownername +
								"</td><td  style='border:0;'>"+data.typename+"</td><td  style='border:0;'>"+$.parseVoidValue(data.transdate)+"</td></tr>"+
								"<tr><td  style='font-weight:bold ;border:0;'>费用项目</td><td  style='border:0;'>"+$.parseVoidValue(transtype)+"</td>"+
								"<td  style='font-weight:bold ;border:0;'>地址</td><td  style='border:0;'>"+$.parseVoidValue(data.address)+"</td></tr>"+
								"<tr><td  style='font-weight:bold ;border:0;'>业务类型</td><td style='border:0;'>"+$.parseVoidValue(data.typemode)+"</td>"+
								"<td  style='font-weight:bold ;border:0;'>购气量</td><td style='border:0;'>"+$.parseVoidValue(data.gasamount)+"</td></tr>"+
								"<tr><td  style='font-weight:bold ;border:0;'>阶数</td><td style='border:0;'>"+$.parseVoidValue(data.unitPrice)+"</td>"+
								"<td  style='font-weight:bold ;border:0;'>应收金额</td><td style='border:0;'>"+$.parseVoidValue(data.transmoney)+"</td></tr>"+
								"<tr><td  style='font-weight:bold ;border:0;'>滞纳金</td><td style='border:0;'>"+$.parseVoidValue(data.penalty)+"</td>"+
								"<td  style='font-weight:bold ;border:0;'>实收金额</td><td style='border:0;'>"+$.parseVoidValue(data.summoeny)+"</td></tr>"+
								"<tr><td  style='font-weight:bold ;'>发票号</td><td>"+$.parseVoidValue(data.invoiceNo)+"</td>"+
								"<td  style='font-weight:bold;'>收款人</td><td>"+$.parseVoidValue(data.username)+"</td></tr>"+
								"<tr/>") ;
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
			var datetimepickerPlugin = chintPlugins.datetimepickerPlugin ;
			var fragment = document.createDocumentFragment();
			fragment.appendChild($("<label>过滤条件</label>")[0]) ;
			var startTime = datetimepickerPlugin.init( { labelName : "开始时间" , name : "starttime" } ).render() ;
			var endTime = datetimepickerPlugin.init( { labelName : "结束时间" , name : "endtime" } ).render() ;
			fragment.appendChild(startTime) ;
			fragment.appendChild(endTime) ;
			var button = $("<button  class='confirm-button'>确认</button>") ;
			button.on("touchstart" , function(){
				$.queryContext( filterInner , filterPanel , self.getDetailData , null , self ) ;
			}) ;
			fragment.appendChild(button[0]) ;
			filterInner.append(fragment).trigger("create") ;
			//为过滤条件标签绑定touch事件
			$(chintBodyMain).find('#filterConditionElement').on('touchstart',function(){
				filterPanel.find("input").val("") ;
				filterPanel.panel().panel("open");
			}) ;
		},
		init : function(){
			var self = this ;
			$.emptyInnerPanel() ;//清空mainbody的内容
			self.renderTableHead() ;//渲染表头
			self.renderFilterPanel() ;//渲染过滤条件panel
		}
	}) ;
　　return {
　　　　init: list
　　};
});