/***
 * @author:www.joshinrai.cn
 */
!(function(){
    var login = Container.extends({
        staticLable : {
            label : $("#loginModal label") ,
            strong : $("<strong style='color:#d9534f'></strong>")
        },
        //检查登录人员	
        checkUser : function(scope,params){
            console.log("this is login test ...") ;
            $.customAjax(''+config.basePath+config.checkUser,params,function(flag,data){
              if('success' === flag){
                  if(true === data.success){
                      scope.staticLable.label.hide() ;
                      window.location.href = config.basePath+config.mainPage ;
                  }else if(false === data.success){
                   	  scope.dataFalse(data,scope) ;
                  }
              }else{
                  scope.dataFalse(data,scope) ;
              }
            }) ;
        },
        //为登录按钮绑定事件
        wapLogin : function(){
            var self = this ;
            var formData = {} ;
            $("#waplogin").on("touchstart",function(){      
                $(".cont_form_login input").each(function(){
                    formData[this.name] = $("[name='"+this.name+"']").val() ;
                }) ;
                self.checkUser(self , formData) ;
            }) ;
        },
        //为重置按钮绑定事件
        wapReset : function(){
            var self = this ;
            $("#wapReset").on("touchstart",function(){
                $("#loginModal input").each(function(){
                  $(this).val("");
                }) ;
                self.staticLable.label.hide() ;
            }) ;
        },
        //登录信息错误的处理函数
        dataFalse : function(data,scope){
            var strong = scope.staticLable.strong ;
            var label = scope.staticLable.label ;
            strong.empty() ;
            label.empty() ;
            label.append(strong.append(data.msg)) ;
            label.show() ;
        },
        //为初始页中的"登录"按钮绑定事件
        loginInit : function(){
            $("#login_init").on("touchstart",function(){
                document.querySelector('.cont_forms').className = "cont_forms cont_forms_active_login";  
                document.querySelector('.cont_form_login').style.display = "block";             

                setTimeout(function(){  document.querySelector('.cont_form_login').style.opacity = "1"; },200);
            }) ;
        },
        //返回登录起始页
        loginMain : function(){
            $("#ocultarLogin").on("touchstart",function(){
                document.querySelector('.cont_forms').className = "cont_forms";              
                document.querySelector('.cont_form_login').style.opacity = "0"; 

                setTimeout(function(){
                    document.querySelector('.cont_form_login').style.display = "none";
                },500);
            }) ;            
        },
        init : function(){
            var self = this ;
            self.wapLogin() ;
            self.wapReset() ;
            self.loginInit() ;//初始界面
            self.loginMain() ;//登录界面
        }
    }) ;
    new login() ;
})()