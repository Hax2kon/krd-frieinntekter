'use strict';

var friApp = friApp || {};

friApp.map = function (L, _) {
    // private property
    var o = {},
        fylkerLayers,
        activeFylkeLayer,
        colors = {
            background: '#818285',
            active: '#495e29',
            selected: '#444444'
        };

    function getFylker(){
        return $.getJSON(friApp.config.SCRIPT_PATH + '/json/N5000_fylker.' + o.dataType + '.json');
    }

    function initMap(fylkerGeoJson) {
        fylkerLayers = L.geoJson(fylkerGeoJson, {
            style: style,
            onEachFeature: onEachFeature
        }).addTo(o.map);

        // highlight active fylke (if any)
        if(o.$activeNavEl.length) {
            activeFylkeLayer = getActiveFylkeLayer(o.$activeNavEl.attr('id').slice(6, 8)).fire('mouseover', { init: true, fillColor: colors.selected });
        }
    }

    function style(feature) {
        return {
            fillColor: '#ffffff',
            weight: 1,
            opacity: 1,
            color: colors.background,
            dashArray: 0,
            fillOpacity: 1
        };
    };

    function onEachFeature(feature, layer) {
        layer.on({
            mouseover: highlightFeature,
            mouseout: resetHighlight,
            click: clickFeature
        });
    };

    function highlightFeature(e) {
        var layer = e.target;
        var fillColor = e.fillColor || colors.active;
        layer.setStyle({
            fillColor: fillColor,
            weight: 1,
            color: fillColor,
            dashArray: '',
            fillOpacity: 1
        });
        if (!L.Browser.ie && !L.Browser.opera) {
            layer.bringToFront();
        }

        // highlight corresponding nav element
        if(!e.init){
            o.$navEls.removeClass('hover');
            o.$navEl.find('#fylke_' + layer.feature.properties.FYLKE_NR).addClass('hover');
        }
    }

    function resetHighlight(e) {
        fylkerLayers.resetStyle(e.target);
        if(activeFylkeLayer) {
            activeFylkeLayer.fire('mouseover', { fillColor: colors.selected } );
        }
        o.$navEls.removeClass('hover');
    }

    function clickFeature(e) {
        var layer = e.target,
            link = o.$navEl.find('#fylke_' + layer.feature.properties.FYLKE_NR + ' a');

        window.location.href = link.attr('href');

        return false;
    }

    /*
     Loop trough each fylke layer, and return the one with @id
     */
    function getActiveFylkeLayer(id) {
        return _.find(fylkerLayers._layers, function(fylke){
            return fylke.feature.properties.FYLKE_NR + "" === id;
            //return friApp.navigation.padFylkeId(fylke.feature.properties.FYLKE_NR) === id;
        });
    }

    return {
        // public method
        init: function (options) {
            o = $.extend({}, o, options);
            o.zoom = 4;
            o.latLng = [63, 17];

            o.map = L.map('fri-map', {
                zoomControl: false,
                attributionControl: false,
                doubleClickZoom: false,
                dragging: false,
                touchZoom: false,
                scrollWheelZoom: false
            }).setView(o.latLng, o.zoom);

            // if array.map is not available, assume old browser, and load geojson instead of topojson
            if (!Array.prototype.map) {
                o.dataType = 'geo';
            } else {
                o.dataType = 'topo';
            }

            getFylker().done(function(fylkerData) {
                if(o.dataType === 'geo'){
                    initMap(fylkerData);
                } else {
                    initMap(topojson.feature(fylkerData, fylkerData.objects.N5000_fylker));
                }
            });

            var activeFylkeLayer;
            o.$navEls.bind('mouseenter', function() {
                activeFylkeLayer = getActiveFylkeLayer($(this).attr('id').slice(6, 8));
                activeFylkeLayer.fire('mouseover');
            }).bind('mouseleave', function() {
                activeFylkeLayer.fire('mouseout');
            });
        }
    };
}(L, _);