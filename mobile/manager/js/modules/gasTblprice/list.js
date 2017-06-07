define(function (){
　　　　var list = function (){
			new sysTblPrice() ;
　　　　};

		var sysTblPrice = Container.extends({
			//静态数据
			paramData : { filterPanel : {
				collasibleRadios : [{data : [ {text : "全部" , id : "" } , {text : "未启用" , id : "0" } , 
									{text : "已启用" , id : "1" }] , 
									options : {title:'状态' ,  id:'state' , height : '8.2em' }}] 
			}},
			//使用promise获取用户类型数据
			getTypeCodeTree : function(){
				var p = new Promise(function(resolve, reject){
					$.customAjax(''+config.basePath+config.getTypeCodeTree , {showEmptyNode:1,keyId:''} , function(flag , data){
						if('success' === flag)
							resolve(data) ;
					}) ;
				}) ;
				return p ;
			},
			//获取价格数据
			getPriceData : function(params,scope){
				var self = this == window ? scope : this ;
				$.customAjax(''+config.basePath+config.getTblPrice , params , function(flag , data){
					if('success' === flag)
						//渲染分页，table数据使用callback回调函数渲染
						chintPlugins.pageBreakPlugin.init(chintBodyMain.find('#priceManageSpan'),data,{pageCount:2}).render(self.renderPriceTable , self) ;
				}) ;
			},
			//获取推送结果
			getPushResult : function(priceid,scope){
				var params ={ priceid : priceid} ;
				$.customAjax(''+config.basePath+config.getPricePushInfo , params , function(flag , data){
					data.total = !data.total ? data.rows.length : data.total ;
					if('success' === flag)
						chintPlugins.pageBreakPlugin.init(chintBodyMain.find('#pushResultSpan'),data,{pageCount:5}).render(scope.renderPushResultTable , scope) ;
				}) ;
			},
			//渲染table主体
			renderTableBody : function(){
				var self = this ;
				var chintMainInnerHtml = ['<h2>价格管理</h2>'  ,
					  '<a id="filterConditionElement" href="#" data-ajax="false" style="float:right;margin-top:-3em;">过滤条件</a>' ,
					  '<table id="priceManage" data-role="table" data-column-btn-theme="b" data-column-popup-theme="a" data-mode="" class="table-stroke">' ,
					  		'<thead><tr class="th-groups"><th style="width:4.15em;">价格名称</th><th style="width:4.15em;">价格模式</th>' ,
					  		'<th style="width:4.15em;">浮动阶梯</th><th style="width:4.15em;">阶数</th></tr></thead>' ,
					  	 '<tbody></tbody>' ,
					  '</table>' ,
					  '<span id="priceManageSpan" style="float:right;"></span>'  ,
					  '<h2 style="margin-top:2em;">推送结果</h2>'  ,
					  '<table id="pushResult" data-role="table" data-column-btn-theme="b" data-column-popup-theme="a" data-mode="" class="table-stroke">' ,
					  		'<thead><tr class="th-groups"><th style="width:8em;">区域</th><th style="width:8em;">编号</th></tr></thead>' ,
					  	 '<tbody></tbody>' ,
					  '</table>' ,
					  '<span id="pushResultSpan" style="float:right;"></span>'].join("") ;
				chintBodyMain.append(chintMainInnerHtml).trigger("create") ;
				self.getPriceData({rows:10000}) ;
			},
			//渲染价格管理table
			renderPriceTable : function(data , _this){
				var self = this == window ? _this : this;
				var fragment = document.createDocumentFragment();
				var optionTable = $(chintBodyMain).find('#priceManage tbody') ;
				optionTable.empty() ;//先清空table中的内容再渲染table
				data.rows.forEach(function(data,index){
					var pricemode = String(data.pricemode) ;
					switch(pricemode){
						case "0" : pricemode = "单阶定价" ;
								break ;
						case "1" : pricemode = "月度阶梯" ;
								break ;
						case "2" : pricemode = "季度阶梯" ;
								break ;
						case "3" : pricemode = "年度阶梯" ;
								break ;
						default : pricemode = "未知定价模式" ;
								break ;
					}
					var floatflag = String(data.floatflag) ;
					floatflag = "1" === floatflag ? "按人数浮动" : "不浮动" ;
					var state = data.state ;
					state = state > 0 ? "已启用" : "未启用" ;
					var expire = data.expire ;
					expire = 1 == expire ? "已过期" : "未过期" ;
					var tr = $(["<tr><td  style='border:0;'>",data.title,"</td><td  style='border:0;'>", pricemode ,"</td><td  style='border:0;'>",floatflag,
						"</td><td  style='border:0;'>",data.stepamount,"</td></tr>",
						"<tr><td  style='font-weight:bold ;border:0;'>实施用户类型</td><td colspan='3' style='border:0;'>",data.customerTypeNames,"</td></tr>",
						"<tr><td  style='font-weight:bold ;border:0;'>实施日期</td><td colspan='3' style='border:0;'>",data.begindate,"</td></tr>",
						"<tr><td  style='font-weight:bold ;border:0;'>截止日期</td><td colspan='3' style='border:0;'>",data.enddate,"</td></tr>",
						"<tr><td  style='font-weight:bold ;border:0;'>实施区域</td><td colspan='3' style='border:0;'>",data.zonenames,"</td></tr>",
						"<tr><td  style='font-weight:bold ;border:0;'>人口基数</td><td style='border:0;'>",data.personamount,"</td><td  style='font-weight:bold ;border:0;'>",
						"一阶价格</td><td style='border:0;'>",$.parseVoidValue(data.price1),"</td></tr>",
						"<tr><td  style='font-weight:bold ;border:0;'>二阶价格</td><td style='border:0;'>",$.parseVoidValue(data.price2),"</td><td  style='font-weight:bold ;border:0;'>",
						"二阶计价气量</td><td style='border:0;'>",$.parseVoidValue(data.step2),"</td></tr>",
						"<tr><td  style='font-weight:bold ;border:0;'>三阶价格</td><td style='border:0;'>",$.parseVoidValue(data.price3),"</td><td  style='font-weight:bold ;border:0;'>",
						"三阶计价气量</td><td style='border:0;'>",$.parseVoidValue(data.step3),"</td></tr>",
						"<tr><td  style='font-weight:bold ;border:0;'>四阶价格</td><td style='border:0;'>",$.parseVoidValue(data.price4),"</td><td  style='font-weight:bold ;border:0;'>",
						"四阶计价气量</td><td style='border:0;'>",$.parseVoidValue(data.step4),"</td></tr>",
						"<tr><td  style='font-weight:bold ;border:0;'>五阶价格</td><td style='border:0;'>",$.parseVoidValue(data.price5),"</td><td  style='font-weight:bold ;border:0;'>",
						"五阶计价气量</td><td style='border:0;'>",$.parseVoidValue(data.step5),"</td></tr>",
						"<tr><td  style='font-weight:bold ;border:0;'>人均浮动气量</td><td style='border:0;'>",data.floatgas,"</td><td  style='font-weight:bold ;border:0;'>",
						"发布人</td><td style='border:0;'>",data.username,"</td></tr>",
						"<tr><td  style='font-weight:bold ;border:0;'>当前状态</td><td style='border:0;'>",state,"</td><td  style='font-weight:bold ;border:0;'>",
						"生效状态</td><td style='border:0;'>",expire,"</td></tr>",
						"<tr><td  style='font-weight:bold ;'>生成时间</td><td colspan='3'>",data.createdate,"</td></tr>",
						"<tr/>"].join("")) ;
					tr.each(function(index){
						fragment.appendChild(this) ;
						chintPlugins.tablePlugin.trColorSetting(this,index,{total:12,tds:[1,3]}) ;//行点击效果
					}) ;
					tr.attr({priceid : data.priceid} ) ;
					tr.on("touchstart" , function(){
						self.getPushResult($(this).attr("priceid"),self) ;
					} ) ;
				}) ;
				optionTable.append(fragment).trigger("create") ;
			},
			//渲染价格过滤条件panel
			renderFilterPanel : function(){
				var self = this ;
				var radioPlugin = chintPlugins.radioPlugin ;
				var datetimepickerPlugin = chintPlugins.datetimepickerPlugin ;
				self.getTypeCodeTree().then(function(data){
					self.paramData.filterPanel.collasibleRadios.unshift( {data : data , options : {title:'用户类型' ,  id:'customerTypeCodes' , height : '8.2em' } } );
					return "" ;
				}).then(function(data){
					var fragment = document.createDocumentFragment();
					fragment.appendChild($("<label>过滤条件</label>")[0]) ;
					var startTime = datetimepickerPlugin.init( { labelName : "生效时间" , name : "transdate_start" } ).render() ;
					var endTime = datetimepickerPlugin.init( { labelName : "截止时间" , name : "transdate_end" } ).render() ;
					fragment.appendChild(startTime) ;
					fragment.appendChild(endTime) ;
					radioPlugin.renderCollasibleRadio( self.paramData.filterPanel.collasibleRadios , fragment ) ;//绘制下拉单选组件
					var button = $("<button class='confirm-button'>确认</button>") ;
					button.on("touchstart" , function(){
						$.queryContext( filterInner , filterPanel , self.getPriceData , null , self) ;//tableDataHandle ) ;
					}) ;
					fragment.appendChild(button[0]) ;
					filterInner.append(fragment).trigger("create") ;
				}) ;
			},
			//为过滤条件标签绑定点击事件
			clickFilterConditionEle : function(){
				//显示过滤查询panel
				$(chintBodyMain).find('#filterConditionElement').on('touchstart',function(){
					filterPanel.find("input").val("") ;
					filterPanel.panel().panel("open");
				}) ;
			},
			//渲染推送结果table
			renderPushResultTable : function(data , scope){
				var fragment = document.createDocumentFragment();
				var optionTable = $(chintBodyMain).find('#pushResult tbody') ;
				optionTable.empty() ;//先清空table中的内容再渲染table
				data.rows.forEach(function(data,index){
					var createdate = scope.formatTime( $.parseVoidValue(data.createdate) ) ;
					var senddate = scope.formatTime( $.parseVoidValue(data.senddate) ) ;
					var sendflag = data.sendflag ;
					sendflag = sendflag > 0 ? "已下发" : "未下发" ;
					var tr = $(["<tr><td  style='border:0;'>",data.zonename,"</td><td  style='border:0;'>", data.devicecode ,"</td></tr>",
						"<tr><td  style='font-weight:bold ;border:0;'>表具名称</td><td style='border:0;'>",$.parseVoidValue(data.devicename),"</td></tr>",
						"<tr><td  style='font-weight:bold ;border:0;'>下发状态</td><td style='border:0;'>",sendflag,"</td></tr>",
						"<tr><td  style='font-weight:bold ;border:0;'>推送时间</td><td style='border:0;'>",createdate,"</td></tr>",
						"<tr><td  style='font-weight:bold ;'>下发时间</td><td>",senddate,"</td></tr>",
						"<tr/>"].join("")) ;
					tr.each(function(index){
						fragment.appendChild(this) ;
						chintPlugins.tablePlugin.trColorSetting(this,index,{total:5,tds:[1,3]}) ;//行点击效果
					}) ;
				}) ;
				optionTable.append(fragment).trigger("create") ;
			},
			//格式化时间,去掉时间最后的小数点
			formatTime : function(time){
				return time.substr(0,time.lastIndexOf('.')) ;
			},
			init : function(){
				var self = this ;
				$.emptyInnerPanel() ;//清空mainbody的内容
				self.renderTableBody() ;//渲染table主体
				self.renderFilterPanel() ;//渲染过滤条件panel
				self.clickFilterConditionEle() ;//过滤条件标签绑定点击事件
			}
		}) ;

　　　　return {
　　　　　　init: list
　　　　};
});