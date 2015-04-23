/*
 jQuery plugin page v2.0
 Author: Hu Yicheng
 update:2014-05-12
 usage:$("selector").page({showLineCount:1,showMaxPages:7,bPrevNext:true,bPagination:true});
*/

(function($){
	$.fn.page = function(options){
		var options = $.extend({showLineCount:1,showMaxPages:7,bPrevNext:true,bPagination:true,effectTime:0},options),ClassPage;
		ClassPage = function(obj,opt){
			var d = new Date();
			this._o  = obj;
			this.slc = opt.showLineCount;
			this.smp = opt.showMaxPages > 7 ? opt.showMaxPages:7;
			this.bpn = opt.bPrevNext;
			this.bp	 = opt.bPagination;
			this.et  = opt.effectTime;
			this.tlc = obj.children().length;
			this.tpc = Math.ceil(this.tlc/this.slc);
			this.cI  = 1;
			this.i = parseInt(d.getTime().toString().slice(9))* Math.floor(Math.random()*11);
			this.phtml = "";
			this.pw = ""; 
		}
		ClassPage.prototype = {
			_set:function(){
				var _t = this;
				if(_t.bp || _t.bpn){
					var wrap = (_t._o.attr("id") !== undefined ? _t._o.attr("id") : (_t._o.attr("class") !== undefined ? _t._o.attr("class").split(" ")[_t._o.attr("class").split(" ").length-1] : "temp"))+"-wrap"+_t.i;
					_t._o.wrap("<div class='"+wrap+"'></div>");
					_t._o.after("<div class='page-wrap'><div class='page-inner'></div></div>");
					_t.pw = $("."+wrap);
					$(".page-inner",_t.pw).css({"position":"relative"});
					
					if(_t.bp){
						_t.phtml = _t._setPageStyle(1);
						$(".page-inner",_t.pw).append("<ul class='pagenation'>"+_t.phtml+"</ul>");
						$(".pagenation > li").eq(0).addClass("on").siblings().removeClass("on");
					}
					if(_t.bpn){
							$(".page-inner",_t.pw).append("<a href='javascript:void(0)' class='prev grey'>prev</a><a href='javascript:void(0)' class='next'>next</a>");
					}
					_t._o.css({"height":_t._o.children().outerHeight(true)*_t.slc,"overflow":"hidden"});
					_t.pw.css({"position":"relative","height":_t._o.children().outerHeight(true)*_t.slc+$(".page-wrap",_t.pw).outerHeight(true),"overflow":"hidden"});
				}
			},
			_setPageStyle:function(currentIndex){
				var _t = this,li = "",cI = currentIndex;
				if(_t.smp > _t.tpc){
					for(var i=0; i<_t.tpc; i++){
						li += "<li class='p"+(i+1)+"'>"+(i+1)+"</li>";
					}
					_t.phtml = li;
				}else{
					if(cI < _t.smp-2){
						for(var i = 1; i<=_t.smp-3+1; i++){
							li += "<li class='p"+(i)+"'>"+(i)+"</li>";
						}
						_t.phtml = li+"<li class='ellipsis'>...</li><li class='p"+(_t.tpc-1)+"'>"+(_t.tpc-1)+"</li><li class='p"+(_t.tpc)+"'>"+_t.tpc+"</li>";
					}else if(cI >= _t.smp-2 && cI <= _t.tpc-(_t.smp-3+1)+1){
						for(var i = 0; i<_t.smp-5; i++){
							li += "<li class='p"+(i+1)+"'>"+(i+1)+"</li>";
						}
						_t.phtml = li+"<li class='ellipsis'>...</li><li class='p"+(cI-1)+"'>"+(cI-1)+"</li><li class='p"+cI+"'>"+cI+"</li><li class='p"+(cI+1)+"'>"+(cI+1)+"</li><li class='ellipsis'>...</li><li class='p"+(_t.tpc-1)+"'>"+(_t.tpc-1)+"</li><li class='p"+(_t.tpc)+"'>"+_t.tpc+"</li>";
					}else{
						for(var i = _t.tpc-(_t.smp-3+1)+1; i<=_t.tpc; i++){
							li += "<li class='p"+(i)+"'>"+(i)+"</li>";
						}
						_t.phtml = "<li class='p1'>1</li><li class='p2'>2</li><li class='ellipsis'>...</li>"+li;
					}
				}
				return _t.phtml;
			},
			_btnGrey:function(){
				var _t = this;
				if(_t.cI == 1){
					$(".prev",_t.pw).addClass("grey");
				}else{
					$(".prev",_t.pw).removeClass("grey");
				}
				if(_t.cI == _t.tpc){
					$(".next",_t.pw).addClass("grey")
				}else{
					$(".next",_t.pw).removeClass("grey")
				}
			},
			_active:function(){
				var _t = this;
				_t._btnGrey();
				$(".pagenation",_t.pw).html(_t._setPageStyle(_t.cI));
				$(".pagenation > .p"+_t.cI,_t.pw).addClass("on").siblings().removeClass("on");
				_t._o.children().each(function(i){
					var start = _t.slc*(_t.cI-1), end = _t.slc*_t.cI;
					if(i >= start && i < end){
						$(this).show(_t.et);
					}else{
						$(this).hide(_t.et);
					}
				});
			},
			_bind:function(){
				var _t = this;
				if(_t.bp){
					$(".pagenation > li[class^='p']",_t.pw).live("click",function(){
						_t.cI = parseInt($(this).attr("class").slice(1));
						_t._active();
					});
				}
				if(_t.bpn){
					$(".prev",_t.pw).live("click",function(){
						_t.cI--;
						if(_t.cI <= 0){
							_t.cI = 1;
							return;
						}
						_t._active();
					});
					$(".next",_t.pw).live("click",function(){
						_t.cI++;
						if(_t.cI > _t.tpc){
							_t.cI = _t.tpc;
							return;
						}
						_t._active();
					});
				}
			},
			init:function(){
				if(this.tpc <= 1){
					this._o.children().show();
				}else{
					this._set();
					this._active();
					this._bind();
				};
			}
		};
		
		return this.each(function(j){
			return new ClassPage($(this),options).init();
		});
	};
	
})(jQuery);