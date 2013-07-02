'use strict';

var friApp = friApp || {};

friApp.nav = function () {
    // private property
    var info,
		map;

    return {
        // public method
        init: function (options) {
        	map = options.map;
        }
    };
}();