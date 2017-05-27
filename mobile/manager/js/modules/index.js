	//公用dom对象
	(function(){
		var chintBodyMain = $('#chintBodyMain') ;
		var modifyPanel = $("<div id='modifyPanel' data-role='panel' class='jqm-nav-panel ui-panel ui-panel-position-right"+
												" ui-panel-display-overlay ui-panel-closed ui-body-a ui-panel-animate' data-position='right' data-display='overlay' "+
												"data-theme='a' style='text-align:center;background-color: whitesmoke;'>"+
														"<div class='ui-panel-inner'>"+
														"</div>"+
											"</div>") ;
														
		var filterPanel = $("<div id='filterPanel' data-role='panel' class='jqm-nav-panel ui-panel ui-panel-position-right"+
						" ui-panel-display-overlay ui-panel-closed ui-body-a ui-panel-animate' data-position='right' data-display='overlay' "+
						"data-theme='a' style='text-align:center;background-color: whitesmoke;'>"+
													"<div class='ui-panel-inner'>"+
													"</div>"+
										"</div>") ;
						
		var popup = $( '<div data-role="popup" id="modifyPopup" data-overlay-theme="b" data-theme="b" data-dismissible="false" style="max-width:400px;">' +
						  					'<div data-role="header" data-theme="a">' +
						  								'<h1>title</h1>' +
						  					'</div>' +
						  					'<div role="main" class="ui-content">' +
						  								'<h3 class="ui-title">content</h3>' +
						  								'<a href="#" class="ui-btn ui-corner-all ui-shadow ui-btn-inline ui-btn-b" data-rel="back" data-transition="flow">ready</a>' +
						 								'<a href="#" class="ui-btn ui-corner-all ui-shadow ui-btn-inline ui-btn-b" data-rel="back">reset</a>' +
						  					'</div>' +
						  			'</div>' ) ;
		
		chintBodyMain.parent().append(popup[0]).prepend(modifyPanel[0]).prepend(filterPanel[0]).trigger('create') ;
	})()