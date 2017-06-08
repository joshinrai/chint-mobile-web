define(function (){
　　var list = function (){
		new sysTblsysoption() ;
　　};
  	var sysTblsysoption = Container.extends({
  		//过滤条件和修改的panel中组件静态数据
  		panelData : {
			filterPanel : {
				inputs : [{label:'参数英文名称',name:'optionname'} , {label:'参数中文名称',name:'optionnamecn'}],
				collasibleRadios : []
			} ,
			modifypanel :{
				inputs : [{label:'参数英文名',name:'optionname' , readonly : true} , 
						  {label:'参数中文名',name:'optionnamecn' , readonly : true } ,
						  {label:'参数组名',name:'optiongroup' , readonly : true } ,  
						  {label:'参数值',name:'optionvalue'}],
				textAreas : [{labelName:'说明',id:'description',name:'optiondescription'}]
			}
		} ,
		//获取系统列表
		getOptiongroup : function(){
			var p = new Promise(function(resolve, reject){
				$.customAjax(''+config.basePath+config.optionGroups , {} , function(flag , data){
					if('success' === flag)
						resolve(data) ;
				}) ;
			}) ;
			return p ;
		},
		//获取系统参数数据
		getSysOptionData : function(params,_this){
			var self = this == window ? _this : this ;
			//获取table数据
			$.customAjax(''+config.basePath+config.sysOptionsDataList , params , function(flag , data){
				if('success' === flag)
					//渲染分页，table数据使用callback回调函数渲染
					chintPlugins.pageBreakPlugin.init(chintBodyMain.find('span'),data,{pageCount:5}).render(self.renderTblOptionTable , self) ;
			}) ;
		},
  		//渲染table主体
  		renderTableBody : function(){
  			var self = this ;
			var chintMainInnerHtml   = [
			   	'<h2>系统参数</h2>',
			   	'<a id="filterConditionElement" href="#" data-ajax="false" style="float:right;margin-top:-3em;">过滤查询</a>',
			  	'<table data-role="table" data-column-btn-theme="b" data-column-popup-theme="a" data-mode="" class="table-stroke">',
			   		'<thead><tr class="th-groups"><th style="width:5.5em;">参数英文名</th><th style="width:5.5em;">参数中文名</th>',
			   		'<th style="width:4.5em;">参数组名</th><th style="width:3.5em;">参数值</th></tr></thead>',
		  		 	'<tbody></tbody>',
			   	'</table>',
			   	'<span style="float:right;"></span>'].join("") ;
			chintBodyMain.append(chintMainInnerHtml).trigger("create") ;
			self.getSysOptionData({rows:10000}) ;
  		},
  		//获取table数据
  		renderTblOptionTable : function(data , _this){
  			var self = this == window ? _this : this;
			var fragment = document.createDocumentFragment();
			var optionTable = $(chintBodyMain).find('table tbody') ;
			optionTable.empty() ;//先清空table中的内容再渲染table
			data.rows.forEach(function(data,index){
				var tr= $(["<tr><td  style='border:0;'>",data.optionname,"</td><td  style='border:0;'>",data.optionnamecn,"</td><td  style='border:0;'>",
								data.optiongroup,"</td><td  style='border:0;'>",data.optionvalue,"</td></tr>",
								"<tr><td  style='font-weight:bold ;border:0;'>说明</td><td colspan='3' style='border:0;'>",data.optiondescription,"</td></tr>",
								"<tr userData=",JSON.stringify({data:data,index:index}),"><td colspan='3'/><td><a style='font-weight:300;'>修改</a></td></tr>"].join("")) ;
				tr.each(function(index){
					fragment.appendChild(this) ;
					chintPlugins.tablePlugin.trColorSetting(this,index,{total:2,tds:[1,3]}) ;//行点击效果
				}) ;
				aTds = $(tr.find('a')[0]) ;
				//修改点击事件
				aTds.on('click',function(){
					self.modifyEvent(this) ;
				}) ;
			}) ;
			optionTable.append(fragment).trigger("create") ;
		},
  		//渲染过滤条件panel内容
  		renderFilterPanel : function(){
  			var self = this ;
  			var inputPlugin = chintPlugins.inputPlugin ;
  			var radioPlugin = chintPlugins.radioPlugin ;
  			var filterPanelData = self.panelData.filterPanel ;
  			var filterInputs = filterPanelData.inputs ;
  			var collasibleRadios = filterPanelData.collasibleRadios ;
  			self.getOptiongroup().then(function(data){
  				if(0 == collasibleRadios.length) collasibleRadios.push({data : data , options : {title:'参数组名' ,  id:'menuTree' , height : '8.2em' } }) ;
  				return "" ;
  			}).then(function(data){
	  			var fragment = document.createDocumentFragment();
				fragment.appendChild($("<label>过滤条件</label>")[0]) ;
				filterInputs.forEach(function(data , index){
					fragment.appendChild( inputPlugin.init( null , {} , {labelName : data.label , id : data.name , name : data.name } ).render() ) ;
				}) ;
				radioPlugin.renderCollasibleRadio( collasibleRadios , fragment ) ;//绘制下拉单选组件
				var button = $("<button  class='confirm-button'>确认</button>") ;
				button.on("touchstart" , function(){
					$.queryContext( filterInner , filterPanel , self.getSysOptionData , null , self) ;
				}) ;
				fragment.appendChild(button[0]) ;

				//为过滤条件panel绑定监听
				$(chintBodyMain).find('#filterConditionElement').on('touchstart',function(){
					filterPanel.find("input").val("") ;
					filterPanel.panel().panel("open");
				}) ;
				filterInner.append(fragment).trigger("create") ;
  			}) ;
  		},
  		//渲染修改panel内容
		renderModifyPanel : function(){
			var self = this ;
			var inputPlugin = chintPlugins.inputPlugin ;
			var modifyPanelData = self.panelData.modifypanel ;
  			var modifyInputs = modifyPanelData.inputs ;
  			var modifyTextAreas = modifyPanelData.textAreas ;
  			
			var fragment = document.createDocumentFragment() ;
			fragment.appendChild($("<label>")[0]) ;
			modifyInputs.forEach(function(data , index){
				fragment.appendChild( inputPlugin.init( null , {} , {labelName : data.label , id : data.name , name : data.name , readonly : data.readonly } ).render() ) ;
			}) ;
			var textArea = chintPlugins.textareaPlugin.init( null , {} , modifyTextAreas[0] ).render() ;
			fragment.appendChild(textArea) ;
			var hintLabel = $("<label style='color:red;' class='hintLabel'></label>") ;
			fragment.appendChild(hintLabel[0]) ;
			var button = $("<button class='confirm-button'>确认</button>") ;
			button.on("click" , self.modifyPanelOpration) ;
			fragment.appendChild(button[0]) ;
			modifyInner.append(fragment).trigger("create") ;
		},
  		//添加修改功能
  		modifyEvent : function(_a){
  			var radioPlugin = chintPlugins.radioPlugin ;
			modifyPanel.find("label")[0].textContent = "修改" ;
			var userData = JSON.parse(_a.parentNode.parentNode.attributes.userData.value) ;
			var inputs = modifyPanel.find('input') ;
			inputs.each(function(index , data){
				this.value = userData.data[this.name] ;
			}) ;
			var textarea = modifyInner.find("textarea") ;
			textarea[0].value = userData.data.optiondescription ;
			modifyPanel.find("button").attr("dataId" , userData.data.id)
			modifyPanel.find(".hintLabel").hide() ;
			modifyPanel.panel().panel("open");
  		},
  		//修改button点击操作
		modifyPanelOpration : function(){
			var params = {} ;
			var chintInput = modifyInner.find('.chintInput') ;
			chintInput.each(function(index , data){
				params[data.name] = data.value ;
			}) ;
			var textArea = modifyInner.find("textarea") ;
			params.optiondescription = textArea[0].value ;
			params.id = modifyInner.find("button").attr("dataId") ;
			$.customAjax(''+config.basePath+config.sysOptionsDataModify , params , function(flag , data){
				var hintLabel = modifyPanel.find(".hintLabel") ;
				hintLabel[0].textContent = data.msg  ;
				hintLabel[0].style.color = "green"  ;
				hintLabel.show() ;
				setTimeout( function(){modifyPanel.panel().panel("close")} , 1000) ;
			}) ;
		},
  		init : function(){
			var self = this ;
			$.emptyInnerPanel() ;//清空内容
			self.renderTableBody() ;//渲染table主体
			self.renderFilterPanel() ;//渲染过滤条件panel
			self.renderModifyPanel() ;//渲染修改panel
  		}
	}) ;
　  return {
　　　　init: list
　  };
});