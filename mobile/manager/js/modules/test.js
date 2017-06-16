!(function(){
	var test = Container.extends({
		//获取最新报警数据
		newestAlert : function(){
			var page = {sort:"alertdate",order:"desc",processflag:"0"};
			var p = new Promise(function(resolve, reject){
				$.customAjax(['',config.basePath,config.newAlerts].join("") , page , function(flag,data){
					if('success' === flag)
						resolve(data) ;
				}) ;
			}) ;
			return p ;
		},
		//获取最新动态数据
		newestAction : function(){
			var p = new Promise(function(resolve, reject){
				$.customAjax(['',config.basePath,config.newestActions].join(""),{state:"1",mobile:"0"},function(flag,data){
					if('success' === flag)
						resolve(data) ;
				}) ;
			}) ;
			return p ;
		},
		//用气概况
		gasProfile : function(){
			var p = new Promise(function(resolve, reject){
				$.customAjax(['',config.basePath,config.gasProfiles].join("") ,{ year: "0" },function(flag,data){
					if('success' === flag)
						resolve(data) ;
				}) ;
			}) ;
			return p ;
		},
		//全年用气概况
		annualGasProfile : function(){
			var p = new Promise(function(resolve, reject){
				$.customAjax(['',config.basePath,config.annualGasProfiles].join("") ,{ year: "1" } , function(flag,data){
					if('success' === flag)
						resolve(data) ;
				}) ;
			}) ;
			return p ;
		},
		//渲染最新报警
		renderAlert : function(){
			var self = this ;
			self.newestAlert().then(function(data){
				var alertBody = $(".newest_alert tbody") ;
				data.rows.forEach(function(row , index ){
					var tr = ["<tr><td>",row.alertdate,"</td>","<td>",row.zonename,"</td>","<td>",row.devicename,"</td>","<td>",row.alertmsg,"</td></tr>"].join("") ;
					alertBody.append(tr) ;
				}) ;
			}) ;
		},
		//渲染最新动态
		renderAction : function(){
			var self = this ;
			self.newestAction().then(function(data){
				var actionBody = $(".newest_action tbody") ;
				data.rows.forEach(function(row , index ){
					var tr = ["<tr><td>",row.title,"</td><td>",$.parseVoidValue( row.updatetime ),"</td></tr>"].join("") ;
					actionBody.append(tr) ;
				}) ;
			}) ;
		},
		//渲染用气概况table
		renderProfile : function(){
			var self = this ;
			self.gasProfile().then(function(data){
				console.log("daily data is :",data) ;
				self.getRecentProfile(data.data,self) ;
				return self.annualGasProfile() ;
			}).then(function(data){
				self.getAnnualProfile(data.data,self) ;
				console.log("annual data is :",data) ;
			}) ;
		},
		//获取当前用气概况信息
		getRecentProfile : function(data,scope){
			var gasPro = $(".gas_profile table") ;
			var tr = [
					"<tr><td>正常用户</td><td>",data[0].accountamount,"户</td></tr>",
					"<tr><td>停户数</td><td>",data[0].stoppedamount,"</td></tr>",
					"<tr><td>欠费总额</td><td>",data[0].arrearmoney,"元</td></tr>",
					"<tr><td>欠费户数</td><td>",data[0].arrearamount,"户</td></tr>",
					"<tr><td>当月充值金额</td><td>",data[0].rechargemoney,"元</td></tr>",
					"<tr><td>当月充值人次</td><td>",data[0].rechargetimes,"人次</td></tr>",
					"<tr><td>当月缴费金额</td><td>",data[0].chargemoney,"元</td></tr>",
					"<tr><td>当月缴费人次</td><td>",data[0].chargetimes,"人次</td></tr>"
					].join("") ;
			gasPro.append(tr) ;
		},
		//获取全年用气概况信息
		getAnnualProfile : function(data,scope){

		},
		//为菜单栏绑定事件
		bindMenu : function(){
			var self = this ;
			var $submenu = $('.submenu');
			var $mainmenu = $('.mainmenu');
			$mainmenu.on('touchstart','li',function(){
				$(this).next('.submenu').slideToggle().siblings('.submenu').slideUp();
			}) ;
			$mainmenu.children('li:last-child').on('touchstart', function() {
				$mainmenu.fadeOut().delay(500);
			});
			self.bindTouchLi($submenu) ;
		},
		//为菜单栏的li标签绑定事件
		bindTouchLi:function($submenu){
			var self = this ;
			$submenu.on('touchstart','li', function() {
				$submenu.siblings().find('li').removeClass('chosen');
				$(this).addClass('chosen');
				var path = $(this).attr("src") ;
				self.getDiffModules(path) ;
			});
		},
		//按需加载模块
		getDiffModules : function(path){
			var modulePath = config.modulePath+path+".js" ;
			//require.config({baseUrl: modulePath}) ;
			require([modulePath], function (module){
	　　　　	console.log("the module test is >>>",module.init?module.init():module.list());
	　　	});
		},
		//为菜单标签绑定事件
		menuTouch : function(){
			var self = this ;
			var $submenu = $('.submenu');
			var $mainmenu = $('.mainmenu');
			$("body .menu_icon img").on("touchstart",function(e){
				$submenu.hide();
				$submenu.first().delay(400).slideDown(700);
				$mainmenu.fadeIn().delay(500) ;
			}) ;
		},
		init : function(){
			var self = this ;
			self.menuTouch() ;
			self.bindMenu() ;
			self.renderAlert() ;//渲染最新报警
			self.renderAction() ;//渲染最新动态
			self.renderProfile() ;//渲染用气概况
		}
	}) ;
	new test() ;
})() ;