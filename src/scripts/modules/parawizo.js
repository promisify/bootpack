
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



export default function (actor, st, wh){
		var display_bottom = st+wh;
		//var main_actor = $(this);
		//var elem_correction = parseFloat(actor.css('top'));
		var scene = actor.data('scene'); //Scene-data must be present
		var offset = actor.offset();
		var height = actor.height();
		var part_coef = actor.data('intersect'); //0.5 = half of element should be visible to trigger
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
