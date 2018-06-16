var injamSdk = require('injam-sdk')



window.markers = []



// Put your physical id and application key

window.credentials = {
    physical_id: 'demolx85b',
    channels: [],
    application_key: 'd144dd40-f7ad-11e7-9660-61d5f7592493'
}



// Some locations

window.Asia = {
    lat: 23.800029,
    lng: 62.4289998
}

window.Iran = {
    lat: 31.9927359,
    lng: 44.6737631
}

window.Tehran = {
    lat: 35.6970118,
    lng: 51.2097338
}



// Google Maps Sample

window.connectForGoogleMaps = function() {

    // Connect to Injam

    window.injam = new Injam(credentials)
    injam.connect()

    injam.on('subscribed', function (channel) {
        M.toast({html: 'Subscribed ' + channel})
    })

    injam.on('unsubscribed', function (channel) {
        M.toast({html: 'Unsubscribed ' + channel})
    })


    // Showing devices on Google Maps by markers when receiving location data

    injam.on('tracking', function (data) {
        if (markers[data.channel]) {
            var latlng = new google.maps.LatLng(data.location.lat, data.location.lng)
            markers[data.channel].setPosition(latlng)
            // Uncomment below if you want lock to one marker
            // map.panTo(latlng)
        } else {
            addMarkerGMaps(data.channel, {lat: data.location.lat, lng: data.location.lng}, map)
            var latlng = new google.maps.LatLng(data.location.lat, data.location.lng)
            markers[data.channel].setPosition(latlng)
            map.panTo(latlng)
        }
    })


    // Google Map init

    window.map = new google.maps.Map(document.getElementById('map'), {
        zoom: 3,
        center: Asia,
        scrollwheel: false,
        navigationControl: false,
        mapTypeControl: false,
        scaleControl: false,
        fullscreenControl: true,
        streetViewControl: false
    })

}



// Most useful Google Maps functions

window.addMarkerGMaps = function(id, location, map) {
    markers[id] = new google.maps.Marker({
        map: map,
        animation: google.maps.Animation.DROP,
        position: location,
        title: id
    })
}

window.setMapOnAllGMaps = function(map) {
    for (var i = 0; i < window.Markers.length; i++) {
        markers[i].setMap(map)
    }
}

window.clearMarkersGMaps = function() {
    setMapOnAllGMaps(null)
}

window.deleteMarkersGMaps = function() {
    clearMarkersGMaps()
    markers = []
}



// Open Street Map Sample

window.connectForOpenStreetMap = function() {

    // Connect to Injam

    window.injam = new Injam(credentials)
    injam.connect()

    injam.on('subscribed', function (channel) {
        M.toast({html: 'Subscribed ' + channel})
    })

    injam.on('unsubscribed', function (channel) {
        M.toast({html: 'Unsubscribed ' + channel})
    })


    // Showing devices on Open Street Map by markers when receiving location data

    injam.on('tracking', function (data) {
        if (markers[data.channel]) {
            var lonLat = ol.proj.transform([data.location.lng, data.location.lat], 'EPSG:4326', 'EPSG:3857')
            markers[data.channel].setCoordinates(lonLat)
            // Uncomment below if you want lock to one marker
            // view.animate({
            //     center: lonLat,
            //     duration: 2000
            // })
        } else {
            addMarkerOSM(data.channel, {lat: data.location.lat, lng: data.location.lng})
            var lonLat = ol.proj.transform([data.location.lng, data.location.lat], 'EPSG:4326', 'EPSG:3857')
            view.animate({
                center: lonLat,
                duration: 2000
            })
        }
    })


    // Open Street Map init

    window.markerSource = new ol.source.Vector()
    window.markerStyle = new ol.style.Style({
        image: new ol.style.Icon(/** @type {olx.style.IconOptions} */ ({
            anchor: [0.5, 46],
            anchorXUnits: 'fraction',
            anchorYUnits: 'pixels',
            src: 'https://injam.io/images/Marker-Red.svg'
        }))
    })
    window.view = new ol.View({
        center: ol.proj.fromLonLat([Asia.lng, Asia.lat]),
        zoom: 3
    })

    window.map = new ol.Map({
        target: 'map',
        layers: [
          new ol.layer.Tile({
            source: new ol.source.OSM()
          }),
          new ol.layer.Vector({
            source: markerSource,
            style: markerStyle
          }),
        ],
        view: view
    })

}


