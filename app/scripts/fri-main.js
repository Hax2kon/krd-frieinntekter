$(function() {
	$(".fri-collapse-main").collapse({
		query: '.collapsible .header',
		open: function() {
			this.addClass("open");
			this.css({ height: this.children().outerHeight() });
		},
		close: function() {
			this.css({ height: "0" });
			this.removeClass("open");
		}
	});
	var lineIsShown = false;
	$(".fri-collapse-sub").collapse({
		query: '.sub-header'
	}).bind('open', function(e, section) {
		//console.log(section, " is open");
		// create vertical line on utgiftsutgjevning table
		$('.fri-utgiftsutgjevning > table').createLine(lineIsShown);
		lineIsShown = true;
	});

	$('.init-bubbles').bind('click', function() {
        friApp.bubbles.show();
	});

	// match zeroes
	$('.fade-zeros').fadeZeroes();

	$('.open-popup-link').bind('click', function() {
		$.magnificPopup.open({
			items: {
				src:  $(this).data('src') || $(this).attr('href'),
				type: 'inline'
			}
		});
	});

    // init navigation
    friApp.navigation.init({
    	$container: $('.fri-navs'),
        $navEl: $('#fri-fylker-nav'),
        scrollToActiveFylke: $('.fri-fylke').length
    });

    // equal height columns for front page (main and aside)
    $('.fri-equalcolumns').friEqualHeights();
});

(function($) {
	$.fn.createLine = function(lineIsShown) {
		return this.each(function() {
			if(lineIsShown) {
				return;
			}
			var $this = $(this),
				$lineEl = $('<div />').addClass('index-vertical-line');

			$lineEl.insertBefore($this).height($this.height() + 21);


		});
	};
})(jQuery);

(function($) {
	// example: 0,0098 => <span>0,00</span>98
	$.fn.fadeZeroes = function() {
		return this.each(function() {
			var $this = $(this),
				str = $this[0].innerHTML,
				regex = /[^1-9]+/; // match all zeroes
				match = str.match(regex);

			// wrap zeroes in span
			var zeroes = str.slice(0, match[0].length);
			var rest = str.slice(match[0].length, str.length);
			var newString = '<span>' + zeroes + '</span>' + rest;
			$this.html(newString);
		});
	};
})(jQuery);