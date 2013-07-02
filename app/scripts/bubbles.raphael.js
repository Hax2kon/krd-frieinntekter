
'use strict';

var friApp = friApp || {};

friApp.bubbles = function (Raphael) {
    // private property
    var o = {};

    if (typeof String.prototype.startsWith != 'function') {
        String.prototype.startsWith = function (str) {
            return this.slice(0, str.length) == str;
        };
    }

    function textWrap(t, width, color, size, weight) {
        var content = t.attr("text");
        var abc = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
        t.attr({
            "text": abc,
            "font-size": size,
            "font-family": "Georgia, serif",
            "font-weight": weight
        });
        var box = t.getBBox();

        var letterWidth = box.width / abc.length;
        t.attr({
            "text": content,
            'fill': color,
            'opacity': 0
        });
        var words = content.split(" ");
        var x = 0, s = [];
        for (var i = 0; i < words.length; i++) {

            var l = words[i].length;
            if (words[i] === '<br>') {
                s.push("\n");
                x = 0;
            } else if (words[i].startsWith('<BR>')) {
                var _w = words[i].substring(4);
                s.push("\n");
                s.push(_w + " ");
                x = 0;
            } else {
                if (x + (l * letterWidth) > width) {
                    s.push("\n");
                    x = 0;
                }
                x += l * letterWidth;
                s.push(words[i] + " ");
            }
        }
        t.attr({
            "text": s.join("")
        });

        return t;
    }

    // Computes a path string for a circle
    Raphael.fn.circlePath = function (x, y, r) {
        return "M" + x + "," + (y - r) + "A" + r + "," + r + ",0,1,1," + (x - 0.1) + "," + (y - r) + " z";
    }

    // Computes a path string for a line
    Raphael.fn.linePath = function (x1, y1, x2, y2) {
        return "M" + x1 + "," + y1 + "L" + x2 + "," + y2;
    }

    // draw a path between two circles and return it
    // http://stackoverflow.com/questions/13544884/method-available-for-connecting-pairs-of-circles-in-raphaeljs-2
    function drawPath(r, c1x, c1y, c1r, c2x, c2y, c2r, color, width) {

        var c1path = r.circlePath(c1x, c1y, c1r),
            c2path = r.circlePath(c2x, c2y, c2r),
            linePath = r.linePath(c1x, c1y, c2x, c2y),

        // Get the path intersections
        // In this case we are guaranteed 1 intersection, but you could find any intersection of interest
            c1i = Raphael.pathIntersection(linePath, c1path)[0],
            c2i = Raphael.pathIntersection(linePath, c2path)[0],

            line = r.path(r.linePath(c1i.x, c1i.y, c2i.x, c2i.y)).attr({ 'stroke': color, 'stroke-width': 0 });

        return line;
    }

    function drawBubble($bubble) {
        var consts = {
            label: $bubble.find('h5').html(),
            calculation: $bubble.find('.calculation').text(),
            margin: 10, // margin bottom calculation,
            calculationFontSize: o.mode === 'simple' ? 18 : 30,
            labelFontSize: o.mode === 'simple' ? 14 : 16,
            paddingTop: o.mode === 'simple' ? 10 : 20,
            calculationYOffset: o.mode === 'simple' ? 75 : 50,
            labelYOffset: 10
        };

        // vml doesnt render it as svg
        if (Raphael.vml) {
            consts.calculationYOffset = o.mode === 'simple' ? 40 : 25;
            consts.labelYOffset = o.mode === 'simple' ? 45 : 25;
        }

        return $.Deferred(function (dfd) {
            var c = o.r.circle($bubble.data('x'), $bubble.data('y'), 0)
                .attr({
                    'fill': $bubble.data('fill'),
                    'stroke': $bubble.data('stroke')
                })
                .animate({ 'r': $bubble.data('r') }, o.animationDuration, o.animationEasingOut, function () {
                    // initalize hover effect
                    o.$canvas.bind('mouseenter', function () {
                        startPulse();
                    }).bind('mouseleave', function () {
                        stopPulse();
                    });

                    // create calculation
                    var cl = textWrap(o.r.text($bubble.data('x'), $bubble.data('y') - consts.calculationYOffset, consts.calculation), $bubble.data('r') + 40, $bubble.data('secondary-color'), consts.calculationFontSize, 'bold');

                    //var clBBox = cl.getBBox();
                    //cl.attr({ 'y': $bubble.data('y') + clBBox.y - clBBox.y2 - consts.paddingTop });
                    // create label
                    var l = textWrap(o.r.text($bubble.data('x'), $bubble.data('y') + consts.labelYOffset, consts.label), $bubble.data('r') * 2 + 10, $bubble.data('secondary-color'), consts.labelFontSize, 'normal');

                    // add calculation to collection
                    o.labels.push(cl);
                    // add label to collection
                    o.labels.push(l);

                    // draw horizontal line
                    o.horizontalLines.push(drawHorizontalLine($bubble.data('x'), $bubble.data('y'), $bubble.data('r'), 20, $bubble.data('secondary-color')));

                    // draw lines between bubbles
                    if ($bubble.data('connect-to-prev')) {
                        var $prevBubble = $bubble.prev();
                        var p = drawPath(o.r, $prevBubble.data('x'), $prevBubble.data('y'), $prevBubble.data('r'), $bubble.data('x'), $bubble.data('y'), $bubble.data('r'), $bubble.data('stroke'), 1);

                        // add to collection
                        o.lines.push(p);
                        p.animate({ 'stroke-width': 1 }, 250).toBack();
                    }

                    dfd.resolve();
                });



            // store original radius (for usage with animation)
            c.orgR = $bubble.data('r');

            o.bubbles.push(c);
        }).promise();
    }

    function drawHorizontalLine(x, y, radius, padding, color) {
        var p =  o.r.path(o.r.linePath(x - radius + padding, y, x + radius - padding, y));
        p.attr({
            'stroke': color,
            'stroke-width': '0.5',
            'opacity': 0
        });
        p.translate(0.5, 0.5); // hack to get a more crispy line
        return p;
    }

    function toggle() {
		// hide and remove all bubbles
		$.when(removeBubbles()).done(function(){
	    	if(o.mode === 'simple'){
	    		// show advanced bubbles
	            o.$advancedBubbles.each(function() {
	                o.drawBubbles.push(drawBubble($(this)));
	            });

                o.$canvas.attr('title', 'Enkel visning');

	    		o.mode = 'advanced';
	    	} else {
	    		// show simple bubbles
	            o.$simpleBubbles.each(function() {
	                o.drawBubbles.push(drawBubble($(this)));
	            });

                o.$canvas.attr('title', 'Avansert visning');

	    		o.mode = 'simple';
	    	}
            // when bubbles is drawn, show lines and labels/texts
            $.when.apply($, o.drawBubbles).done(function() {
                o.lines.toBack();
                o.horizontalLines.toFront().animate({ 'opacity': .75 }, o.animationDuration);
                o.labels.toFront().animate({ 'opacity': 1 }, o.animationDuration);
            });
		});

    }

    function removeBubbles() {
        o.drawBubbles = [];
    	return $.Deferred(function( dfd ) {
	    	if(o.bubbles.length){

                o.labels.animate({ 'opacity': 0 }, o.animationDuration, o.animationEasingIn, function() {
                    o.labels.remove().clear();
                });
                o.horizontalLines.animate({ 'opacity': 0 }, o.animationDuration / 2, o.animationEasingIn, function() {
                    o.horizontalLines.remove().clear();
                });

                o.lines.animate({ 'opacity': 0 }, o.animationDuration / 2, o.animationEasingIn, function() {
                    o.lines.remove().clear();
                });

		    	o.bubbles.animate({ 'r': 0 }, o.animationDuration, o.animationEasingIn, function() {
		    		o.bubbles.remove().clear();
		    		dfd.resolve();
		    	});

		    	
	    	} else {
	    		dfd.resolve();
	    	}
    	}).promise();

    }

    // animation
    function startPulse() {
    	for(var i = 0; i < o.bubbles.length; i++) {
    		pulsate(o.bubbles[i], o.bubbles[i].attr('r'));
    	}
    }

    function stopPulse() {
        if(!$.when.apply($, o.drawBubbles).isResolved()) {
            o.drawBubbles.done(function() {
                o.bubbles.stop();
            });
        } else {
            o.bubbles.stop();
        }
    	
    	// animate back to starting radius
    	for(var i = 0; i < o.bubbles.length; i++) {
    		o.bubbles[i].animate({ 'r': o.bubbles[i].orgR }, 200);
    	}
    }

    function pulsate(el, r) {
    	var t = 750,
    		pulse = Raphael.animation({
	    		1: {'r': r + 5}, 
	    		2: {'r': r }
			}, t, 'bounceOut').repeat(Infinity);

    	el.animate(pulse);
    }

    return {
        // public method
        init: function (options) {
            o = $.extend({}, o, options);
            o.r = Raphael('fri-bubbles-canvas', options.containerWidth, options.containerHeight);
            o.labels = o.r.set();
            o.bubbles = o.r.set();
            o.lines = o.r.set();
            o.horizontalLines = o.r.set();
            o.animationDuration = 250;
            o.animationEasingIn = 'backIn';
            o.animationEasingOut = 'backOut';
            o.$canvas = $('#fri-bubbles-canvas');
            o.$simpleBubbleContainer = $('#fri-bubbles-simple');
            o.$simpleBubbles = o.$simpleBubbleContainer.find('li');
            o.$advancedBubbleContainer = $('#fri-bubbles-advanced');
            o.$advancedBubbles = o.$advancedBubbleContainer.find('li');
            o.shown = false;
            o.$canvas.bind('click', function() {
            	stopPulse();
            	toggle();
            });
   		},
        show: function() {
        	if(!o.shown){
        		toggle();
        		o.shown = true;
            }
        }
    };
}(Raphael);

