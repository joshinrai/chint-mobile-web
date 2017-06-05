/***
 *  客户端工具类
 * @author : joshinrai
 */

!(function($){
				/********************************添加类方法*******************************/
				$.fn.extend({
						test : function(){
								console.log("this is test ...") ;
						}
				}) ;
				/********************************添加静态方法*******************************/
				//封装ajax请求
				$.customAjax = function(url,params,callback,async,type,datatype){
						loading.show() ;
						$.ajax({
						          type : type||"post",
						          url : url,
						          data : params ,
						          dataType : datatype||"json",
						          async : async||true,
						          success : function(data) {
						          			loading.hide() ;
						          			callback('success',data) ;
						          },
						          error : function(XMLHttpRequest, textStatus, errorThrown) {
						          			callback('请求失败',XMLHttpRequest.responseText) ;
						          }
						});
				}
				
				//提示标签
				$.hintLabel = function(label , msg , color){
							label[0].innerHTML = msg  ;
							label[0].style.color = color||"red" ;
							label.show() ;
				}
				//空值转换
				$.parseVoidValue = function(value , defaultValue){
						value = value ? value : (value === 0 ?  value : (defaultValue || "")) ;
						return value ;
				}
				//转换1、2之间的双值
				$.parseValue	= function( value , firstValue , secondValue ){
						value = (1 == value) ? firstValue : ((2 == value) ? secondValue : "") ;
						return value ;
				} ;
				//双值转换，转换1,、0
				$.parseDoubleValue = function( value , firstValue , zeroValue ){
						value = (1 == value) ? firstValue : ((0 == value) ? zeroValue : "") ;
						return value ;
				}
				//双值转换，转换1、-1
				$.parseMinusPlusDouble = function( value , plusValue , minusValue ){
						value = (1 == value) ? plusValue : ((0 == value) ? minusValue : "") ;
						return value ;
				}
				//转换-1、0、1的三值
				$.parseTribleValue = function( value , firstValue , zeroValue , negativeValue ){
						value = (1 == value) ? firstValue : ((0 == value) ? zeroValue : ((-1 == value) ? negativeValue : "")) ;
						return value ;
				}
				//转换1、2、-1的三值
				$.parseTribleWithT = function( value , firstValue , towVal , negativeValue ){
						value = (1 == value) ? firstValue : ((2 == value) ? towVal : ((-1 == value) ? negativeValue : "")) ;
						return value ;
				}
				//从textarea中获取值设置params
				$.setParamsFormTextarea = function(params , panel){
						var descript = panel.find("textarea") ;
						params[descript[0].name] = descript[0].value ;
						return params ;
				}
				//input只能输入整数
				$.numberInputs = function( inputs ){
						inputs.on( "change" , function(){
										var _value = this.value ;
										//if( isNaN(_value) ) $.fadeInPlugin("只能输入数字") ;
										if(/^d*(?:.d{0,2})?$/.test(this.value))  console.log(" this is number test ...") ;
										_value = _value.replace(/[^\d]/gi,'') ;
										this.value = _value + ".00" ;
							}) ;
				}
				//只能输入小数点后两位的浮点数
				$.floatNumberInput = function( inputs ){
						inputs.on( "change" , function(){
								this.value = this.value ? parseFloat(this.value).toFixed(2) : "" ;
						}) ;
						inputs.on( "keydown" , function(event){
								var inputNum = event.keyCode ;
								if((inputNum >95 && inputNum < 106 ) || ( inputNum > 47 && inputNum < 58 ) || inputNum == 110 || inputNum == 190 || inputNum ==8){
										if(this.value.includes(".") && (inputNum == 110 || inputNum == 190) ) return false ;
										return true ;
								}else{
										return false ;
								}
						}) ;
				}
				//在两个input中，只能选择一个进行输入
				$.choseOnlyOne = function( firstInput , secondInput ){
						firstInput.on( "change" , function(){
								var selfValue = this.value ;
								if( selfValue.length > 0 ){
										secondInput.attr("readonly" , true ) ;
								}else{
										secondInput.attr("readonly" , false ) ;
								}
						}) ;
						secondInput.on( "change" , function(){
								var selfValue = this.value ;
								if( selfValue.length > 0 ){
										firstInput.attr("readonly" , true ) ;
								}else{
										firstInput.attr("readonly" , false ) ;
								}
						}) ;
				} ;
				//动态创建script标签
				$.addScript = function( fileUrl, promise) {  
				    if ( fileUrl != null ){  
				        var oBody = document.getElementsByTagName('BODY').item(0);  
				        var oScript = document.createElement( "script" );  
				        oScript.type = "text/javascript";  
				        oScript.src = fileUrl;  
				        oBody.appendChild( oScript );
				    }  
				}
				//获取百度地图，并将地图放入chintMain容器内
				$.getBMapInfo = function( container , mapHeight ){		//chintBodyMain
						if( !mapHeight ){
									mapHeight = document.body.clientHeight-165 ;
									mapHeight = (mapHeight < 520 ) ? 520 : mapHeight ; //设置map高度，不是很合理，暂定高度
						}
						container.append($("<div id='BMapContainner' style='height:"+mapHeight+"px;' />")).trigger("create") ;
						var map = new BMap.Map("BMapContainner");  //创建地图实例
						var point = new BMap.Point( config.longitude , config.latitude ); //创建点坐标  
						map.centerAndZoom(point,16);          //初始化地图，设置中心点坐标和地图级别  
						map.enableScrollWheelZoom();        //启用滚轮放大缩小地图  
				        //向地图中添加缩放控件
					    var ctrl_nav = new BMap.NavigationControl({anchor:BMAP_ANCHOR_TOP_LEFT,type:BMAP_NAVIGATION_CONTROL_LARGE});
					    map.addControl(ctrl_nav);
					    window.chintMap = map ;		//将map对象放入全局变量中
				}
				//百度地图轮询获取BMap
				$.pollingToGetMap = function(callback){
						var interval = null ;
						var pollingFun = function(){
									if("undefined" !== (typeof BMap)){
												callback() ;
												clearInterval(interval) ;
									}
						}
						try{
									interval = setInterval( pollingFun , 500 ) ; 
						}catch(e){
									console.log("the exception is : " , e) ;// 
						}
				}
				//使用轮询解决获取baidumap的问题
				$.getBMap = function( container , height ){
						$.addScript( config.baiduMap ) ;  // 动态添加baidu Map脚本
						var chintGis = function(){
								    $.getBMapInfo( container , height ) ;
						} ;
						$.pollingToGetMap( chintGis ) ;
				}
				//查询添加panel中的地图位置
				$.retrieveArea = function(){
							var area = modifyInner.find(".retrieveInput").val() ;
							var local = new BMap.LocalSearch( chintMap , {
										renderOptions:{map: chintMap }
							});
							local.search( area );
				}
				//添加地图点击事件----向地图添加标注----添加panel
				$.clickMapToAddMark = function(){
							chintMap.addEventListener( 'click' , function( e ){
										modifyInner.find("#longitude").val( e.point.lng ) ;
										modifyInner.find("#latitude").val( e.point.lat ) ;
										var point = new BMap.Point( e.point.lng , e.point.lat ) ;
										var marker = new BMap.Marker( point ) ;
										chintMap.clearOverlays() ;
										chintMap.addOverlay( marker ) ;
							}) ;
				}
				//消息提示框
				$.fadeInPlugin = function(message){
						$.messager.anim('fade', 2000);
						$.messager.show(0, message);
				}
				//清空过滤查询和新增innerPanel内容
				$.emptyInnerPanel = function(){
						clearInterval( chintPlugins.newsAlertInterval ) ;
						chintBodyMain.empty() ;
						filterInner.empty() ;
						modifyInner.empty() ;
				}
				//查询内容参数
				$.queryContext = function(filterInner , filterPanel , tableCallBack , arguments , self){
						var params = {} ;
						params.rows = 10000 ;
						var radioPlugin = chintPlugins.radioPlugin ;
						var chintInput = filterInner.find('.chintInput') ;
						chintInput.each(function(index , data){
								params[data.name] = data.value ;
						}) ;
						var radioChecked = filterInner.find('.radioChecked') ;
						radioChecked.each(function( index , data ){
									var name = data.name.toString() ;
									name = name.substr( 0 , name.lastIndexOf("-")).replace("radio-choice-" , "") ;
									params[name] = radioPlugin.getValueFromEle(data) ;
						}) ;
						for(var argument in arguments){
								params[argument] = arguments[argument] ;
						}
						tableCallBack(params,self) ;
						filterPanel.panel().panel("close") ;
				}
				//点击添加标签
				$.clickModifyLabel = function(){
						modifyInner.find('label')[0].textContent = '添加' ;
						modifyInner.find(".hintLabel").hide() ;
						modifyInner.find(".chintInput").val("") ;
						modifyInner.find("button").attr("id" , "") ;
						modifyPanel.panel().panel("open");
				}
				//修改按钮点击事件
				$.modifyEvent = function(self){
						var radioPlugin = chintPlugins.radioPlugin ;
						var userData = JSON.parse(self.parentNode.parentNode.attributes.userData.value) ;
						modifyPanel.find("label")[0].textContent = "修改" ;
						var inputs = modifyPanel.find('input') ;
						inputs.each(function(data,index){
								this.value = userData.data[this.name] ;
						}) ;
						var textarea = modifyPanel.find('textarea') ;
						textarea[0] = userData.data.description ;
						var button = modifyInner.find("button") ;
						button.attr("id" , userData.data.id) ;
						modifyInner.find(".hintLabel").hide() ;
						modifyPanel.panel().panel("open");
				}
				//渲染删除弹出框
				$.renderPopup = function( popup , options){
						popup.find('h1')[0].textContent = options.h1 ;
						popup.find('h3')[0].textContent = options.h3 ;
						popup.find('a')[0].textContent = options.a0 ;
						popup.find('a')[1].textContent = options.a1 ;
						return popup ;
				}
				//删除选中数据
				$.deleteSelectedData = function( self , url , callback ){
						var options = {h1:'删除',h3:'确定要删除本条记录?',a0:'删除',a1:'取消'} ;
						var popup = $.renderPopup( $('#modifyPopup') , options ) ;
						var tr = $(self).parent().parent() ;
						var id  = JSON.parse(tr.attr("userData")).data.id ;
						var popupA = $(popup.find('a')[0]) ;
						popupA.attr('deleteparam',JSON.stringify({ id : id })) ;
						popupA.on('click',function(){
								var param = JSON.parse($(this).attr("deleteparam")) ;
								var id = [] ;
								id.push(param.id) ;
								//删除操作需要检查当前记录是否存在主外键约束...
								$.customAjax(''+url , {id : id.toString() } , function(flag , data){
											callback({rows:1000}) ;
											console.log("删除信息:" , data.msg) ;
								}) ;
						}) ;
				}
})(jQuery)