/***
 * @author:www.joshinrai.cn
 */
!(function( namespace ){
	//正泰主页
	var chintHomePage = $("#chintHomePage") ;
	
	//提示标签
	var checkLabel = $("#confirmLabel") ;
	var strong = $("<p></p>") ;
 	var confirmObj = {oldPassword:"请输入原密码",newPassword:"请输入新密码",confirmPassword:"请输入确认密码"} ;
 	
	var gasProfileTbody = $("#gasProfileTbody") ;
 	var ratioOption = ["环比","同比"] ;
 	var nameOption = ["正常用户","停户数","欠费总额","欠费户数","当月充值金额","当月充值人次","当月缴费金额","当月缴费人次","上月用气量","上月消费金额",
 		"上月充值金额","上月缴费金额","全年用气量","全年消费金额","全年充值金额","全年缴费金额"] ;
 	var quantifierName = ["户","元","人次","立方"] ;


	var wapIndex = Container.extends({
		//设置登录用户信息
		setUserInfo : function(){
			$.customAjax(['',config.basePath,config.getSessionStorage].join("") , {} , function(flag,data){
				if( "success" === flag )
					sessionStorage.userMsg = JSON.stringify(data) ;
			}) ;
		},
		//获取菜单树数据
		getMenuTreeData : function(fragment,menuTreelistUl,logOut,scope){
			$.customAjax(['',config.basePath,config.menuTreeLists].join("") , '' ,function(flag , data){
				if('success' === flag){
					data.data.forEach(function(data){
						fragment.appendChild(scope.renderMenuTree(data,scope)) ;
					}) ;
					fragment.appendChild(logOut[0]) ;
					menuTreelistUl.append(fragment) ;
					menuTreelistUl.trigger("create").listview("refresh") ;
				}else{
					var dataError = "数据查询错误" ;
	        		menuTreelistUl.append(['<li data-filtertext=""><a href="" data-ajax="false">',dataError,'</a></li>'].join("")).trigger("create").listview("refresh") ;
				}
			}) ;
		},
		//退出
	    logout : function(){
	    	$.customAjax(['',config.basePath,config.qiutLogout].join("") , '' , function(flag,data){
	    		window.location.href = config.basePath+config.loginPage ;
	    	}) ;
	    },
	    //修改密码
	    changePwdConfirm : function(scope,oldPwd,newPwd){
	    	$.customAjax(['',config.basePath,config.modifyPwd].join("") , {oldPwd:oldPwd,newPwd:newPwd} , function(flag,data){
    			if('success' === flag){
    				if(true === data.success){
             			scope.handle(data,"green") ;
             			scope.closeChangePassword() ;
             		}else if(false === data.success){
             			scope.handle(data,"red") ;
             			//closeChangePassword() ;
             		}
    			}else{
    				scope.handle(data,"red") ;
    			}
    		}) ;
    		checkLabel.hide() ;
	    },
	    //最新报警
		newestAlert : function(scope){
			var self = this == window ? scope : this;
			var page = {sort:"alertdate",order:"desc",processflag:"0"};
			$.customAjax(['',config.basePath,config.newAlerts].join("") , page , function(flag,data){
				if('success' === flag){
					self.drawAlertTh(data) ;
				}else{
					var dataError = "数据查询错误" ;
	        		var errorData = {rows:[{alertdate:dataError,zonename:dataError,devicename:dataError,alertmsg:dataError}],success:false,total:0} ;
	        		self.drawAlertTh(errorData) ;
				}
			}) ;
		},
	    //最新动态
		newestAction : function(){
			var self = this ;
			var action = {state : "1", mobile : "0"} ;
			$.customAjax(['',config.basePath,config.newestActions].join("") ,action,function(flag,data){
				if('success' === flag){
					self.drawActionTh(data) ;
				}else{
					var dataError = "数据查询错误" ;
	        		var errorData = {rows:[{title:dataError,updatetime:dataError}],success:false,total:0} ;
	        		self.drawActionTh(errorData) ;
				}
			} ) ;
		} ,
	    //用气概况
		gasProfile : function(){
			var self = this ;
			$.customAjax(['',config.basePath,config.gasProfiles].join("") ,{ year: "0" },function(flag,data){
				if('success' === flag){
					self.gasProfileTh(data,self) ;
				}else{
					var dataError = "数据查询错误" ;
	        		var errorData = {rows:[{dataError:dataError}],success:'error',total:0} ;
	         		self.gasProfileTh(errorData,self) ;
				}
			}) ;
		},
		//全年用气概况
		annualGasProfile : function(){
			var self = this ;
			$.customAjax(['',config.basePath,config.annualGasProfiles].join("") ,{ year: "1" } , function(flag,data){
				if('success' === flag){
					self.annualGasProfileTh(data,self) ;
				}else{
					var dataError = "数据查询错误" ;
	        		var errorData = {rows:[{dataError:dataError}],success:'error',total:0} ;
	         		self.annualGasProfileTh(errorData,self) ;
				}
			} ) ;
		},
		//渲染菜单树
		menuTreeList : function(){
			var self = this ;
	        var fragment = document.createDocumentFragment();
			var menuTreelistUl = $("#menuTreeList") ;
			var logOut = $('<li data-filtertext=""><a href="" data-ajax="false" style="color:red;" id="loginQuit">退出</a></li>') ;
			self.getMenuTreeData(fragment,menuTreelistUl,logOut,self) ;//获取菜单树数据
			self.returnHome() ;//返回主页
			//退出主页
			logOut.on('touchstart',self.logout) ;
		} ,
		//渲染菜单树内容
		renderMenuTree : function(data,scope){
			var menu = $(['<li data-role="collapsible" data-enhanced="true" data-collapsed-icon="carat-d" data-expanded-icon="carat-u" data-iconpos="right" data-inset="false" class="ui-collapsible ui-collapsible-themed-content ui-collapsible-collapsed">',
						'<h3 class="ui-collapsible-heading ui-collapsible-heading-collapsed">',
							'<a href="#" class="ui-collapsible-heading-toggle ui-btn ui-btn-icon-right ui-btn-inherit ui-icon-carat-d">',
								data.title,'<span class="ui-collapsible-heading-status">点击展开下拉框</span>',
							'</a>',
						'</h3>',
						'<div class="ui-collapsible-content ui-body-inherit ui-collapsible-content-collapsed" aria-hidden="true">',
							'<ul></ul>',
						'</div>',
					'</li>'].join("")) ;
			var ul = menu.find('div ul') ;
			ul.append(scope.menuLi(data.value,scope)).listview() ;
			return menu[0] ;
		},
		//渲染功能权限li列表
		menuLi : function(data,scope){
			var fragment = document.createDocumentFragment();
			data.forEach(function(data){
				var li = $(['<li data-filtertext=""><a href="#" data-ajax="false">',data.title,'</a></li>'].join("")) ;
				li.on("touchstart",function(){
					var path = (data.value).substring(1,(data.value).indexOf("."))
					scope.requireModules(path) ;
				}) ;
				fragment.appendChild(li[0]) ;
			}) ;
			return fragment ;
		},
		//动态加载不同模块
		requireModules : function(path){
			require.config({baseUrl: config.modulePath}) ;
			require([path], function (module){
		　　　　	console.log("the module test is >>>",module.init?module.init():module.list());
		　　	});
		},
		//返回主页
		returnHome : function(){
			chintHomePage.on('touchstart',function(){
				location.reload(true) ;
			}) ;
		},
	    //为修改密码标签绑定touch事件
	    pwdBindTouch : function(){
	    	$(".passwordButton").on("touchstart",function(){
	    		var changePassword = $("#change-password") ;
	    		changePassword.find("input").val("") ;
	    		checkLabel.hide() ;
	    		changePassword.panel().panel("open") ;
		    }) ;
	    },
	    //为修改密码button绑定事件
	    pwdChange : function(){
	    	var self = this ;
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
		    		self.changePwdConfirm(self,oldPwd,newPwd) ;//修改密码
		    	}
		    }) ;
	    },
	    //为重置按钮绑定事件
	    pwdReset : function(){
	    	$("#resetFix").on("touchstart",function(){
				$(this.parentElement).find("input").each(function(){
					$(this).val("") ;
				}) ;
				checkLabel.hide() ;
		    }) ;
	    },
	    //输入的修改密码和确认密码不一致时的处理函数
	    handle : function(data,color){
	    	strong.empty() ;
	       	checkLabel.empty() ;
	       	strong[0].style.color = color||'red' ;
	   		checkLabel.append(strong.append(data.msg)) ;
			checkLabel.show() ;
	    },
		//最新报警table渲染
		drawAlertTh : function(data){
			var rows = data.rows ;
			var alertTbody = $("#alertTbody") ;
			alertTbody.empty() ;
			rows.forEach(function(row , index ){
				var tr = $("<tr></tr>") ;
				tr.append(["<td>",row.alertdate,"</td>","<td>",row.zonename,"</td>","<td>",row.devicename,"</td>","<td>",row.alertmsg,"</td>"].join("")) ;
				tr.appendTo(alertTbody) ;
			}) ;
		},
	    //设置实时时间
	    setRealTime : function(){
	    	var self = this ;
	    	setInterval(function(){
		    	var date = new Date() ;
		    	$("#chintTime")[0].innerHTML = [date.getFullYear(),"年",self.getTime(date.getMonth(),1),"月",self.getTime(date.getDate()),"日",
		    	self.getTime(date.getHours()),"时",self.getTime(date.getMinutes()),"分",self.getTime(date.getSeconds()),"秒"].join("") ;
		    },100) ;
	    },
		//登录信息和最新动态table渲染
		drawActionTh : function(data){
			//添加用户登录信息
			var welcomeIndex = $("#welcomeIndex") ;
			if(false !== data.success && data.user){
				welcomeIndex.html(['欢迎<span id="loginUserName" style="color:red;">',data.user.username,'</span>第<span id="loginUserCount" style="color:red;">',data.user.logincount,'</span>次登录'].join("")) ;
			}
		
			var rows = data.rows ;
			var actionTbody = $("#actionTbody") ;
			actionTbody.empty() ;
			for(var i = 0 ; i < rows.length ; i++){
				var tr = $("<tr></tr>") ;
				tr.append(["<td>",rows[i].title,"</td>"].join("")).append(["<td>",$.parseVoidValue( rows[i].updatetime ),"</td>"].join("")) ;
				tr.appendTo(actionTbody) ;
			}
		},
		//用气概况table渲染
		gasProfileTh : function(data,scope){
			if('error' === data.success){
				gasProfileTbody.append(scope.tableTrRendering($(["<td>",data.rows[0].dataError,"</td>"].join("")))) ;
				return ;
			}
			var data0 = data.data[0] ;
			var data1 = data.data[1] ;
			var data2 = data.data[2] ;
			var data3 = data.data[3] ;
			var fragment = document.createDocumentFragment();
			//table渲染
			fragment.appendChild(
				scope.tableTrRendering(
					scope.tableRendering(nameOption[0],data0.accountamount,quantifierName[0],"3","3")
				)[0]
			) ;
			fragment.appendChild(
				scope.tableTrRendering(
					scope.tableRendering(nameOption[1],data0.stoppedamount,quantifierName[0],"3","3"))[0]) ;
			fragment.appendChild(
				scope.tableTrRendering(
					scope.tableRendering(nameOption[2],(data0.arrearmoney).toFixed(2),quantifierName[1],"3","3")
				)[0]) ;
			fragment.appendChild(
				scope.tableTrRendering(
					scope.tableRendering(nameOption[3],data0.arrearamount,quantifierName[0],"3")
				)[0]) ;
			fragment.appendChild(
				scope.tableTrRendering(
					scope.tableRendering(nameOption[4],(data0.rechargemoney).toFixed(2),quantifierName[1],"3","3")
				)[0]) ;
			fragment.appendChild(
				scope.tableTrRendering(
					scope.tableRendering(nameOption[5],data0.rechargetimes,quantifierName[2],"3")
				)[0]) ;
			fragment.appendChild(
				scope.tableTrRendering(
					scope.tableRendering(nameOption[6],(data0.chargemoney).toFixed(2),quantifierName[1],"3","3")
				)[0]) ;
			fragment.appendChild(
				scope.tableTrRendering(
					scope.tableRendering(nameOption[7],data0.chargetimes,quantifierName[2],"3","3")
				)[0]) ;
			
			fragment.appendChild(
				scope.tableTrRendering(
					[scope.tableRendering(nameOption[8],data1.gasamount.toFixed(2),quantifierName[3]),
					scope.proportion(data1.gasamount,data2.gasamount,ratioOption[0]),
					scope.proportion(data1.gasamount,data3.gasamount,ratioOption[1])].join("")
				)[0]) ;
			fragment.appendChild(
				scope.tableTrRendering(
					[scope.tableRendering(nameOption[9],data1.consumptionmoney.toFixed(2),quantifierName[1]),
					scope.proportion(data1.consumptionmoney,data2.consumptionmoney,ratioOption[0]),
					scope.proportion(data1.consumptionmoney,data3.consumptionmoney,ratioOption[1])].join("")
				)[0]) ;
			fragment.appendChild(
				scope.tableTrRendering(
					[scope.tableRendering(nameOption[10],data1.rechargemoney.toFixed(2),quantifierName[1]),
					scope.proportion(data1.rechargemoney,data2.rechargemoney,ratioOption[0]),
					scope.proportion(data1.rechargemoney,data3.rechargemoney,ratioOption[1])].join("")
				)[0]) ;
			fragment.appendChild(
				scope.tableTrRendering(
					[scope.tableRendering(nameOption[11],data1.chargemoney.toFixed(2),quantifierName[1]),
					scope.proportion(data1.chargemoney,data2.chargemoney,ratioOption[0]),
					scope.proportion(data1.chargemoney,data3.chargemoney,ratioOption[1])].join("")
				)[0]) ;
			gasProfileTbody.append(fragment) ;
		},
		
		//用气概况行渲染
		tableTrRendering : function(data,td){
			var tr = $("<tr></tr>") ;
			return tr.append($(data)).append(td) ;
		},
		
		//用气概况数据渲染
		tableRendering : function(name,data,quantifier,nameColspan,valueColspan){
			return ["<td colspan='",(nameColspan||"1"),"'>",name,"</td><td colspan='",(valueColspan||"1"),
					"' style='color:blue;'>",data,"<span style='color:green;'>",quantifier,"</span>"].join("") ;
		},
		
		//全年用气概况table渲染
		annualGasProfileTh : function(data,scope){
			if('error' === data.success){
				return ;
			}
			var data0 = data.data[0] ;
			var data1 = data.data[1] ;
			var fragment = document.createDocumentFragment();
			fragment.appendChild(
				scope.tableTrRendering(scope.tableRendering(nameOption[12],data0.gasamount.toFixed(2),quantifierName[3],"2","2")+
				scope.proportion(data0.gasamount,data1.gasamount,ratioOption[0]))[0]
			) ;
			fragment.appendChild(
				scope.tableTrRendering(scope.tableRendering(nameOption[13],data0.consumptionmoney.toFixed(2),quantifierName[1],"2","2")+
				scope.proportion(data0.consumptionmoney,data1.consumptionmoney,ratioOption[0]))[0]
			) ;
			fragment.appendChild(
				scope.tableTrRendering(scope.tableRendering(nameOption[14],data0.rechargemoney.toFixed(2),quantifierName[1],"2","2")+
				scope.proportion(data0.rechargemoney,data1.rechargemoney,ratioOption[0]))[0]
			) ;
			fragment.appendChild(
				scope.tableTrRendering(scope.tableRendering(nameOption[15],data0.chargemoney.toFixed(2),quantifierName[1],"2","2")+
				scope.proportion(data0.chargemoney,data1.chargemoney,ratioOption[0]))[0]
			) ;
			gasProfileTbody.append(fragment) ;
		},
		//判断环比和同比
		proportion : function(oldData, newData,ratio){
			var data = ((oldData-newData)/newData*100).toFixed(2) ;
			if(0 == newData){
				return ["<td style='min-width:2.15em;'>",(ratio||ratioOption[0]),"</td>","<td style='color:red'>N/A</td>"].join("") ;
			}else if((data)<0){
				return ["<td style='min-width:2.15em;'>",(ratio||ratioOption[0]),"下降","</td>","<td style='color:green'>",(-data),"%"].join("") ;
			}else{
				return ["<td style='min-width:2.15em;'>",(ratio||ratioOption[0]),"增长","</td>","<td style='color:red'>",(data,"%")].join("") ;
			}
		},
		//逐月收费额分析
		draftedByMonth : function(){
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
		},
	
		//区域收费额分析
		areaTollAnalyze : function(){
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
		},
	    //1s后关闭修改密码panel
	    closeChangePassword : function(){
	    	setTimeout( function(){$("#change-password").panel().panel("close")} , 1000) ;
	    },
	    //获取时间
	    getTime : function(time){
	    	if(time<10){
	    		return ["0",time].join("") ;
	    	}else{
	    		return ["",time].join("") ;
	    	}
	    },
	    //初始化修改密码
	    changePwdInit : function(){
	    	var self = this ;
	    	self.pwdBindTouch() ;//为修改密码标签绑定事件
	    	self.pwdChange() ;//为确认修改密码绑定事件
	    	self.pwdReset() ;//为重置按钮绑定事件
	    },
		init : function(){
			var self = this ;
			self.setRealTime() ;//设置实时时间
			self.setUserInfo() ;//设置登录用户信息
			self.menuTreeList() ;//渲染菜单树
			self.changePwdInit() ;//修改密码
			self.newestAlert() ;//最新报警
			//最新报警定时刷新
			namespace.newsAlertInterval = setInterval(function(){self.newestAlert(self)},10000) ;
			self.newestAction() ;//最新动态
			self.gasProfile() ;//获取用气概况信息
			self.annualGasProfile() ;//获取全年用气概况信息
			self.draftedByMonth() ;//逐月收费额分析
			self.areaTollAnalyze() ;//区域收费额分析
		}
	}) ;
	new wapIndex() ;

})( window.chintPlugins )