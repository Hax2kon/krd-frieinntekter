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
    	colors = ["#ffffe5","#fff7bc","#fee391","#fec44f","#fe9929","#ec7014","#cc4c02","#993404","#662506"],
		grades = getGrades(3000000000, colors.length);
    

	function style(feature) {
	    return {
	        fillColor: getColor(feature.properties.fri),
	        weight: 1,
	        opacity: 1,
	        color: '#cccccc',
	        dashArray: '3',
	        fillOpacity: 0.7
	    };
	};

	function getColor(dough){
	    var color = '#333333';
	    grades.forEach(function(grade, i) {
	        if(dough > grade) {
	            color = colors[i];
	        }
	    });
	    return color;
	};

	// generate grades with a exponential factor
	function getGrades(max, number){
		var avg = max / number,
			i,
			grades = [],
			factor = 1.25;

		for(i = 0; i < number; i++){
			grades.push((ceilTo(avg * Math.pow(factor, i) - avg, 100000000)) * i);
		}

		return grades;
	}

	function ceilTo(number, digits) {
		return Math.ceil((number) / digits) * digits
	}

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
		var bounds = e.target.getBounds(),
			center = bounds.getCenter();

		map.setZoomAround(center, friApp.map.o.zoomClick);
		if(map.getZoom() === friApp.map.o.zoomClick) {
			map.panTo(center);
		}
		//alert('Gå til ' + getKommuneName(e.target.feature.properties.id));
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
	    	//map.removeLayer(kommunerLayer);
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