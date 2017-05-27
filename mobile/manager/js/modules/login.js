!(function(){
	var label = $("#loginModal label") ;
	var strong = $("<strong style='color:#d9534f'></strong>") ;
    //添加登录事件
    $("#wapLogin").on("touchstart",function(){    	
	       	var formData = {} ;
	       	$("#loginModal input").each(function(){
	       		formData[this.name]=$("#"+this.name).val() ;
	       	}) ;
	       	$(this).customAjax(''+config.basePath+config.checkUser,formData,function(flag,data){
	       		if('success' === flag){
	       			if(true === data.success){
               			label.hide() ;
               			window.location.href = config.basePath+config.mainPage ;
               		}else if(false === data.success){
               			dataFalse(data) ;
               		}
	       		}else{
	       			dataFalse(data) ;
	       		}
	       	}) ;
     }) ;

     //添加重置事件
     $("#wapReset").on("touchstart",function(){
     	$("#loginModal input").each(function(){
     		$(this).val("");
     	}) ;
     	label.hide() ;
     }) ;

     //处理获取得到的登录信息不一致时
     var dataFalse = function(data){
       	strong.empty() ;
       	label.empty() ;
   		label.append(strong.append(data.msg)) ;
		label.show() ;
     }
})()