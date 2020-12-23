// API key for OpenWeatherMap's API.
var APIkey = "d496986a7fe0f4f18c2555bc37b9566b";
// Create the cityStorage variable with the saved object in localStorage if it exists, otherwise make it a blank array.
var cityStorage = JSON.parse( localStorage.getItem( "cityStorage") ) || [];
// Add list items for previously searched cities for each city stored in cityStorage.
if ( cityStorage.length > 0 ) {
    for ( var i = 0; i < cityStorage.length; i++ ) {
        addListCity( cityStorage[ i ] );
    }
    addClickEvent();
};
// Add event handler to submit_search that queries the weather API.
$( "#submit_search" ).click( function( event ) {
    // Keeps the form from reloading.
    event.preventDefault();
    // Only triggers if a value has been entered into the form input.
    if ( $( "#city_search" ).val() ) {
        // Queries the weather API and adds the final parameter that makes the list elements populate as well.
        queryCurrentWeather( $( "#city_search" ).val(), APIkey, "imperial", true );
        // Clear the city search input field.
        $( "#city_search" ).val( "" );
    };
});

// Queries the OpenWeatherMap API for the current weather at the specified location, and updates the center "main" card with the data.
function queryCurrentWeather( cityName, apiKey, units, addListElement = false ) {
    // URL for the first weather query.
    var cwURL = `https://api.openweathermap.org/data/2.5/weather?q=${ cityName }&appid=${ apiKey }`;

    $.ajax({
        url: cwURL,
        method: "GET"
    }).then( function( cwResponse ) {
        // latitude and longitude values must be inputted into the onecall API query.
        var lat = cwResponse.coord.lat;
        var lon = cwResponse.coord.lon;

        var oneCallURL = `https://api.openweathermap.org/data/2.5/onecall?lat=${ lat }&lon=${ lon }&units=${ units }&appid=${ apiKey }`;

        $.ajax({
            url: oneCallURL,
            method: "GET"
        }).then( function( ocResponse ) {
            // Create a new Date object to display the date.
            var d = new Date();
            // Get the UV index.
            var uvIndex = ocResponse.current.uvi;
            var temp = Math.round( ocResponse.current.temp * 10 ) / 10;
    
            // Update center card.
            $( "#main_card" ).text( "" );
            var headerH1 = $( `<h1>${ cwResponse.name } ${ d.getMonth() + 1 }/${ d.getDate() }/${ d.getFullYear() }</h1>`);
            headerH1.attr( "id", "content_header" );
            var icon = $( "<img>" );
            icon.attr( "src", `https://openweathermap.org/img/wn/${ ocResponse.current.weather[ 0 ].icon }.png` );
            icon.attr( "id", "weather_icon");
            var tempP = $( `<p>Temperature: ${ temp } °F</p>` );
            var humidityP = $( `<p>Humidity: ${ ocResponse.current.humidity }%</p>` );
            var windP = $( `<p>Wind speed: ${ ocResponse.current.wind_speed } MPH</p>` );
            var uvIndexP = $( `<p>UV Index: <span id="uv_index">${ uvIndex }</span></p>`);
            // Add above elements to center card.
            $( "#main_card" ).append( headerH1 );
            $( "#main_card" ).append( icon );
            $( "#main_card" ).append( tempP );
            $( "#main_card" ).append( humidityP );
            $( "#main_card" ).append( windP );
            $( "#main_card" ).append( uvIndexP );
            // Changed background color depending on UV index of target city.
            if ( uvIndex < 3 ) {
                $( "#uv_index" ).css( "background-color", "green" );
            } else if ( uvIndex < 6 ) {
                $( "#uv_index" ).css( "background-color", "yellow" );
                $( "#uv_index" ).css( "color", "black" );
            } else if ( uvIndex < 8 ) {
                $( "#uv_index" ).css( "background-color", "orange" );
            } else {
                $( "#uv_index" ).css( "background-color", "red" );
            }
            // Change forecast header.
            $( "#forecast_header" ).text( "5-Day Forecast:" );
            $( "#card_row" ).text( "" );
            // For loop gets forecasts for the next 5 days.
            for ( var i = 0; i < 5; i++ ) {
                d = new Date( d );
                d.setDate( d.getDate() + 1 );
                var dailyCard = $( "<section>" );
                dailyCard.addClass( "daily_card col-md-2");
                var cardDateHeader = $( "<h5>" ).text( `${ d.getMonth() + 1 }/${ d.getDate() }/${ d.getFullYear() }` );
                var cardIcon = $( "<img>" ).addClass( "daily_icon" ).attr( "src", `https://openweathermap.org/img/wn/${ ocResponse.daily[ i ].weather[ 0 ].icon }.png` );
                var cardTemp = $( "<p>" ).text( `Temp: ${ Math.round( ocResponse.daily[ i ].temp.day ) } °F` );
                var cardHumidity = $( `<p>Humidity: ${ ocResponse.daily[ i ].humidity }%</p>` );

                dailyCard.append( cardDateHeader );
                dailyCard.append( cardIcon );
                dailyCard.append( cardTemp );
                dailyCard.append( cardHumidity );
                $( "#card_row" ).append( dailyCard );
            }
            // Only adds cities to the list if they don't already exist in the cityStorage array and if the function has been called from the index.
            if ( addListElement && cityStorage.indexOf( cwResponse.name ) == -1 ) {
                cityStorage.push( cwResponse.name );
                addListCity( cwResponse.name );
                addClickEvent();
            }
            // Update storage.
            localStorage.setItem( "cityStorage", JSON.stringify( cityStorage ) );

        }).catch( function() {
            // User's query didn't work for whatever reason.
            inputAjaxError();
        });
    }).catch( function() {
        // User likely entered a city that was not found.
        inputAjaxError();
    });
};
// Adds a red error message below the input if the user's city is not found.
function inputAjaxError() {
    $( "#input_form_main" ).append( "<p id='error_msg' style='color: red;'>Could not find location</p>" );
    setTimeout( function() {
        $( "#error_msg" ).remove();
    }, 3000 );
};
// Adds a city to the list. Called by for loop that populates the program and the main form input.
function addListCity( name ) {
    var newCity = $( "<li>" );
    newCity.addClass( "sidebar_city" );
    newCity.text( name );
    $( "#city_search" ).val( "" );
    $( "#card_list" ).append( newCity );
}
// Adds click events to all sidebar cities.
function addClickEvent() {
    $( ".sidebar_city" ).click( function() {
        queryCurrentWeather( $( this ).text(), APIkey, "imperial" );
    });
};
// Adds click and mouseup event to "Clear list" button.
$( "#clear_list" ).mousedown( function( event ) {
    $( this ).css( "background-color", "grey" );
    localStorage.removeItem( "cityStorage" );
    cityStorage = [];
    $( "#card_list" ).text( "" );
    // Prevents visual bug where the clear button stays dark.
    setTimeout( function() {
        $( "#clear_list" ).css( "background-color", "white" );
    }, 100 );
});
$( "#clear_list" ).mouseup( function( event ) {
    $( this ).css( "background-color", "white" );
});