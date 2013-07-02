'use strict';

var friApp = friApp || {};
friApp.info = function (_) {
    // private property
    var info = L.control(),
    	resetText;

	info.onAdd = function (map) {
	    this._div = L.DomUtil.create('div', 'fri-map-info'); // create a div with a class "info"
	    this.reset();
	    return this._div;
	};

	info.update = function (innerHTML) {
	    this._div.innerHTML = innerHTML;
	};

	info.reset = function() {
		info.update(resetText);
	}

	// method that we will use to update the control based on feature properties passed
	// info.update = function (properties) {
	//     this._div.innerHTML = (properties ? '<h4>' + getKommuneName(properties.id) + '</h4>' +  
	//         'Frie inntekter: <b>' + formatMoney(properties.fri, true) + '</b>'
	//         : 'Pek på en kommune');
	// };


    return {
        // public method
        init: function (map, resetTextArg) {
			resetText = resetTextArg;
			info.addTo(map);
			return info;
        },
        update: function(innerHTML) {
			this.update(innerHTML);
        },
        reset: function() {
        	info.update(resetText);
        }
    };
}(_);
