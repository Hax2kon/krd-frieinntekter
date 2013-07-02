'use strict';

var friApp = friApp || {};
friApp.kommuner = function (_) {
    // private property
    var map,
    	info,
    	config,
    	kommunerGeoJson,
    	kommunerList,
    	kommunerLayer = L.geoJson(null),
    	colors = ['F7FCFD', 'E0ECF4', 'BFD3E6', '9EBCDA', '8C96C6', '8C6BB1', '88419D', '6E016B', 'ff0000'],
		grades = [0, 20000000, 25000000, 300000000, 350000000, 400000000, 450000000, 500000000, 3000000000];
    

	function style(feature) {
	    return {
	        fillColor: getColor(feature.properties.fri),
	        weight: 1,
	        opacity: 1,
	        color: 'white',
	        dashArray: '3',
	        fillOpacity: 0.7
	    };
	};

	function getColor(dough){
	    var color = '#333333';
	    grades.forEach(function(grade, i) {
	        if(dough > grade) {
	            color = '#' + colors[i];
	        }
	    });
	    return color;
	};

	// returns a geojson with kommuner inside fylke
	function filterKommunerWithinFylke(fylkeId) {
	    //console.log(frikart.kommune_geojson.features, fylkeId);

	    return _.filter(kommunerGeoJson.features, function(kommune){
	        return kommune.properties.id.substr(0,2) === fylkeId;
	    });
	}

	function onEachFeature(feature, layer) {
	    layer.on({
	        mouseover: highlightFeature,
	        mouseout: resetHighlight,
	        click: clickFeature
	    });
	}

	function resetHighlight(e) {
	    kommunerLayer.resetStyle(e.target);
	    info.reset();
	}

	function highlightFeature(e) {
	    var layer = e.target;

	    layer.setStyle({
	        weight: 2,
	        color: '#666',
	        dashArray: '',
	        fillOpacity: 0.7
	    });

	    if (!L.Browser.ie && !L.Browser.opera) {
	        layer.bringToFront();
	    }

	    info.update('<h4>' + getKommuneName(layer.feature.properties.id) + '</h4>' + 'Frie inntekter: <b>' + friApp.map.formatMoney(layer.feature.properties.fri, true) + '</b>');
	}

	function clickFeature(e) {
		alert('Gå til ' + getKommuneName(e.target.feature.properties.id));
	}

	function getKommuneName(id) {
	    return _.find(kommunerList, function(kommune) {
	        return kommune.kommune === id;
	    }).navn;
	}

    return {
        // public method
        init: function (mapArg, kommunerGeoJsonArg, kommunerListArg, infoArg, configArg) {
        	map = mapArg;
        	config = configArg;
        	kommunerGeoJson = kommunerGeoJsonArg;
        	kommunerList = kommunerListArg;
        	info = infoArg;

            friApp.legend.init({
                map: map,
                position: 'bottomright'
            });

        },

        show: function(fylkeId) {

		    var kommunerInFylke = filterKommunerWithinFylke(fylkeId);

		    map.removeLayer(kommunerLayer);
		    kommunerLayer = L.geoJson(kommunerInFylke, { 
		        style: style,
		        onEachFeature: onEachFeature
		    }).addTo(map);

		    // show legend
		    friApp.legend.add();

        },

        getColor: function(dough) {
        	return getColor(dough);
        },

        getColors: function() {
        	return colors;
        },

        getGrades: function() {
        	return grades;
        }
    };
}(_);