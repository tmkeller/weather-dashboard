var APIkey = "d496986a7fe0f4f18c2555bc37b9566b";

$( "#submit_search" ).click( function( event ) {
    event.preventDefault();
    if ( $( "#city_search" ).val() ) {
        var newCity = $( "<li>" );
        newCity.addClass( "sidebar_city" );
        newCity.text( $( "#city_search" ).val() );
        $( "#city_search" ).val( "" );
        $( "#card_list" ).append( newCity );

        $( ".sidebar_city" ).click( function() {
            console.log( $( this ).text() );
        });
    }
});

function queryCurrentWeather( cityName, apiKey, units ) {

    var cwURL = `https://api.openweathermap.org/data/2.5/weather?q=${ cityName }&appid=${ apiKey }`;

    var lat;
    var lon;

    $.ajax({
        url: cwURL,
        method: "GET"
    }).then( function( cwResponse ) {
        console.log( cwResponse );
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
    
            var centerCard = $( "<section>" ).attr( "id", "main_card" );
            var cityP = $( `<h1>${ cwResponse.name } ${ d.getMonth() + 1 }/${ d.getDate() }/${ d.getFullYear() }</h1>`);
            var tempP = $( `<p>Temperature: ${ temp } °F<p>` );
            var humidityP = $( `<p>Humidity: ${ ocResponse.current.humidity }%</p>` );
            var windP = $( `<p>Wind speed: ${ ocResponse.current.wind_speed } MPH</p>` );
            var uvIndexP = $( `<p>UV Index: <span id="uv_index">${ uvIndex }</span></p>`);
    
            $( centerCard ).append( cityP );
            $( centerCard ).append( tempP );
            $( centerCard ).append( humidityP );
            $( centerCard ).append( windP );
            $( centerCard ).append( uvIndexP );
            $( "#content_main" ).text( "" );
            $( "#content_main" ).append( centerCard );
            if ( uvIndex < 3 ) {
                $( "#uv_index" ).css( "background-color", "green" );
            } else if ( uvIndex < 6 ) {
                $( "#uv_index" ).css( "background-color", "yellow" );
            } else if ( uvIndex < 8 ) {
                $( "#uv_index" ).css( "background-color", "orange" );
            } else {
                $( "#uv_index" ).css( "background-color", "red" );
            }
        });
    });
}

function queryForecast( cityName, apiKey, units ) {

    var queryURL = `pro.openweathermap.org/data/2.5/forecast/hourly?q=${ cityName }&units=${ units}&appid=${ apiKey }`;

    $.ajax({
        url: queryURL,
        method: "GET"
    }).then( function( response ) {
        console.log( response );
    })
}

queryCurrentWeather( "Seattle", APIkey, "imperial" );