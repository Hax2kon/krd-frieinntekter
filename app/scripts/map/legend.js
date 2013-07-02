'use strict';

var friApp = friApp || {};
friApp.legend = function (_) {
    // private property
    var legend = L.control(),
    	map,
    	isAdded = false;

	legend.onAdd = function (map) {
	    var div = L.DomUtil.create('div', 'fri-map-info fri-map-legend'),
	        labels = [];

	    // loop through our density intervals and generate a label with a colored square for each interval
	    for (var i = 0; i < friApp.kommuner.getGrades().length; i++) {
	        div.innerHTML +=
	            '<i style="background:' + friApp.kommuner.getColor(friApp.kommuner.getGrades()[i] + 1) + '"></i> ' +
	            friApp.map.formatMoney(friApp.kommuner.getGrades()[i], true) + (friApp.kommuner.getGrades()[i + 1] ? '&ndash;' + friApp.map.formatMoney(friApp.kommuner.getGrades()[i + 1], false) + '<br>' : '+');
	    }

	    return div;
	};

	// method that we will use to update the control based on feature properties passed
	// info.update = function (properties) {
	//     this._div.innerHTML = (properties ? '<h4>' + getKommuneName(properties.id) + '</h4>' +  
	//         'Frie inntekter: <b>' + formatMoney(properties.fri, true) + '</b>'
	//         : 'Pek på en kommune');
	// };


    return {
        // public method
        init: function (options) {
        	legend.setPosition(options.position);
        	map = options.map;
			return legend;
        },
        add: function() {
        	if(!isAdded) {
        		legend.addTo(map);
        		isAdded = true;
        	}
        }
    };
}(_);
