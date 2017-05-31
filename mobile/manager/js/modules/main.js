
(function( namespace ){
	//正泰主页
	var chintHomePage = $("#chintHomePage") ;
	
	//设置当前登录用户的信息的sessionStorage
	$.customAjax(''+config.basePath+config.getSessionStorage , {} , function(flag,data){
				if( "success" == flag ){
							sessionStorage.userMsg = JSON.stringify(data) ;
				}
	}) ;
	
	//提示标签
	var checkLabel = $("#confirmLabel") ;
	var strong = $("<p></p>") ;
 	var confirmObj = {oldPassword:"请输入原密码",newPassword:"请输入新密码",confirmPassword:"请输入确认密码"} ;
 	
	var gasProfileTbody = $("#gasProfileTbody") ;
 	var ratioOption = ["环比","同比"] ;
 	var nameOption = ["正常用户","停户数","欠费总额","欠费户数","当月充值金额","当月充值人次","当月缴费金额","当月缴费人次","上月用气量","上月消费金额",
 		"上月充值金额","上月缴费金额","全年用气量","全年消费金额","全年充值金额","全年缴费金额"] ;
 	var quantifierName = ["户","元","人次","立方"] ;

	//设置时分秒
    var getTime = function(time){
    	if(time<10){
    		return "0"+time ;
    	}else{
    		return ""+time ;
    	}
    }
    setInterval(function(){
    	var date = new Date() ;
    	$("#chintTime")[0].innerHTML = date.getFullYear()+"年"+getTime(date.getMonth()+1)+"月"+getTime(date.getDate())+"日"+ 
    	getTime(date.getHours())+"时"+getTime(date.getMinutes())+"分"+getTime(date.getSeconds())+"秒" ;
    },100) ;
     
    //1s后关闭修改密码panel
    var closeChangePassword = function(){
    		setTimeout( function(){$("#change-password").panel().panel("close")} , 1000) ;
    }
	
    //修改密码点击操作
    $(".passwordButton").on("touchstart",function(){
    		var changePassword = $("#change-password") ;
    		changePassword.find("input").val("") ;
    		checkLabel.hide() ;
    		changePassword.panel().panel("open") ;
    }) ;
    
    //修改密码
    $("#confirmFix").on("touchstart",function(){
    	var data = {} ;
    	var inputs = $(this.parentElement).find("input") ;
    	inputs.each(function(index , item){
    			if(0 === item.value.length){
	    			data.msg = confirmObj[item.id] ;
	    			handle(data,"red") ;
	    			return ;
	    		}
    	}) ;
    	var oldPwd = $("#oldPassword")[0].value ;
    	var newPwd = $("#newPassword")[0].value ;
    	if(newPwd !== $("#confirmPassword")[0].value){
	    	data.msg="新密码和确认密码不一致" ;
    		handle(data,"red") ;
    	}else{
    		$.customAjax(''+config.basePath+config.modifyPwd , {oldPwd:oldPwd,newPwd:newPwd} , function(flag,data){
    			if('success' === flag){
    				if(true === data.success){
             			handle(data,"green") ;
             			closeChangePassword() ;
             		}else if(false === data.success){
             			handle(data,"red") ;
             			//closeChangePassword() ;
             		}
    			}else{
    				handle(data,"red") ;
    			}
    		}) ;
    		checkLabel.hide() ;
    	}
    }) ;
   	    
    //重置
    $("#resetFix").on("touchstart",function(){
		$(this.parentElement).find("input").each(function(){
			$(this).val("") ;
		}) ;
		checkLabel.hide() ;
    }) ;
    
    //输入的修改密码和确认密码不一致时的处理函数
    var handle = function(data,color){
    	strong.empty() ;
       	checkLabel.empty() ;
       	strong[0].style.color = color||'red' ;
   		checkLabel.append(strong.append(data.msg)) ;
		checkLabel.show() ;
    }
    
	//返回正泰主页
	chintHomePage.on('touchstart',function(){
		location.reload(true) ;
	}) ;
    
    //退出
    var logout = function(){
    	$.customAjax(''+config.basePath+config.qiutLogout , '' , function(flag,data){
    		window.location.href = config.basePath+config.loginPage ;
    	}) ;
    }
    
	//菜单树+退出
	var menuTreeList = function(){
        var fragment = document.createDocumentFragment();
		var menuTreelistUl = $("#menuTreeList") ;
		var logOut = $('<li data-filtertext=""><a href="" data-ajax="false" style="color:red;" id="loginQuit">退出</a></li>') ;
		$.customAjax(''+config.basePath+config.menuTreeLists , '' ,function(flag , data){
			if('success' === flag){
				data.data.forEach(function(data){
					fragment.appendChild(renderMenuTree(data)) ;
				}) ;
				fragment.appendChild(logOut[0]) ;
				menuTreelistUl.append(fragment) ;
				menuTreelistUl.trigger("create").listview("refresh") ;
			}else{
				var dataError = "数据查询错误" ;
        		menuTreelistUl.append('<li data-filtertext=""><a href="" data-ajax="false">'+dataError+'</a></li>').trigger("create").listview("refresh") ;
			}
		}) ;
		//退出主页
		logOut.on('touchstart',logout) ;
	}
	
	//渲染菜单树
	var renderMenuTree = function(data){
		var menu = $('<li data-role="collapsible" data-enhanced="true" data-collapsed-icon="carat-d" data-expanded-icon="carat-u" data-iconpos="right" data-inset="false" class="ui-collapsible ui-collapsible-themed-content ui-collapsible-collapsed">'+
					'<h3 class="ui-collapsible-heading ui-collapsible-heading-collapsed">'+
						'<a href="#" class="ui-collapsible-heading-toggle ui-btn ui-btn-icon-right ui-btn-inherit ui-icon-carat-d">'+
							data.title+'<span class="ui-collapsible-heading-status">点击展开下拉框</span>'+
						'</a>'+
					'</h3>'+
					'<div class="ui-collapsible-content ui-body-inherit ui-collapsible-content-collapsed" aria-hidden="true">'+
						'<ul></ul>'+
					'</div>'+
				'</li>') ;
		var ul = menu.find('div ul') ;
		ul.append(menuLi(data.value)).listview() ;
		return menu[0] ;
	}
	
	//渲染功能权限li列表
	var menuLi = function(data){
		var fragment = document.createDocumentFragment();
		data.forEach(function(data){
			var li = $('<li data-filtertext=""><a href="#" data-ajax="false">'+data.title+'</a></li>') ;
			li.on("touchstart",function(){
				var path = (data.value).substring(1,(data.value).indexOf("."))
				requireModules(path) ;
			}) ;
			fragment.appendChild(li[0]) ;
		}) ;
		return fragment ;
	}
	
	//动态加载不同模块
	var requireModules = function(path){
		require.config({baseUrl: config.modulePath}) ;
		require([path], function (module){
	　　　　	console.log("the module test is >>>",module.init?module.init():module.list());
	　　	});
	}
	
	//最新报警
	var newestAlert = function(){
		var page = {sort:"alertdate",order:"desc",processflag:"0"};
		$.customAjax(''+config.basePath+config.newAlerts , page , function(flag,data){
			if('success' === flag){
				drawAlertTh(data) ;
			}else{
				var dataError = "数据查询错误" ;
        		var errorData = {rows:[{alertdate:dataError,zonename:dataError,devicename:dataError,alertmsg:dataError}],success:false,total:0} ;
        		drawAlertTh(errorData) ;
			}
		}) ;
	}
	
	//最新报警table渲染
	var drawAlertTh = function(data){
		var rows = data.rows ;
		var alertTbody = $("#alertTbody") ;
		alertTbody.empty() ;
		rows.forEach(function(row , index ){
				var tr = $("<tr></tr>") ;
				tr.append(["<td>"+row.alertdate+"</td>","<td>"+row.zonename+"</td>","<td>"+row.devicename+"</td>","<td>"+row.alertmsg+"</td>"].join("")) ;
				tr.appendTo(alertTbody) ;
		}) ;
	}
	
	//最新动态
	var newestAction = function(){
		var action = {state : "1", mobile : "0"} ;
		$.customAjax(''+config.basePath+config.newestActions ,action,function(flag,data){
			if('success' === flag){
				drawActionTh(data) ;
			}else{
				var dataError = "数据查询错误" ;
        		var errorData = {rows:[{title:dataError,updatetime:dataError}],success:false,total:0} ;
        		drawActionTh(errorData) ;
			}
		} ) ;
	} 
	
	//登录信息和最新动态table渲染
	var drawActionTh = function(data){
		//添加用户登录信息
		var welcomeIndex = $("#welcomeIndex") ;
		if(false !== data.success && data.user){
			welcomeIndex.html('欢迎<span id="loginUserName" style="color:red;">'+data.user.username+'</span>第<span id="loginUserCount" style="color:red;">'+data.user.logincount+'</span>次登录') ;
		}
	
		var rows = data.rows ;
		var actionTbody = $("#actionTbody") ;
		actionTbody.empty() ;
		for(var i = 0 ; i < rows.length ; i++){
			var tr = $("<tr></tr>") ;
			tr.append("<td>"+rows[i].title+"</td>").append("<td>"+$.parseVoidValue( rows[i].updatetime )+"</td>") ;
			tr.appendTo(actionTbody) ;
		}
	}
	
	//用气概况
	var gasProfile = function(){
		$.customAjax(''+config.basePath+config.gasProfiles ,{ year: "0" },function(flag,data){
			if('success' === flag){
				gasProfileTh(data) ;
			}else{
				var dataError = "数据查询错误" ;
        		var errorData = {rows:[{dataError:dataError}],success:'error',total:0} ;
         		gasProfileTh(errorData) ;
			}
		}) ;
	}
	
	//全年用气概况
	var annualGasProfile = function(){
		$.customAjax(''+config.basePath+config.annualGasProfiles ,{ year: "1" } , function(flag,data){
			if('success' === flag){
				annualGasProfileTh(data) ;
			}else{
				var dataError = "数据查询错误" ;
        		var errorData = {rows:[{dataError:dataError}],success:'error',total:0} ;
         		annualGasProfileTh(errorData) ;
			}
		} ) ;
	}
	
	//用气概况table渲染
	var gasProfileTh = function(data){
		if('error' === data.success){
			gasProfileTbody.append(tableTrRendering($("<td>"+data.rows[0].dataError+"</td>"))) ;
			return ;
		}
		var data0 = data.data[0] ;
		var data1 = data.data[1] ;
		var data2 = data.data[2] ;
		var data3 = data.data[3] ;
		var fragment = document.createDocumentFragment();
		//table渲染
		fragment.appendChild(tableTrRendering(tableRendering(nameOption[0],data0.accountamount,quantifierName[0],"3","3"))[0]) ;
		fragment.appendChild(tableTrRendering(tableRendering(nameOption[1],data0.stoppedamount,quantifierName[0],"3","3"))[0]) ;
		fragment.appendChild(tableTrRendering(tableRendering(nameOption[2],(data0.arrearmoney).toFixed(2),quantifierName[1],"3","3"))[0]) ;
		fragment.appendChild(tableTrRendering(tableRendering(nameOption[3],data0.arrearamount,quantifierName[0],"3"))[0]) ;
		fragment.appendChild(tableTrRendering(tableRendering(nameOption[4],(data0.rechargemoney).toFixed(2),quantifierName[1],"3","3"))[0]) ;
		fragment.appendChild(tableTrRendering(tableRendering(nameOption[5],data0.rechargetimes,quantifierName[2],"3"))[0]) ;
		fragment.appendChild(tableTrRendering(tableRendering(nameOption[6],(data0.chargemoney).toFixed(2),quantifierName[1],"3","3"))[0]) ;
		fragment.appendChild(tableTrRendering(tableRendering(nameOption[7],data0.chargetimes,quantifierName[2],"3","3"))[0]) ;
		
		fragment.appendChild(tableTrRendering(tableRendering(nameOption[8],data1.gasamount.toFixed(2),quantifierName[3])+
			proportion(data1.gasamount,data2.gasamount,ratioOption[0])+
			proportion(data1.gasamount,data3.gasamount,ratioOption[1]))[0]) ;
		fragment.appendChild(tableTrRendering(tableRendering(nameOption[9],data1.consumptionmoney.toFixed(2),quantifierName[1])+
			proportion(data1.consumptionmoney,data2.consumptionmoney,ratioOption[0])+
			proportion(data1.consumptionmoney,data3.consumptionmoney,ratioOption[1]))[0]) ;
		fragment.appendChild(tableTrRendering(tableRendering(nameOption[10],data1.rechargemoney.toFixed(2),quantifierName[1])+
			proportion(data1.rechargemoney,data2.rechargemoney,ratioOption[0])+
			proportion(data1.rechargemoney,data3.rechargemoney,ratioOption[1]))[0]) ;
		fragment.appendChild(tableTrRendering(tableRendering(nameOption[11],data1.chargemoney.toFixed(2),quantifierName[1])+
			proportion(data1.chargemoney,data2.chargemoney,ratioOption[0])+
			proportion(data1.chargemoney,data3.chargemoney,ratioOption[1]))[0]) ;
		gasProfileTbody.append(fragment) ;
		
	}
	
	//用气概况行渲染
	var tableTrRendering = function(data,td){
		var tr = $("<tr></tr>") ;
		return tr.append($(data)).append(td) ;
	}
	
	//用气概况数据渲染
	var tableRendering = function(name,data,quantifier,nameColspan,valueColspan){
		return "<td colspan='"+(nameColspan||"1")+"'>"+name+"</td><td colspan='"+(valueColspan||"1")+"' style='color:blue;'>"+data+"<span style='color:green;'>"+quantifier+"</span>" ;
	}
	
	//全年用气概况table渲染
	var annualGasProfileTh = function(data){
		if('error' === data.success){
			return ;
		}
		var data0 = data.data[0] ;
		var data1 = data.data[1] ;
		var fragment = document.createDocumentFragment();
		fragment.appendChild(tableTrRendering(tableRendering(nameOption[12],data0.gasamount.toFixed(2),quantifierName[3],"2","2")+
			proportion(data0.gasamount,data1.gasamount,ratioOption[0]))[0]) ;
		fragment.appendChild(tableTrRendering(tableRendering(nameOption[13],data0.consumptionmoney.toFixed(2),quantifierName[1],"2","2")+
			proportion(data0.consumptionmoney,data1.consumptionmoney,ratioOption[0]))[0]) ;
		fragment.appendChild(tableTrRendering(tableRendering(nameOption[14],data0.rechargemoney.toFixed(2),quantifierName[1],"2","2")+
			proportion(data0.rechargemoney,data1.rechargemoney,ratioOption[0]))[0]) ;
		fragment.appendChild(tableTrRendering(tableRendering(nameOption[15],data0.chargemoney.toFixed(2),quantifierName[1],"2","2")+
			proportion(data0.chargemoney,data1.chargemoney,ratioOption[0]))[0]) ;
		gasProfileTbody.append(fragment) ;
	}
	
	//判断环比和同比
	function proportion(oldData, newData,ratio){
		var data = ((oldData-newData)/newData*100).toFixed(2) ;
		if(0 == newData){
			return "<td style='min-width:2.15em;'>"+(ratio||ratioOption[0])+"</td>"+"<td style='color:red'>N/A</td>" ;
		}else if((data)<0){
			return "<td style='min-width:2.15em;'>"+(ratio||ratioOption[0])+"下降"+"</td>"+"<td style='color:green'>"+(-data)+"%" ;
		}else{
			return "<td style='min-width:2.15em;'>"+(ratio||ratioOption[0])+"增长"+"</td>"+"<td style='color:red'>"+(data+"%") ;
		}
	}
	
	//逐月收费额分析
	var draftedByMonth = function(){
		$.ajax({   
	        type : "post",   
	        url : config.basePath + config.draftedByMonths,   
	        async : true,
	        success : function(draftData) {
        		var title = '';
				var data = [];
				if(draftData.success && draftData.data.length > 0)
				{	
					data = draftData.data;
					title = data[12].nyear + '年逐月用气量';
				}
				require.config({ paths: {echarts: '/GIMS/js/echarts-2.2.2/dist'}}) ;
				require(
						['echarts',	'echarts/chart/bar','echarts/chart/line'],
						function (ec) {
							var myChart = ec.init(document.getElementById('chartContainerDraftedByMonth'));
							 var option = {
								  title : {text: title,x:'center'},
									legend: {x: 'center',y: '25',data:['上一年同期用气量', '本期用气量','同比增长','环比增长']},						    
									tooltip : {trigger: 'item',formatter: "{a} <br/>{b} : {c}",enterable: true},							
									toolbox: {show : true,feature : {magicType : {show: true, type: ['line', 'bar']},restore : {show: true}}},
									calculable : false,
									xAxis : [{type : 'category',axisLabel : {show:true,interval: 'auto',rotate: 0,textStyle: {fontSize: 15}},
								            data : ['1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月']}],
								    yAxis : [{type : 'value',name : '用气量',axisLabel : {formatter: '{value} m³'}},{type : 'value',name : '同/环比增长',
								            axisLabel : {formatter: '{value} %'}}],
									series : [{name:'上一年同期用气量',type:'bar',itemStyle: {normal: {label : {show: true}}},
								        data:(function(){var res = [];var len = 0;for(var i=0;i < 12 && i < data.length;i++ ){res.push(data[i].gasamount == null ? 0 : data[i].gasamount);}
													return res;})(),markLine : {data : [{type : 'average', name: '平均值'}]}},{name:'本期用气量',type:'bar',itemStyle: {normal: {label : {show: true}}},data:(function(){var res = [];var len = 0;
													for(var i=12;i < 24 && i < data.length;i++ ){res.push(data[i].gasamount == null ? 0 : data[i].gasamount);}return res;})(),
							            markLine : {data : [{type : 'average', name: '平均值'}]}},{name:'同比增长',type:'line',yAxisIndex: 1,itemStyle: {
							                normal: {label : {show: true}}},
								        data:(function(){var res = [];var len = 0;
													for(var i=12;i < 24 && i < data.length;i++ ){
														res.push((data[i-12].gasamount == null || data[i-12].gasamount == 0) ? undefined : ((data[i].gasamount - data[i-12].gasamount)*100/data[i-12].gasamount).toFixed(2));
													}
													return res;})()},
								        {name:'环比增长',type:'line',yAxisIndex: 1,itemStyle: {normal: {label : {show: true}}},
								        data:(function(){var res = [];var len = 0;
													for(var i=12;i < 24 && i < data.length;i++ ){
														res.push((data[i-1].gasamount == null || data[i-1].gasamount == 0) ? undefined : ((data[i].gasamount - data[i-1].gasamount)*100/data[i-1].gasamount).toFixed(2));
													}
													return res;
												})()}]
							};
			        
			                // 为echarts对象加载数据 
			                myChart.setOption(option); 
						}) ;
			} 				
		}, 'json');
	}
	
	//区域收费额分析
	var areaTollAnalyze = function(){
		$.ajax({   
		        type : "post",   
		        url : config.basePath+config.areaTollAnalyzes ,   
		        async : true,
		        success : function(areaData){
		        	var title = '区域用气量比例图';
		        	var data = [];
		        	if(areaData.success && areaData.data.length > 0){
		        		data = areaData.data;
		        		title = data[0].nyear + '年' + data[0].nmonth + '月区域用气量比例图';
		        	}
		        	require.config({ paths: {echarts: '/GIMS/js/echarts-2.2.2/dist'}}) ;
					require(
							['echarts',	'echarts/chart/pie'],
							function (ec) {
								var myChart = ec.init(document.getElementById('chartContainerAreaTollAnalyze'));
								//计算总用能
								var total = 0; 
								for(var i = 0; i < data.length; i++){
									total += (data[i].gasamount == null ? 0 : data[i].gasamount);
								}
								total = total.toFixed(2);					
								var option = {title : {text: title,x: 'center',textStyle : {fontSize : '18', color:'#000'}},
										tooltip : {trigger: 'item',formatter: "{a} <br/>{b} : {c} ({d}%)"},
										calculable : false,
										series : [{name: '用气量',type:'pie',radius : ['10%', '25%'],	itemStyle : {normal : {label : {show :true,formatter: '{b}\n{c}({d}%)',textStyle : {fontWeight : 'bold'}},
														labelLine : {show :true}}},
												data:(function(){var res = [];var len = 0;
													for(var i=0;i < data.length;i++ ){
														res.push({value: (data[i].gasamount == null ? 0 : data[i].gasamount),name: data[i].zonename});}
													return res;
												})()								
											}
										]
								};	
								myChart.setOption(option);   
								setTimeout(function (){
									var _ZR = myChart.getZrender();
									var TextShape = require('zrender/shape/Text');
									// 补充千层饼
									_ZR.addShape(new TextShape({
										style : {x : _ZR.getWidth() / 2,y : _ZR.getHeight() - 100,color: '#000',text: "总计:" + total + "m³",textFont:'normal 16px 微软雅黑',textAlign : 'center'}}));
									_ZR.refresh();
								}, 1000); 
							}) ;
		        }				
			},'json');
	}
	
	menuTreeList() ;
	newestAlert() ;
	newestAction() ;
	gasProfile() ;
	annualGasProfile() ;
	draftedByMonth() ;
	areaTollAnalyze() ;
	//最新报警定时刷新
	namespace.newsAlertInterval = setInterval(newestAlert,10000) ;

})( window.ChintPlugins )