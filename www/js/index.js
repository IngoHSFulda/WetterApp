/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

// Wait for the deviceready event before using any of Cordova's device APIs.
// See https://cordova.apache.org/docs/en/latest/cordova/events/events.html#deviceready
document.addEventListener('deviceready', onDeviceReady, false);
let map;
let w;
let Latitude = undefined;
let Longitude = undefined;
let currentPositionMarker = undefined;
let icon = "data:image/png;base64,iVBORw0KGgo...CC";

function onDeviceReady() {
    // Cordova is now initialized. Have fun!
    let img = new Image();
    img.src = "./images/google_logo.gif";

    let options = {
        camera: {
            target: {lat: 0, lng: 0},
            zoom: 19
        }
    };let mapDiv = document.getElementById("map_canvas");
    console.log('Running cordova-' + cordova.platformId + '@' + cordova.version);
    map = plugin.google.maps.Map.getMap(mapDiv, options);
    //alert("test");

    // watchWeatherPosition();
    // Initialize the map view


    // You have to wait the MAP_READY event.
    map.one(plugin.google.maps.event.MAP_READY, onMapInit);
}

let getData = function (position) {
    let OpenWeatherAppKey = "5428936b1736e81627ddc139247ce7f8";
    Latitude = position.coords.latitude;
    Longitude = position.coords.longitude;
    let queryString =
        "https://maps.googleapis.com/maps/api/geocode/json?latlng="+position.coords.latitude+","+position.coords.longitude+"&key=";
    cordova.plugin.http.get(queryString, {
        id: '12',
        message: 'test'
    }, {Authorization: 'OAuth2: token'}, function (response) {
        let wetterdaten = JSON.parse(response.data);
        //alert(wetterdaten.name);
        //$('#city').text("work");
        let street = document.getElementById('street');
        let number = document.getElementById('number');
        let city = document.getElementById('city');
       // menu.innerHTML = (wetterdaten.address_components.long_name);
        //alert("Long Name:");
        //alert(wetterdaten.results[0].address_components[2].long_name);
        street.innerHTML = (wetterdaten.results[0].address_components[1].long_name);
        number.innerHTML = (wetterdaten.results[0].address_components[0].long_name);
        city.innerHTML = (wetterdaten.results[0].address_components[2].long_name);
        // alert(wetterdaten.weather.length);
      /*  if (wetterdaten.weather.length) {

            let wetter = document.getElementById('wetter');
            let iconcode = wetterdaten.weather[0].icon;
            let iconurl = "./img/clouds/" + iconcode + ".png";
            wetter.innerHTML = (wetterdaten.weather[0].description);
            let c = document.getElementById("wicon");

            c.setAttribute("src", iconurl);

        }*/
    }, function (response) {
        alert(response.error);
    });

}


let wetternow = function (position) {
    let OpenWeatherAppKey = "5428936b1736e81627ddc139247ce7f8";

    let queryString =
        'https://api.openweathermap.org/data/2.5/weather?lat='
        + Latitude+ '&lon=' + Longitude + '&appid=' + OpenWeatherAppKey + '&units=imperial';
    cordova.plugin.http.get(queryString, {
        id: '12',
        message: 'test'
    }, {Authorization: 'OAuth2: token'}, function (response) {
        let wetterdaten = JSON.parse(response.data);
        //alert(wetterdaten.name);
        //$('#city').text("work");


        // alert(wetterdaten.weather.length);
        if (wetterdaten.weather.length) {

            let wetter = document.getElementById('wetterbeschreibung-now');
            let iconcode = wetterdaten.weather[0].icon;
            let iconurl = "./img/clouds/" + iconcode + ".png";
            wetter.innerHTML = (wetterdaten.weather[0].description);
            let c = document.getElementById("wetternow");

            c.setAttribute("src", iconurl);

        }
    }, function (response) {
        alert(response.error);
    });

}
let wetter= function (position) {
    let OpenWeatherAppKey = "xxxxx";

    let queryString =
        'https://api.openweathermap.org/data/2.5/onecall?lat='
        + Latitude+ '&lon=' + Longitude + '&exclude=minutely,daily&appid=' + OpenWeatherAppKey ;
    cordova.plugin.http.get(queryString, {
        id: '12',
        message: 'test'
    }, {Authorization: 'OAuth2: token'}, function (response) {
        let wetterdaten = JSON.parse(response.data);
       // alert(wetterdaten.current.weather[0].icon);
        //$('#city').text("work");


        // alert(wetterdaten.weather.length);
       // if (wetterdaten.weather.length) {

            //
           //let iconcode = wetterdaten.weather[0].icon;
      //  alert(wetterdaten.current);
      //      alert(wetterdaten.current.weather);
        //
            let iconcodeN = wetterdaten.current.weather[0].icon;
            let iconcodeH = wetterdaten.hourly[1].weather[0].icon;

            let iconnow = "./img/clouds/" + iconcodeN + ".png";
            let iconhour = "./img/clouds/" + iconcodeH + ".png";

            let now = document.getElementById("wetternow");
            let hour = document.getElementById("wetterhour");

            now.setAttribute("src", iconnow);
            hour.setAttribute("src", iconhour);

            let wetterdnow = document.getElementById('wetterbeschreibung-now');
            let wetterdhour = document.getElementById('wetterbeschreibung-hour');

             wetterdnow.innerHTML = (wetterdaten.current.weather[0].description);
             wetterdhour.innerHTML = (wetterdaten.hourly[1].weather[0].description);

    }, function (response) {
        alert("Hallo "+response.error);
    });

}

