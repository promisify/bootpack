import $ from 'jquery';
import Vivus from "vivus";
import TweenLite from 'gsap'; //GreenSock

import parawizo from './modules/parawizo'; //Parallax attempts
import fontawesome from '../js/fontawesome.js'; //FA
//const Snap = require(`imports-loader?this=>window,fix=>module.exports=0!../js/snap.js`); //snap.svg 


//import bootstrap from 'bootstrap';
//import hamburgers from 'hamburgers';
//import fullpage from 'fullpage.js';

import '../css/hamburgers.scss';
import '../css/bootstrap.min.scss';
import '../styles/main.sass';
import '../styles/style.scss';
import "../index.html"; // to enable reload
import rhombus from "../static/images/rhombus.svg";






$(window).on('scroll', function () {
	var st = $(window).scrollTop();	
	var wh = $(window).height();;
	/*if (st <= 0) {
			$('.parallax').css('transform', 'translate3d(0,0,0)');
			return false;
	}  */


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
		} else {
			$(mobi_class).removeClass('mobile'); 
		} 
	}	
	//window.scrollTo(0, 0);

	$('.hamburger').on('click', function(){ //menu button
		this.classList.toggle("is-active");
	});
	
	$(".rhombus").html(rhombus);
	const rhombus_svg = new Vivus("rhombus_path", { type: "oneByOne", duration: 150 });

	$(".mission").on("click", function () {
			rhombus_svg.reset().play();
			console.log("rhombus_svg", rhombus_svg);
		});


	var appear = $(".mission > .title");
	TweenLite.from(appear, 1.2, {autoAlpha: 0, y: 40, delay: 0.2}); //,  ease: Back.easeOut.config( 1.7)

	resizing();
	window.onresize = function(event) { resizing(); } 
});

