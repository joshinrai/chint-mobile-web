define(function (){
　　var list = function (){
		new issueNews() ;
　　};
	var issueNews = Container.extends({
		//获取新闻信息
		getIssueNews : function(params , scope){
			var self = this == window ? scope : this;
			//添加table数据
			$.customAjax(''+config.basePath+config.issueTblnewsDataList , params , function(flag , data){
				if('success' === flag)
					//渲染分页，table数据使用callback回调函数渲染
					chintPlugins.pageBreakPlugin.init(chintBodyMain.find('span'),data,{pageCount:4}).render(self.renderTableBody ,self) ;
			}) ;
		},
		//渲染新闻编辑表头
		renderTableHead : function(){
			var self = this ;
			var chintMainInnerHtml   =  [
			   '<h2>新闻编辑</h2>'  ,
			   '<div">'  ,
			   		'<a id="addElement" href="#" data-ajax="false" class="addElement">添加</a>' ,
			   		'<a id="filterConditionElement" href="#" data-ajax="false" class="filterConditionElement">过滤查询</a>' ,
			   '</div>'  ,
		 	   '<table data-role="table" data-column-btn-theme="b" data-column-popup-theme="a" data-mode="" class="table-stroke">' ,
			   		'<thead><tr class="th-groups"><th style="width:4.15em">标题</th><th style="width:4.15em">是否发布</th>' ,
			   		'<th style="width:4.15em">新闻类别</th><th style="width:4.15em">创建者</th> ' ,
			   		'</tr></thead>' ,
			   		 '<tbody></tbody>' ,
			   '</table>' ,
			   '<span style="float:right;"></span>'].join("") ;
		   	chintBodyMain.append(chintMainInnerHtml).trigger("create") ;
		   	self.getIssueNews() ;//获取新闻信息
		},
		//渲染新闻内容
		renderTableBody : function(data , scope){
			var self = this == window ? scope : this;
			var fragment = document.createDocumentFragment();
			var optionTable = $(chintBodyMain).find('table tbody') ;
			optionTable.empty() ;//先清空table中的内容再渲染table
			data.rows.forEach(function(data,index){
				var state = data.state ;
				state = ( 0==state ) ? "否" : (( 1==state ) ? "是" : "") ; 
				var mobile = data.mobile ;
				mobile = ( 0==mobile ) ? "内部新闻" : (( 1==mobile ) ? "用户公告" : "") ; 
				var tr = $(["<tr><td style='border:0 ;'>",data.title,"</td><td style='border:0 ;'>",state,"</td><td style='border:0 ;'>",
									mobile,"</td><td style='border:0 ;'>",data.createuser,"</td></tr>",
								"<tr><td  style='font-weight:bold;border:0;'>内容</td><td colspan='3' style='border:0;'>",data.content,"</td></tr>",
								"<tr><td  style='font-weight:bold;border:0;'>创建时间</td><td colspan='3' style='border:0;'>",data.createtime,"</td></tr>",
								"<tr><td  style='font-weight:bold;border:0;'>更新时间</td><td colspan='3' style='border:0;'>",data.updatetime,"</td></tr>",
								"<tr><td  style='font-weight:bold;border:0;'>更改者</td><td colspan='3' style='border:0;'>",data.updateuser,"</td></tr>",
								"<tr userData=",JSON.stringify({data:data,index:index}),"><td colspan='2'/><td><a style='font-weight:300;float:right;'>修改</a></td><td>",
								"<a href='#modifyPopup' data-rel='popup' data-position-to='window' data-transition='pop' style='font-weight:300;text-decoration:none;float:right;'>删除</a>",
								"</td></tr>"].join("")) ;
		
				tr.each(function(index){
					fragment.appendChild(this) ;
					chintPlugins.tablePlugin.trColorSetting(this,index,{total:5,tds:[1 , 3]}) ;//行点击效果
				}) ;
				
				aTds = tr.find('a') ;
				//修改
				$(aTds[0]).on('click',function(){
					//modifyEvent(this) ;
				}) ;
				//删除
				$(aTds[1]).on('touchstart',function(){
					//deletePopupEvent(this) ;
				}) ;
			
			}) ;
			optionTable.append(fragment).trigger("create") ;
		},
		renderFilterPanel : function(){
			var self = this ;
			var inputPlugin = chintPlugins.inputPlugin ;
			var fragment = document.createDocumentFragment();
			var label = $("<label>过滤查询</label>") ;
			fragment.appendChild(label[0]) ;
			var dataArray = [{label:'信息标题',name:'title'}] ;
			dataArray.forEach(function(data , index){
				fragment.appendChild( inputPlugin.init( null , {} , {labelName : data.label , id : data.name , name : data.name} ).render() ) ;
			}) ;
			var button = $("<button class='confirm-button'>查询</button>") ;
			button.on("touchstart" , function(){
				$.queryContext( filterInner , filterPanel , self.getIssueNews , null , self ) ;
			}) ;
			fragment.appendChild(button[0]) ;
			filterInner.append(fragment).trigger("create") ;
			//为过滤查询panel绑定touch事件
			$(chintBodyMain).find('#filterConditionElement').on('touchstart',function(){
				filterPanel.find(".chintInput").val("") ;
				filterPanel.panel().panel("open");
			}) ;
		},
		init : function(){
			var self = this ;
			$.emptyInnerPanel() ;//清空mainbody的内容
			self.renderTableHead() ;//渲染新闻编辑表头
			self.renderFilterPanel() ;//渲染过滤条件panel内容
		}
	}) ;
　　return {
　　　　init: list
　　};
});