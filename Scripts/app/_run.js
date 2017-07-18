var i = 0;
var view = new ol.View({
    center: randomLocation(i),
    zoom: defaults.initial_zoom,
    minZoom: defaults.minZoom,
    maxZoom: defaults.maxZoom,
});

var vector_layer = new ol.layer.Vector({
    source: new ol.source.Vector()
});

var marker_style = new ol.style.Style({
    image: new ol.style.Icon({
        scale: 0.7,
        src: '../Content/aamin.png'//'//openlayers.org/en/master/examples/data/icon.png'
    })
});

var map = new ol.Map({
    controls: ol.control.defaults().extend([
        new ol.control.FullScreen()
    ]),
    layers: [
        new ol.layer.Tile({
            visible: true,
            preload: Infinity,
            source: new ol.source.BingMaps({
                key: 'Ao3Zu5cqgyhvar8ZEIYyrswWzINsCk2VM4FAWQH5o3W2PQ0Po6JcQYdiauIWoqgg',
                imagerySet: 'Road'
                // use maxZoom 19 to see stretched tiles instead of the BingMaps
                // "no photos at this zoom level" tiles
                // maxZoom: 19
            })
        }),
        vector_layer
    ],
    loadTilesWhileAnimating: true,
    target: 'map',
    interactions: ol.interaction.defaults({
        doubleClickZoom: false
    }),
    view: view
});

function createMarker(location) {
    var marker = new ol.Feature(new ol.geom.Point(location));
    marker.setStyle(marker_style);
    vector_layer.getSource().addFeature(marker);
}

function flyTo(location) {
    var final_zoom = defaults.final_zoom,
        initial_zoom = defaults.initial_zoom;

    removeMarker()
        .then(zoom.bind(null, initial_zoom))
        .then(panTo.bind(null, location))
        .then(zoom.bind(null, final_zoom))
        .then(function () {
            createMarker(location);
        });
}

function removeMarker() {
    var deferred = Q.defer();
    // remove all markers from this source
    vector_layer.getSource().clear();
    deferred.resolve();
    return deferred.promise;
}

function zoom(zoom_level) {
    var duration = defaults.zoom_duration;
    var deferred = Q.defer();
    var zoom = ol.animation.zoom({
        duration: duration,
        resolution: view.getResolution()
    });

    map.beforeRender(zoom);
    view.setZoom(zoom_level);

    Q.delay(duration).then(deferred.resolve);
    return deferred.promise;
}

function panTo(location) {
    var duration = defaults.panTo_duration;
    var deferred = Q.defer();
    var pan = ol.animation.pan({
        duration: duration,
        source: view.getCenter()
    });

    map.beforeRender(pan);
    view.setCenter(location);

    Q.delay(duration).then(deferred.resolve);
    return deferred.promise;
}

function randomLocation(x) {
    //var x = getRandomInRange(-180, 180, 3);
    //var y = getRandomInRange(-90, 90, 3);

    var location = [
        [-47.3461984, -22.7435043],
        [-47.350334, -23.176909],
        [-55.920700, -13.076173], 
        [-44.264709, -2.484866], 
        [-46.6318209, -23.5564393],
        [-47.0562056, -22.9134779]
    ];

    return ol.proj.transform(location[x], 'EPSG:4326', 'EPSG:3857');
}

function getRandomInRange(from, to, fixed) {
    return (Math.random() * (to - from) + from).toFixed(fixed) * 1;
}

setInterval(function () {
    i++;

    flyTo(randomLocation(i));

    if (i >= 3){
        i = -1;
    }

}, 5000);