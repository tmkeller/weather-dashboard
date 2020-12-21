var APIkey = "d496986a7fe0f4f18c2555bc37b9566b";

$( "#submit_search" ).click( function( event ) {
    event.preventDefault();
    if ( $( "#city_search" ).val() ) {
        queryCurrentWeather( $( "#city_search" ).val(), APIkey, "imperial", true );
        $( "#city_search" ).val( "" );
    };
});

// Queries the OpenWeatherMap API for the current weather at the specified location, and updates the center "main" card with the data.
function queryCurrentWeather( cityName, apiKey, units, addListElement = false ) {

    var cwURL = `https://api.openweathermap.org/data/2.5/weather?q=${ cityName }&appid=${ apiKey }`;

    var lat;
    var lon;

    $.ajax({
        url: cwURL,
        method: "GET"
    }).then( function( cwResponse ) {
        lat = cwResponse.coord.lat;
        lon = cwResponse.coord.lon;

        var oneCallURL = `https://api.openweathermap.org/data/2.5/onecall?lat=${ lat }&lon=${ lon }&units=${ units }&appid=${ apiKey }`;

        $.ajax({
            url: oneCallURL,
            method: "GET"
        }).then( function( ocResponse ) {
            console.log( ocResponse );
            var d = new Date();
            var uvIndex = ocResponse.current.uvi;
            var temp = Math.round( ocResponse.current.temp * 10 ) / 10;
    
            // Update center card.
            $( "#main_card" ).text( "" );
            var headerH1 = $( "h1" ).text( `${ cwResponse.name } ${ d.getMonth() + 1 }/${ d.getDate() }/${ d.getFullYear() }` ).attr( "id", "content_header");

            var headerH1 = $( `<h1>${ cwResponse.name } ${ d.getMonth() + 1 }/${ d.getDate() }/${ d.getFullYear() }</h1>`);
            headerH1.attr( "id", "content_header" );
            var tempP = $( `<p>Temperature: ${ temp } °F</p>` );
            var humidityP = $( `<p>Humidity: ${ ocResponse.current.humidity }%</p>` );
            var windP = $( `<p>Wind speed: ${ ocResponse.current.wind_speed } MPH</p>` );
            var uvIndexP = $( `<p>UV Index: <span id="uv_index">${ uvIndex }</span></p>`);

            $( "#main_card" ).append( headerH1 );
            $( "#main_card" ).append( tempP );
            $( "#main_card" ).append( humidityP );
            $( "#main_card" ).append( windP );
            $( "#main_card" ).append( uvIndexP );
            if ( uvIndex < 3 ) {
                $( "#uv_index" ).css( "background-color", "green" );
            } else if ( uvIndex < 6 ) {
                $( "#uv_index" ).css( "background-color", "yellow" );
            } else if ( uvIndex < 8 ) {
                $( "#uv_index" ).css( "background-color", "orange" );
            } else {
                $( "#uv_index" ).css( "background-color", "red" );
            }

            $( "#forecast_header" ).text( "5-Day Forecast:" );
            $( "#card_row" ).text( "" );
            for ( var i = 0; i < 5; i++ ) {
                d = new Date( d );
                d.setDate( d.getDate() + 1 );
                console.log( ocResponse.daily[ i ], console.log( `${ d.getMonth() + 1 }/${ d.getDate() }/${ d.getFullYear() }` ) );
                var dailyCard = $( "<section>" );
                dailyCard.addClass( "daily_card col-md-2");
                var cardDateHeader = $( "<h5>" ).text( `${ d.getMonth() + 1 }/${ d.getDate() }/${ d.getFullYear() }` );
                var cardIcon = $( "<span>" ).text( "Icon Placeholder" );
                var cardTemp = $( "<p>" ).text( `Temp: ${ Math.round( ocResponse.daily[ i ].temp.day ) } °F` );
                var cardHumidity = $( `<p>Humidity: ${ ocResponse.daily[ i ].humidity }%</p>` );

                dailyCard.append( cardDateHeader );
                dailyCard.append( cardIcon );
                dailyCard.append( cardTemp );
                dailyCard.append( cardHumidity );
                $( "#card_row" ).append( dailyCard );
            }

            if ( addListElement ) {
                var newCity = $( "<li>" );
                newCity.addClass( "sidebar_city" );
                newCity.text( cwResponse.name );
                $( "#city_search" ).val( "" );
                $( "#card_list" ).append( newCity );
                $( ".sidebar_city" ).click( function() {
                    queryCurrentWeather( $( this ).text(), APIkey, "imperial" );
                });
            }

        }).catch( function() {
            inputAjaxError();
        });
    }).catch( function() {
        inputAjaxError();
    });
}

function inputAjaxError() {
    $( "#input_form_main" ).append( "<p id='error_msg' style='color: red;'>Could not find location</p>" );
    setTimeout( function() {
        $( "#error_msg" ).remove();
    }, 3000 );
}

function queryForecast( cityName, apiKey, units ) {

    var queryURL = `pro.openweathermap.org/data/2.5/forecast/hourly?q=${ cityName }&units=${ units}&appid=${ apiKey }`;

    $.ajax({
        url: queryURL,
        method: "GET"
    }).then( function( response ) {
        console.log( "That's an error." );
    })
}