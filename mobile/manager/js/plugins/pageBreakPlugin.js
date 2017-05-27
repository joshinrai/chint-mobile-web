(function(namespace){
	
		  function pageBreakPlugin() { } 
		  pageBreakPlugin.prototype = {
		  		 /***
		  		  *		node  		：   span节点，用来接收分页组件显示
		  		  *		data   		：   所有数据信息，使用sessionStorage缓存
		  		  *		options	：	  参数列表，主要用来设置pageCount设置一页显示多少条数据
		  		  */
			      init: function(node,data,options) {
			      	  this.node = node ;
			          this.data = data;
			          //使用sessionStorage存储获取得到的系统参数列表数据
					  sessionStorage.sessionData = JSON.stringify(data) ;
			          this.options = options||{};
			          return this ;
			      },
			      load : function(){
			      
			      },
			      render : function(callback){
			      		var self = this ;
			      		self.callback = callback ;
			      		var data = self.data ;
			      		
			      		//*****************初始化table数据******************
						var initData = {} ;
						initData.rows = data.rows.slice(0,self.options.pageCount) ;
						initData.total = data.total ;
						callback(initData) ;//用于渲染界面中的table，视具体情况获取不同的方法
						//************************************************
			      		var fragment = '' ;
						var span = self.node ;
						span.empty() ;
						var lastPageNo = Math.ceil(data.total/self.options.pageCount) ;
						lastPageNo = (lastPageNo < 1000) ? lastPageNo : 1000 ; //最多显示1000页
						
						//上一页
						fragment += ('<a class="pagingUpDown"><strong>< 上一页</strong></a>') ;
						for(var i = 0 ; i < Math.ceil(data.total/self.options.pageCount) ; i++){
							if(0 == i){
								fragment += ('<a class="pagingPitched"><strong>'+(i+1)+'</strong></a>') ;
							}else if(i<3){
								fragment += ('<a class="pagingCommon"><strong>'+(i+1)+'</strong></a>') ;
							}else{
								if(3 == Math.ceil(data.total/self.options.pageCount)){
									fragment += ('<a class="pagingCommon"><strong>'+Math.ceil(data.total/self.options.pageCount)+'</strong></a>') ;
									break ;
								}
								//省略号
								if(4 != Math.ceil(data.total/self.options.pageCount)) fragment += ('<b class="pagingApostrophe"><strong>...</strong></b>') ;
								//最后一页
								fragment += ('<a class="pagingCommon"><strong>'+lastPageNo+'</strong></a>') ;
								break ;
							}
						}
						//下一页
						fragment +=('<a class="pagingUpDown"><strong>下一页 ></strong></a>') ;
						span.append(fragment).trigger('create') ;
						
						span.find('a').on('click',function(){
							var self = this ;
							ChintPlugins.pageBreakPlugin.aClick(self) ;
						}) ;
			      },
			      
			      //点击a标签
			      aClick : function(self){
			      		var innerText = JSON.stringify(self.children[0].textContent).replace(/\"/g,"") ;//获取按标签中的内容
						//获取当前选中页
						var pagePitched = $(self).parent().find('.pagingPitched') ;
						
						//最后一页
						var lastPage =  $(self).parent().find('.pagingUpDown').prev()[0].childNodes[0].innerHTML ;
						
						//---------------------
						this.dealFunction(innerText,pagePitched,self,lastPage) ;
			      },
			      
			      //点击处理函数(渲染效果)
				  dealFunction : function(innerText,pagePitched,selfElement,lastPage){
				  		var self = this ;
						var spanPage = pagePitched[0].childNodes[0].innerHTML ;
						var doublePrev = pagePitched.prev().prev() ;
						var prev = pagePitched.prev() ;
						var next = pagePitched.next() ;
						var doubleNext = pagePitched.next().next() ;
						var apostrophe= $('<b class="pagingApostrophe"><strong>...</strong></b>') ;
						//添加分页判定条件
						if(-1 != innerText.indexOf('<')){
							var element = $('<a class="pagingCommon"><strong>'+(parseInt(spanPage)-2)+'</strong></a>') ;
							element.on('click',function(){
										var self = this ;
										ChintPlugins.pageBreakPlugin.aClick(self) ;
							}) ;
							self.pagingLogic(pagePitched,doublePrev,prev,next,doubleNext,spanPage,lastPage,apostrophe,element,false) ;
							if(1 != spanPage){
								self.handleFunciotn(pagePitched,prev) ;
								self.dataInteraction(spanPage-1) ;
							}
						}else if(-1 != innerText.indexOf('>')){
							var element = $('<a class="pagingCommon"><strong>'+(parseInt(spanPage)+2)+'</strong></a>') ;
							element.on('click',function(){
										var self = this ;
										ChintPlugins.pageBreakPlugin.aClick(self) ;
							}) ;
							self.pagingLogic(pagePitched,doublePrev,prev,next,doubleNext,spanPage,lastPage,apostrophe,element,true) ;
							if(spanPage != lastPage){
								self.handleFunciotn(pagePitched,next) ;
								self.dataInteraction(parseInt(spanPage)+1) ;
							}
						}else if(pagePitched[0] != selfElement){
							self.detailPageLogic(selfElement,lastPage,apostrophe) ;
							self.handleFunciotn(pagePitched,$(selfElement)) ;
							self.dataInteraction(parseInt(innerText)) ;
						}
				  },
					
					//设定点击效果处理函数
					handleFunciotn : function(pitchedElement , changingElement){
							pitchedElement.removeClass('pagingPitched') ;
							changingElement.removeClass('pagingCommon') ;
							pitchedElement.addClass('pagingCommon') ;
							changingElement.addClass('pagingPitched') ;
					},
					
					//数据交互函数
					dataInteraction : function(page) {
						var self = this ;
						var data = {} ;
						var jsonObj = JSON.parse(sessionStorage.sessionData) ;
						data.rows = jsonObj.rows.slice((page-1)*self.options.pageCount,page*self.options.pageCount) ;
						data.total = jsonObj.total ;
						self.callback(data) ;
					},
					
					//点击上/下一页时分页节点显示逻辑
					pagingLogic : function(pagePitched,doublePrev,prev,next,doubleNext,spanPage,lastPage,apostrophe,element,bool){
						//第二页到倒数第二页之间的节点处理逻辑
						if(parseInt(spanPage)>2 && parseInt(spanPage)<(lastPage-1)){
							bool ? prev.remove() : next.remove() ;
							if(bool ? doublePrev[0] && "..." != doublePrev[0].childNodes[0].innerHTML : doubleNext[0] && "..." != doubleNext[0].childNodes[0].innerHTML){
								bool ? pagePitched.before(apostrophe) : pagePitched.after(apostrophe) ;
							}
						}
						//点击上/下一页时分页节点的处理逻辑
						if(bool ? doubleNext[0] && "..." == doubleNext[0].childNodes[0].innerHTML : doublePrev[0] && "..." == doublePrev[0].childNodes[0].innerHTML){
							if(bool ? lastPage == (parseInt(spanPage)+3) : 1 == (parseInt(spanPage)-3)){
								bool ? doubleNext.remove() : doublePrev.remove() ;
							}
							bool ? next.after(element) : prev.before(element) ;
						}
					},
					
					//点击具体页数的节点处理逻辑
					detailPageLogic : function(selfElement,lastPage,apostrophe){
							var doublePrev = $(selfElement).prev().prev() ;
							var doubleNext = $(selfElement).next().next() ;
							var prevInnerText = $(selfElement).prev().children()[0].textContent ;
							var selfInnerText = $(selfElement).children()[0].textContent ;
							var nextInnerText = $(selfElement).next().children()[0].textContent ;
							if('...' == prevInnerText){
									var newPrev = $('<a class="pagingCommon"><strong>'+(selfInnerText-1)+'</strong></a>') ;
									newPrev.on('click',function(){
											var self = this ;
											ChintPlugins.pageBreakPlugin.aClick(self) ;
									}) ;
									if(selfInnerText == (lastPage-2) ) $(selfElement).before(newPrev[0]) ;
									if(selfInnerText == (lastPage-3)) {
											doubleNext.remove() ;
											$(selfElement).next().after(apostrophe) ;
											$(selfElement).before(newPrev[0]) ;
									}
									if(selfInnerText > 3 && selfInnerText < (lastPage-3) ){
											doubleNext.remove() ;
											$(selfElement).before(newPrev[0]) ;
									}
									if(selfInnerText == 3 ){
											doubleNext.remove() ;
											$(selfElement).prev().remove() ;
											$(selfElement).before(newPrev[0]) ;
									}
							}
							if('...' == nextInnerText){
									var newNext = $('<a class="pagingCommon"><strong>'+(parseInt(selfInnerText)+1)+'</strong></a>') ;
									newNext.on('click',function(){
											var self = this ;
											ChintPlugins.pageBreakPlugin.aClick(self) ;
									}) ;
									if(selfInnerText == 3 ) $(selfElement).after(newNext[0]) ;
									if(selfInnerText == 4) {
											doublePrev.remove() ;
											$(selfElement).prev().before(apostrophe) ;
											$(selfElement).after(newNext[0]) ;
									}
									if(selfInnerText > 4 && selfInnerText < (lastPage-2) ){
											doublePrev.remove() ;
											$(selfElement).after(newNext[0]) ;
									}
									if(selfInnerText == (lastPage-2) ){
											doublePrev.remove() ;
											$(selfElement).next().remove() ;
											$(selfElement).after(newNext[0]) ;
									}
							}
							var nextChildContent = $(selfElement).next().next().children()[0] ;
							if(1 == prevInnerText && nextChildContent && ('4' == nextChildContent.textContent) && 4 != lastPage){
									doubleNext.remove() ;
							}
							var prevChildContent = $(selfElement).prev().prev().children()[0] ;
							if(lastPage == nextInnerText && prevChildContent && ((lastPage-3) == prevChildContent.textContent) && 4 != lastPage){
									doublePrev.remove() ;
							}
							//点击最后一个分页节点
							if(selfInnerText > 4 && lastPage == selfInnerText && 4 != lastPage){
									var newPrev = $('<a class="pagingCommon"><strong>'+(lastPage-2)+'</strong></a><a class="pagingCommon"><strong>'+(lastPage-1)+'</strong></a>') ;
									newPrev.on('click',function(){
											var self = this ;
											ChintPlugins.pageBreakPlugin.aClick(self) ;
									}) ;
									while(true){
											$(selfElement).prev().remove() ;
											if(1 == $(selfElement).prev().children()[0].textContent) break ;
									}
									$(selfElement).before(apostrophe).before(newPrev[0]).before(newPrev[1]) ;
							}
							//点击第一个分页节点
							if( 1 == selfInnerText && 3 != lastPage && 4 != lastPage ){
									var newNext = $('<a class="pagingCommon"><strong>'+2+'</strong></a><a class="pagingCommon"><strong>'+3+'</strong></a>') ;
									newNext.on('click',function(){
											var self = this ;
											ChintPlugins.pageBreakPlugin.aClick(self) ;
									}) ;
									while(true){
											$(selfElement).next().remove() ;
											if(lastPage == $(selfElement).next().children()[0].textContent) break ;
									}
									$(selfElement).after(apostrophe).after(newNext[1]).after(newNext[0]) ;
							}
					},
			      
			        getValue : function(){
			      			var self = this ;
			        },
			      
			        destroy : function(){
			      			this.node.html('') ;
			        }
		  }
		  
		  namespace.pageBreakPlugin = new pageBreakPlugin() ;
	
})(window.ChintPlugins)