let update1 = function (position) {
    Latitude = position.coords.latitude;
    Longitude = position.coords.longitude;

    getData(position);
    wetter(position);
    map.animateCamera({
        target: {
            lat: Latitude,
            lng: Longitude
        },
        zoom: 15
    });

}
function displayAndWatch(position) {
    // set current position
    setCurrentPosition(position);
    // watch position
    watchCurrentPosition(position);
}
let onMapSuccess = function () {

//map.setPosition(position.coords.latitude,position.coords.longitude)

    let  image = new Image();
    image.src = "./img/sonne.PNG";
    let canvas = document.createElement('canvas');
    let context = canvas.getContext('2d');
    let add_marker = null;

    context.drawImage(image, 0, 0);



    map.addMarker({
        'position': {
            lat: Latitude,
            lng: Longitude
        },
        'title': "Click me!",
        'snippet': 'Remove this marker.'
    }, function(marker) {


        w =  setInterval(sekundenanzeige(marker), 500000);

    });

}
function watchCurrentPosition(pos) {

    //update1(pos);

    let positionTimer = navigator.geolocation.watchPosition(
        function (position) { setMarkerPosition(currentPositionMarker,position);

        }, error, {maximumAge:600000, timeout:50000, enableHighAccuracy: true});

}
function setMarkerPosition(marker, position) {
    wetter(position.coords.latitude,position.coords.longitude);
    marker.setPosition(
        new plugin.google.maps.LatLng(
            position.coords.latitude,
            position.coords.longitude)

    );
    update1(position);
    map.animateCamera({
        target: {
            lat: position.coords.latitude,
            lng: position.coords.longitude
        },
        zoom: 15
    });
}
function error(){
}
function setCurrentPosition(pos) {

    update1(pos);
    map.addMarker({
        'position': new plugin.google.maps.LatLng(
            pos.coords.latitude,
            pos.coords.longitude
        ),

    }, function(marker) {
        currentPositionMarker = marker;
        watchCurrentPosition();
    });
    map.setCenter(new plugin.google.maps.LatLng(
        pos.coords.latitude,
        pos.coords.longitude
    ));


}
function sekundenanzeige(marker) {

    alert( marker.getPosition().lat);
    Latitude= position.coords.latitude;

    if(marker.getPosition().lat != Latitude || marker.getPosition().lng != Latitude)
        marker.remove();
    clearInterval(w);
}

let Error = function (error) {
    alert('UPDATE: ' + error.code + '\n' +
        'message: ' + error.message + '\n');
}
function onMapInit(map) {

    let option = {
        maximumAge:600000, timeout:5000, enableHighAccuracy: true};
    navigator.geolocation.getCurrentPosition( displayAndWatch , onError, option);
    //watchWeatherPosition();
    // watchCurrentPosition();

}
let onSuccess = function(position) {
    alert('Latitude: '          + position.coords.latitude          + '\n' +
        'Longitude: '         + position.coords.longitude         + '\n' +
        'Altitude: '          + position.coords.altitude          + '\n' +
        'Accuracy: '          + position.coords.accuracy          + '\n' +
        'Altitude Accuracy: ' + position.coords.altitudeAccuracy  + '\n' +
        'Heading: '           + position.coords.heading           + '\n' +
        'Speed: '             + position.coords.speed             + '\n' +
        'Timestamp: '         + position.timestamp                + '\n');
};

// onError Callback receives a PositionError object
//
function onError(error) {
    alert('code: '    + error.code    + '\n' +
        'message: ' + error.message + '\n');
}
