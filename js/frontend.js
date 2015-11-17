(function (window, document, google) {
    'use strict';

    var opt = window.agm_opt;
    console.log(opt);
    /**
     * If options not found then return early
     */
    if (typeof window.agm_opt === 'undefined') {
        return;
    }

    function _loadGoogleMap() {
        var width = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
        var center = new google.maps.LatLng(parseFloat(opt.map.lat), parseFloat(opt.map.lng));
        var options = {
            panControl: !opt.controls.panControl,
            zoomControl: !opt.controls.zoomControl,
            mapTypeControl: !opt.controls.mapTypeControl,
            streetViewControl: !opt.controls.streetViewControl,
            overviewMapControl: !opt.controls.overviewMapControl,
            scrollwheel: !opt.mobile.scrollwheel,
            draggable: (!opt.mobile.draggable && width > 480),
            center: center,
            zoom: parseInt(opt.map.zoom),
            mapTypeId: google.maps.MapTypeId[opt.map.type],
            mapTypeControlOptions: {
                style: google.maps.MapTypeControlStyle.DROPDOWN_MENU,
                position: google.maps.ControlPosition.TOP_RIGHT
            },
            zoomControlOptions: {
                position: google.maps.ControlPosition.LEFT_CENTER
            }
        };
        var map = new google.maps.Map(agm_div, options);

        /**
         * If marker is enabled
         */
        if (opt.marker.enabled == 1) {
            var marker = new google.maps.Marker({
                position: center,
                map: map,
                title: opt.marker.title
            });
            if (opt.marker.animation !== 'NONE') {
                marker.setAnimation(google.maps.Animation[opt.marker.animation])
            }
            if (opt.marker.color !== false) {
                marker.setIcon(opt.marker.color);
            }

            /**
             * Info window needs marker to be enabled first
             */
            if (opt.info_window.enabled == 1) {
                var infoWindow = new google.maps.InfoWindow({content: opt.info_window.text});
                /**
                 * Clicking on map will close infowindow
                 */
                google.maps.event.addListener(map, 'click', function () {
                    infoWindow.close();
                });
            }
        }

        if (opt.marker.enabled == 1 && opt.info_window.enabled == 1) {
            /**
             * Clicking on marker will show info-window
             */
            google.maps.event.addListener(marker, "click", function () {
                infoWindow.open(map, marker);
                marker.setAnimation(null);
            });
            /**
             * If info window enabled by default
             */
            if (opt.info_window.state == 1) {
                window.setTimeout(function () {
                    infoWindow.open(map, marker);
                    marker.setAnimation(null);
                }, 2000);
            }

        }


        var timeout;
        /**
         * Resize event handling, make map more responsive
         * Center map after 300 ms
         */
        google.maps.event.addDomListener(window, 'resize', function () {
            if (timeout) {
                clearTimeout(timeout);
            }
            timeout = window.setTimeout(function () {
                map.setCenter(center);
            }, 300);
        });
    }


    var agm_div = document.getElementById("agm_map_canvas");
    if (typeof agm_div !== 'undefined') {
        if (typeof google == "object") {
            google.maps.event.addDomListener(window, "load", _loadGoogleMap)
        }
        else {
            agm_div.innerHTML = '<p style="text-align: center">Failed to load Google Map.<br>Please try again.</p>';
            agm_div.style.height = "auto";
        }
    }


})(window, document, google);