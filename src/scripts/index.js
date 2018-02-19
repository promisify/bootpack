import $ from 'jquery';
import TweenLite from 'gsap'; //GreenSock
//import bootstrap from 'bootstrap';
//import hamburgers from 'hamburgers';
//import fullpage from 'fullpage.js';

import '../css/hamburgers.min.scss';
//import '../css/bootstrap.min.css';
import '../styles/main.sass';
import '../styles/style.scss';
require ('../index.html');


//import App from './modules/index'


function countDistance(element, percent){ //Calc transform pos for parallax items
	var result = {};	
	var distance_x = element.data('limit-x'); //X-axis sliding px
	var distance_y = element.data('limit-y'); //Y-axis sliding px
	var new_x = distance_x/100*percent; 	
	var new_y = distance_y/100*percent;

	if (Math.abs(new_x) >= Math.abs(distance_x)) new_x = distance_x; //Limit bounds for x
	if (Math.abs(new_y) >= Math.abs(distance_y)) new_y = distance_y; //And y
	
	result.new_x = new_x; 
	result.new_y = new_y; //Math.round(new_y-new_y/10)
	return result;
}

function countScaling(element, percent){ //Calc transform pos for parallax items
	var result = "";	
	var scaling = element.data('scaling'); //X-axis sliding px
	if (scaling > 0){
		var new_scale = 1+(scaling-1)/100*percent;
	}
	else return result;

	result = Math.round(new_scale*1000)/1000;

	return "scale("+result+")";
}

function parawizo(actor, st, wh){
		var display_bottom = st+wh;
		//var main_actor = $(this);
		//var elem_correction = parseFloat(actor.css('top'));
		var scene = actor.data('scene'); //Scene-data must be present
		var offset = actor.offset();
		var height = actor.height();
		var part_coef = actor.data('intersect'); //0.5 = half of element should be visible
		var trigger_top = offset.top+height*part_coef;
		var trigger_bot = offset.top+height;
		
		if (trigger_top <= display_bottom && trigger_bot >= st){ //Action when in viewport  
			var space_available = Math.round(wh/100*actor.data('space_vh'));
			var one_percent = space_available/100;
			var space_used = display_bottom-trigger_top;
			if (space_used > space_available) space_used = space_available;			
			var action_percent = space_used/one_percent;

			$(scene).each(function() {
				var subj = $(this);	
        		window.requestAnimationFrame(function() {	
        		var move = countDistance(subj, action_percent);		 		
        		var scaling = countScaling(subj, action_percent);		 		
        			subj.css('transform', 'translate3d('+move.new_x+'px, '+move.new_y+'px, 0) '+scaling);	
        		});	
        	});	
		}	
}


$(window).on('scroll', function () {
	var st = $(window).scrollTop();	
	var wh = $(window).height();
	var blue = $('.blue_holder').height();
	var dark = $('.dark_holder').height();

	
	if (st <= 0) {
			$('.parallax').css('transform', 'translate3d(0,0,0)');
			return false;
	}  



	if (st-15 >= blue) $( ".dark_holder" ).removeClass('before_scroll');
	else $( ".dark_holder" ).addClass('before_scroll');

	if (st > blue+dark-wh) $( ".dark_holder" ).addClass('after_scroll');
	else $( ".dark_holder" ).removeClass('after_scroll');

	$( ".parallax.actor" ).each(function() {
		parawizo($(this), st, wh);		    
	});		

	
});


$(document).ready(function($) {
	function resizing(){
		var w =$(window).width();
		var h =$(window).height();
		var para_screen_coef_w = w/1900;
		var para_screen_coef_h = h/1000;

		$("[data-limit-y]").each(function() {
			var val = Math.round($(this).data('limit-y')*para_screen_coef_h);
			$(this).data('limit-y', val);
			var val = Math.round($(this).data('limit-x')*para_screen_coef_w);
			$(this).data('limit-x', val);
		});

		var ori_coef = w/h;
		var mobi_class = '*';
		var wide_class = '*';
		if (w < 720) {
			$(mobi_class).addClass('mobile');
		} 
		else {
			$(mobi_class).removeClass('mobile'); 
		} 
		var vinyl_h = $('.vinyl').width()/1.88;
		$('.vinyl').css('height', vinyl_h);
		var lamp_top = parseFloat($('.lamp').height())*$('.lamp.actor').data('intersect')*-1;
		$('.lamp').css('top', lamp_top);
	}	
	//window.scrollTo(0, 0);

	$('.hamburger').on('click', function(){
		this.classList.toggle("is-active");
	});
	
	TweenLite.from(diri, 1.2, {autoAlpha: 0, y: 40,  ease: Back.easeOut.config( 1.7), delay: 0.3});

	resizing();
	window.onresize = function(event) { resizing(); } 
	
	$('.wrapper').addClass('onscreen');
	$('.before_load').removeClass('before_load');
});

