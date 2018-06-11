var injamSdk = require('injam-sdk')



window.markers = []



// Put your physical id and application key

window.credentials = {
    physical_id: 'YOUR_PHYSICAL_ID',
    channels: [],
    application_key: 'YOUR_APPLICATION_KEY'
}



// Some locations

window.Asia = {
    lat: 23.800029,
    lng: 62.4289998
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
        var message = data.data || data.message || data.body
        $('#board .messages').prepend('<div class="message-holder"><div class="message">'
        + '<span class="title">' + data.channel + '</span>'
        + '<p class="body">' + message + '</p>'
        + '</div></div>')
    })

}

if ($('#board').length) {
    connectForMessaging()
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
    if (data != '')
        injam.publish(data)
})