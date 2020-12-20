$( "#submit_search" ).click( function( event ) {
    event.preventDefault();
    if ( $( "#city_search" ).val() ) {
        var newCity = $( "<div>" );
        newCity.addClass( "sidebar_city" );
        newCity.text( $( "#city_search" ).val() );
        $( "#city_search" ).val( "" );
        $( "#sidebar_main" ).append( newCity );

        $( ".sidebar_city" ).click( function() {
            console.log( $( this ).text() );
        });
    }
});