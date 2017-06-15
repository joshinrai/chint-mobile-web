!(function(){
	var test = Container.extends({
		//为菜单标签绑定事件
		menuTouch : function(){
			$("body .menu_icon img").on("touchstart",function(){
				console.log("this is menu ...") ;
			}) ;
		},
		init : function(){
			var self = this ;
			self.menuTouch() ;
			var $submenu = $('.submenu');
			var $mainmenu = $('.mainmenu');
			$submenu.hide();
			$submenu.first().delay(400).slideDown(700);
			$submenu.on('click','li', function() {
				$submenu.siblings().find('li').removeClass('chosen');
				$(this).addClass('chosen');
			});
			$mainmenu.on('click', 'li', function() {
				$(this).next('.submenu').slideToggle().siblings('.submenu').slideUp();
			});
			$mainmenu.children('li:last-child').on('click', function() {
				$mainmenu.fadeOut().delay(500);
			});
			$("body .menu_icon img").on("click" , function(){
				$mainmenu.fadeIn().delay(500) ;
				console.log("this is ") ;
			}) ;
			console.log("this is test.js ...") ;
		}
	}) ;
	new test() ;
})() ;