// Most useful Open Street Map functions

window.addMarkerOSM = function(id, location) {
    markers[id] = new ol.geom.Point(ol.proj.transform([location.lng, location.lat], 'EPSG:4326', 'EPSG:3857'))
    var marker = new ol.Feature({
        geometry: markers[id],
        name: id
    })
    markerSource.addFeature(marker)
}



// Cedar Maps Sample

window.connectForCedarMaps = function() {

    // Connect to Injam

    window.injam = new Injam(credentials)
    injam.connect()

    injam.on('subscribed', function (channel) {
        M.toast({html: 'Subscribed ' + channel})
    })

    injam.on('unsubscribed', function (channel) {
        M.toast({html: 'Unsubscribed ' + channel})
    })


    // Showing devices on Cedar Maps by markers when receiving location data

    injam.on('tracking', function (data) {
        if (markers[data.channel]) {
            var latLng = L.latLng(data.location)
            markers[data.channel].setLatLng(latLng)
            // Uncomment below if you want lock to one marker
            // map.setView(data.location)
        } else {
            addMarkerCM(data.channel, {lat: data.location.lat, lng: data.location.lng})
            map.setView(data.location)
        }
    })


    // Cedar Maps init

    var cmOptions = {
        center: {lat: Tehran.lat, lng: Tehran.lng},
        scrollWheelZoom :false,
        zoomControl: true,
        zoom: 7,
        minZoom: 6,
        maxZoom: 17,
        legendControl: false,
        attributionControl: false
    }
    window.map = L.cedarmaps.map('map', 'https://api.cedarmaps.com/v1/tiles/cedarmaps.streets.json?access_token=8b5bc03a7ce664a403940ee68357e7c44240609e', cmOptions)

}


// Most useful Cedar Maps functions

window.addMarkerCM = function(id, location) {
    var markerOptions = {
        center: {lat: location.lat, lng: location.lng},
        iconOpts: {
            iconUrl: "https://injam.io/images/Marker-Red.svg",
            iconRetinaUrl: "https://injam.io/images/Marker-Red.svg",
            iconSize: [32, 44]
        }
    }
    var iconOptions = {
        iconUrl: markerOptions.iconOpts.iconUrl,
        iconRetinaUrl: markerOptions.iconOpts.iconRetinaUrl,
        iconSize: markerOptions.iconOpts.iconSize
    }
    var markerIcon = {
        icon: L.icon(iconOptions)
    }
    var marker = new L.marker(markerOptions.center, markerIcon)
    marker.addTo(map)
    markers[id] = marker
}



// Messaging Sample

window.connectForMessaging = function() {

    // Connect to Injam

    window.injam = new Injam(credentials)
    injam.connect()

    injam.on('subscribed', function (channel) {
        M.toast({html: 'Subscribed ' + channel})
    })

    injam.on('unsubscribed', function (channel) {
        M.toast({html: 'Unsubscribed ' + channel})
    })

    injam.on('rawData', function (data) {
        addMessage(data)
    })

}

if ($('#board').length) {
    connectForMessaging()
}



window.addMessage = function(data) {
    var name = data.channel || credentials.physical_id
    var message = data.data || data.message || data.body
    $('#board .messages').prepend('<div class="message-holder"><div class="message">'
        + '<span class="title">' + name + '</span>'
        + '<p class="body">' + message + '</p>'
    + '</div></div>')
}



// Subscribe

$('.sub').on('click', function(e) {
    e.preventDefault()
    var channel = $('#subscription').val()
    if (channel != '')
        injam.subscribe(channel)
})



// Unsubscribe

$('.unsub').on('click', function(e) {
    e.preventDefault()
    var channel = $('#subscription').val()
    if (channel != '')
        injam.unsubscribe(channel)
})



// Send Data

$('.send').on('click', function(e) {
    e.preventDefault()
    var data = $('#data').val()
    if (data != '') {
        injam.publish(data)
        addMessage(data)
    }
})