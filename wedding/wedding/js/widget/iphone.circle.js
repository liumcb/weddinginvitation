//2016.11.22
(function($) {
	jQuery.fn.extend({
		circleOn: function(options) {			
			var $this=$(this).eq(0).parent();
			var $box=$(this).css({z:0});
			var $end=false,$wheel=0;
			var $data=[],$max=$box.length,$now=0,$tar=0,focusTimer,circleTimer;
			var defaults = {rx:$this.width()*0.5,ry:$this.height()*0.25,speed:1,auto:true,delay:5000,blur:false,scale:true,zIndex:true,perspective:false,focus:true,offsetX:0,offsetY:0,dir:1,swipe:true};
			var opts = $.extend(defaults,options);
			init();
			
			function init(){
				$box.each(function(i){
					$data[i]={ag:360/$max*i,agTar:360/$max*i,wd:$(this).width(),ht:$(this).height()};
				});
				$this.on("off",this_off).on("left",this_left).on("right",this_right).on("stop",this_stop).on("play",this_play);
				if(opts.swipe){
					if(opts.focus) $this.one('swipeleft',swiperight_handler).one('swiperight',swipeleft_handler);
					else $this.on('swipeleft',swipeleft_handler).on('swiperight',swiperight_handler);
				}//edn if
				if(opts.focus) {
					box_set();
					box_focus();
				}//end else
				else box_circle();
			}//end func
			
			function this_off(e){
				$this.off("off goto left stop play");
				if(opts.swipe) $this.off('swipeleft swiperight');
				$end=true;
				if(opts.focus) clearTimeout(focusTimer);
				if(opts.onOff) opts.onOff($this);
			}//end func
			
			function this_stop(e){
				$end=true;
				if(opts.focus) clearTimeout(focusTimer);
			}//end func
			
			function this_play(e){
				$end=false;
				if(opts.focus){
					clearTimeout(focusTimer);
					focusTimer=setTimeout(box_roll,opts.delay);
				}//end if
				else box_circle();
			}//end func
			
			function this_left(e){
				opts.dir=1;
				if(opts.focus) box_roll();
			}//end func
			
			function this_right(e){
				opts.dir=-1;
				if(opts.focus) box_roll();
			}//end func
			
			function swipeleft_handler(e){
				e.preventDefault();
				this_left();
			}//end func
			function swiperight_handler(e){
				e.preventDefault();
				this_right();
			}//end func
			
			function box_focus(){
				if(opts.auto){
					clearTimeout(focusTimer);
					focusTimer=setTimeout(box_roll,opts.delay);
				}//end if
			}//end func
			
			function box_roll(){
				if(!$this.hasClass('moving')){
					$this.addClass('moving');
					$tar-=opts.dir;
					$tar=$tar<0?$max-1:$tar;
					$tar=$tar>$max-1?0:$tar;
					$box.each(function(i){
						$data[i].agTar+=360/$max*opts.dir;
					});
					if(opts.swipe) $this.off('swipeleft swipeup');
					box_circle();
				}//end if
			}//end func
			
			function box_circle(){
				$box.each(function(i){
					if(opts.focus){
						$data[i].ag=imath.ease($data[i].ag,$data[i].agTar,opts.speed,0.1);
						if($data[i].ag%360==0) $now=i;
					}//end if
					else{
						$data[i].ag-=opts.speed*opts.dir;
						$data[i].ag=$data[i].ag<360?$data[i].ag:0;
						$data[i].ag=$data[i].ag>-360?$data[i].ag:0;
						if($data[i].ag==0){
							$now=i;
							if(opts.onComplete) opts.onComplete($now,$this);
						}//end if
					}//end else
				});
				if(!opts.focus && opts.wheel){
					$wheel+=opts.speed*opts.dir;
					$wheel=$wheel<360?$wheel:0;
					$wheel=$wheel>-360?$wheel:0;
				}//edn if
				box_set();
				if(opts.focus){
					if($now==$tar){
						if(opts.onComplete) opts.onComplete($now,$this);
						$this.removeClass('moving');
						if(opts.swipe) $this.one('swipeleft',swiperight_handler).one('swiperight',swipeleft_handler);
						if(!$end) box_focus();
					}//end if
					else requestAnimationFrame(box_circle);
				}//end else
				else if(!$end) requestAnimationFrame(box_circle);
			}//end func
			
			function box_set(){
				$box.each(function(i,n){
					var xbit = Math.sin(imath.toRadian($data[i].ag));
					var ybit = Math.cos(imath.toRadian($data[i].ag));
					$(n).show().css({x:$this.width()/2+xbit*opts.rx-$data[i].wd/2+opts.offsetX,y:$this.height()/2+ybit*opts.ry-$data[i].ht/2+opts.offsetY});
					if(opts.zIndex){
						var zbit=Math.floor(100*ybit);
						$(this).css({zIndex:zbit});
					}//end if
					if(opts.scale){
						var scale=(150+50*ybit)/200;
						$(n).css({scale:scale});
					}//edn if
					if(opts.perspective) $(n).css({ perspective:400, rotateY:$data[i].ag });
					if(opts.blur){
						var blur=Math.cos(imath.toRadian($data[i].ag-180))*0.5;
						$(n).css({ '-webkit-filter':'blur('+blur+'rem)' });
					}//end if
				});
				if(!opts.focus && opts.wheel) opts.wheel.css({rotate:$wheel});
			}//end func

		},//end fn
		circleStop: function() {
			$(this).triggerHandler('stop');
		},//end fn
		circlePlay: function() {
			$(this).triggerHandler('play');
		},//end fn
		circleRight: function() {
			$(this).triggerHandler('right');
		},//end fn
		circleLeft: function() {
			$(this).triggerHandler('left');
		},//end fn
		circleOff: function() {
			$(this).triggerHandler('off');
		}//end fn
	});//end extend
})(jQuery);//闭包