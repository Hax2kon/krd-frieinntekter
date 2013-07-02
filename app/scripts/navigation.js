'use strict';

var friApp = friApp || {};

friApp.navigation = function (L, _) {
    // private property
    var o = {};
    
    o.kommuneSplitLength = 22;

    function kommunerColumnate() {
        if(o.$kommuneNavEls.length > o.kommuneSplitLength){
            o.$kommuneNavEl.addClass('col-2')
        }
    }

    // function padFylkeId(fylkeId) {
    //     if(fylkeId < 10) {
    //         return '0' + fylkeId;
    //     }
    //     return fylkeId + '';
    // }

    function createLines() {
        var $line = $('<div />').addClass('fri-line'),
            margin = 20,
            tinyLineWidth = 17,
            kommuneNavElPos = o.$kommuneNavEl.position(),
            activeKommuneNavElPos = o.$activeKommuneNavEl.position(),
            activeKommuneNavElWidth = o.$activeKommuneNavEl.width(),
            activeNavElPos = o.$activeNavEl.position(),
            navElHeight = o.$navEl.height(),
            navElPos = o.$navEl.position(),
            isFylkeskommune = o.$activeKommuneNavEl.hasClass('fylkeskommune'),
            factor = o.$kommuneNavEls.length > o.kommuneSplitLength && !isFylkeskommune ? 2 : 1;

        // create vertical line from active kommune to bottom of fylker
        $line.clone().addClass('vertical').appendTo(o.$container).css({
            'top': kommuneNavElPos.top - margin,
            'left': activeKommuneNavElPos.left - margin + 5,
            'height': activeKommuneNavElPos.top + margin * 1.5 + (isFylkeskommune ? 30 : 0)
        });

        // tiny horizontal line from active kommune out to longer line
        $line.clone().addClass('horizontal dot dot-right').appendTo(o.$container).css({
            'top': kommuneNavElPos.top + activeKommuneNavElPos.top + margin / 2  + (isFylkeskommune ? 30 : 0),
            'left': activeKommuneNavElPos.left - margin + 5,
            'width': tinyLineWidth - 5
        });

        // horizontal line
        $line.clone().addClass('horizontal').appendTo(o.$container).css({
            'top': kommuneNavElPos.top - margin,
            'left': activeKommuneNavElPos.left - margin + 5,
            'width': (activeKommuneNavElWidth*factor) - activeKommuneNavElPos.left + margin * 2 - 10
        });

        // vertical line from horizontal line to active fylke
        $line.clone().addClass('vertical').appendTo(o.$container).css({
            'top': o.$navEl[0].offsetTop + activeNavElPos.top + margin / 2,
            'left': (activeKommuneNavElWidth*factor) + margin - 5,
            'height': navElHeight - activeNavElPos.top + margin / 2 + 1
        });

        // tiny horizontal line from active fylke out to longer line
        $line.clone().addClass('horizontal dot').appendTo(o.$container).css({
            'top': o.$navEl[0].offsetTop + activeNavElPos.top + margin / 2,
            'left': (activeKommuneNavElWidth*factor) + margin - tinyLineWidth,
            'width': tinyLineWidth - 5
        });
    }

    function scrollToFylke() {
        $('html, body').animate({
            scrollTop: o.$activeNavEl.offset().top
        }, 750);
    }

    return {
        // public method
        init: function (options) {
            o = $.extend({}, o, options);
            o.$navEls = options.$navEl.find('li');
            o.$activeNavEl = o.$navEls.filter('.active');
            o.$kommuneNavEl = $('#fri-kommuner-nav');
            o.$kommuneNavEls = o.$kommuneNavEl.find('li');
            o.$activeKommuneNavEl = o.$kommuneNavEls.filter('.active');
            
            if(o.$kommuneNavEls.length){
                kommunerColumnate();
                if(o.$activeKommuneNavEl.length){
                    createLines();
                }
            }

            // scroll to active fylke element if fylke page
            if(o.scrollToActiveFylke && o.$activeNavEl.length){
                scrollToFylke();
            }

            friApp.map.init(o);
        }
    };
}(L, _);