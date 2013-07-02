'use strict';

var friApp = friApp || {};

friApp.map = function (_) {
    // private property
    var info,
		map,
		fylkerRequest;

	function getFylker(){
		return $.getJSON('scripts/json/N5000_fylker.topojson.js');
	}

	function getKommuner(){
		return $.getJSON('scripts/json/topojson.js');
	}

	function getKommunerList() {
		return $.getJSON('scripts/json/kommuner.js');
	}

    return {
        // public method
        init: function (options) {
        	map = L.map('map').setView(options.latLng, options.zoom);
        	info = friApp.info.init(map, 'Klikk i kartet');

            // display fylker
        	getFylker().done(function(fylkerTopoJsonData) {
    			getKommuner().done(function(kommunerTopoJsonData) {
    				getKommunerList().done(function(kommunerListData) {

        				friApp.fylker.init(fylkerTopoJsonData, map, info, kommunerTopoJsonData, kommunerListData,
        					options);
                        friApp.nav.init({
                            map: map,
                        })
    				});
    			});
        	});
        },

        // Shared methods
        formatMoney: function (dough, showCurrency){
            var currency = showCurrency ? 'NOK ' : '';
            return accounting.formatMoney(dough, currency, 0, ' ');
        }

    };
}(_);