(function($) {
	$.fn.friEqualHeights = function() {
		return this.each(function() {
			var $this = $(this),
				$main = $this.find('.fri-main'),
				$aside = $this.find('.fri-aside'),
				heights = {
					main: $main.height(),
					aside: $aside.height()
				};

			if(heights.main > heights.aside){
				$aside.height(heights.main);
			} else {
				$main.height(heights.aside - 40);
			}
		});
	}
})(window.jQuery);
