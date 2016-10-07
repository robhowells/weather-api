var weatherAPI = (function ($) {

	/*
	 *  Configs / module set up.
	 * 	Add token generated from https://darksky.net/dev/
	 */

	var $weather = {
    	token: 'ADD_API_TOKEN_HERE',
    	defaultLatitude: '51.4545',
    	defaultLongitude: '2.5879', 
    	location: '',
    	data: ''
    }

    /*
	 *	Converts the temperature from 
	 *	degrees fahrenheit to celsius.
	 */

    var convertDegrees = function(fahrenheit) {
    	celsius = (fahrenheit -32) * 5 / 9;
		celsiusRounded = Math.round(celsius); 
		return celsiusRounded;
    };

    /*
	 *	Loops through the weather html block 
	 *	and populates the weather data.
	 */

	var populateWeather = function() {
		var weatherBlocks = document.getElementsByClassName('weather-block');
		for(var j = 0; j < weatherBlocks.length; j++) { 
			var weatherBlock = weatherBlocks[j],
				temperature = weatherBlock.querySelector('.weather-block-degrees'),
				summary = weatherBlock.querySelector('.weather-block-text');
			
			weatherBlock.classList.add($weather.data.currently.icon);
			temperature.innerHTML = convertDegrees($weather.data.currently.apparentTemperature) + '&deg;';
			summary.innerHTML = $weather.data.currently.summary;

		}
	};

    /*
	 *	Gets the user's location (if they allow access
	 *  and has browser support), otherwise use defaults.
	 */

	var getLocation = function(callback) {

		if(navigator.geolocation) { 

			var options = {
				enableHighAccuracy: true,
				timeout: 5000,
				maximumAge: 0
			};

			function success(pos) {
				var crd = pos.coords;
				$weather.location = crd.latitude + ',' + crd.longitude;
				callback();
			};

			function error(err) {
				console.warn('ERROR(' + err.code + '): ' + err.message);
				$weather.location = $weather.defaultLatitude + ',' + $weather.defaultLongitude;
				callback();
			};

			navigator.geolocation.getCurrentPosition(success, error, options);

	 	} else {
	 		$weather.location = $weather.defaultLatitude + ',' + $weather.defaultLongitude;
	 		callback();
	 	}

	};

	/*
	 *	Gets the data.
	 */

    var init = function() {

    	getLocation(function() {

			$weather.url = 'https://api.darksky.net/forecast/' + $weather.token + '/' + $weather.location;

			$.when(
			   	$.ajax({	
					type: 'GET',
				    url: $weather.url,
				    dataType: 'jsonp',
				    success: function(weather) {
				    	$weather.data = weather;
				    }
				})
			).then(function() {
				populateWeather();
			});


		});

    };

    return {
        init: init 
    };

})(jQuery);  
