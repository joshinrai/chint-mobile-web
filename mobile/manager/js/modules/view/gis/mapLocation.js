define(function (){
　　　　var mapLocation = function (){
						//初始化chintBodyMain内容
						var init = function(){
								$.emptyInnerPanel() ;		//清空chintBodyMain中的内容
								$.getBMap( chintBodyMain ) ;		//获取BMap
								getZoneTree() ; 		//获取区域数据
						}
						
						//获取区域数据信息，根据区域数据信息添加标注   		先使用高阶函数解决问题，这里应该使用promise更好?
						var getZoneTree = function(){
								$(this).customAjax(''+config.basePath+config.baseTblZoneTree , { showEmptyNode : "0" , keyId : "" } , function( flag , data ){
											var getMarkers = function(){
														data.forEach(function(data , index){
																	var point = new BMap.Point( data.attributes.Longitude , data.attributes.Latitude ) ;
																	//营业厅
																	var markerIcon = new BMap.Icon(''+config.imgPath+config.organon, new BMap.Size(32, 32), {   
																            offset: new BMap.Size(16, 32), // 指定定位位置  
																            imageOffset: new BMap.Size(0, 0) // 设置图片偏移  
															        }); 
																	var marker = new BMap.Marker(point , {icon: markerIcon } );        // 创建标注
																	marker.enableDragging();			//标注可拖动，经测试手机web端貌似不可拖动
																	marker.setAnimation(BMAP_ANIMATION_BOUNCE); //据说添加这句代码可以使标注动起来
																	//设置带文字标签  
															        var label = new BMap.Label( data.text , { offset: new BMap.Size( 30 , 5 ) }) ;
															        label.setStyle({color : "red",fontSize : "12px",height : "20px",lineHeight : "20px",fontFamily:"微软雅黑"});
															        marker.setLabel(label);
																	try{
																			chintMap.addOverlay(marker);                     // 将标注添加到地图中
																			//var infoWindow = new BMap.InfoWindow( "测试区域" );  //标注点详细信息
																			//var TileLayerOptions = BMap.TileLayerOptions({ zIndex : 1000 }) ;		//添加图层
																			marker.addEventListener("click", function(){
																						//this.openInfoWindow(infoWindow);  //点击标注显示标注点的详细信息
																						console.log("this is a test ..." , data.text ) ;
																						return false ;
																			});
																			//手机端貌似不可用
																			marker.addEventListener("dragend", function (e) {  
																	            		console.log("当前位置:" + e.point.lng + "," + e.point.lat); //表示经纬度  
																	        });
																	}catch(e){
																			console.log("chintMap 获取在地图渲染之后,ajax异步问题...") ;//可能会出现的问题
																	}
														}) ;
											}
											$.pollingToGetMap( getMarkers ) ;
								})
						}
						
						init() ;
　　　　};
　　　　return {
　　　　　　	init: mapLocation
　　　　};
});