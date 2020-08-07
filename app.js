$('document').ready(function () {
    const inputZipCode = $('#zip-search-input');
    const searchButton = $('#search-button');
    const searchHistorySection = $('#search-history-section');
    const cityDateHeader = $('#city-date-title-header');
    const todaysWeatherStatsDisplay = $('#today-weather-stats-display');
    const fiveDayForecastSection = $('#five-day-forecast');
    const fiveDayDivIteration = '#day-div-';  // add ${i} to end of this when iterating the 5 day forecast 
    let recentSearches = JSON.parse(localStorage.getItem("recentSearches"));


    // api key 93d2bcd8f73ead9c329f7c0c19abca09

    // by latitude and longitude 
    // api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&appid={your api key}

    // by city and state
    // api.openweathermap.org/data/2.5/weather?q={city name},{state code}&appid={your api key}

    const weatherAPI = {
        callByZip(zip) {
            queryURL = `https://api.openweathermap.org/data/2.5/weather?zip=${zip},us&units=imperial&appid=fe0750260bcd9b74a10be4cdcee06e63`;
            $.ajax({
                url: queryURL,
                method: "GET"
            }).then(function (response) {
                console.log('zip response', response);
                weatherAPI.saveSearch(`${response.name}, ${zip}`);
                cityDateHeader.text(`City: ${response.name}`);
                weatherAPI.callByLatLon(response.coord.lat, response.coord.lon);
            });
        },
        callByLatLon(latitude, longitude) {
            queryURL = `https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&units=imperial&exclude=minutely,hourly&appid=fe0750260bcd9b74a10be4cdcee06e63`;
            $.ajax({
                url: queryURL,
                method: "GET"
            }).then(function (response) {
                console.log(response);
                weatherAPI.displayFiveDayForecast(response);
                weatherAPI.displayTodaysWeather(response);
            });
        },
        displayTodaysWeather(response) {
            const recentSearchData = $('#containerDiv');
            if (recentSearchData) {
                recentSearchData.remove();
                console.log(`should have removed recent search data`);
            }
            const container = $('<div>').attr('id', 'containerDiv');
            const weatherDescription = $('<div>').text(`Type: ${response.current.weather[0].description.toUpperCase()}`);
            const weatherIcon = $('<img>').attr('src', `http://openweathermap.org/img/wn/${response.current.weather[0].icon}@2x.png`);
            cityDateHeader.append(weatherIcon);
            const degreeF = String.fromCharCode('8457');
            const currentTemp = $('<div>').text(`Temperature: ${response.current.temp}${degreeF}`);
            const currentHumidity = $('<div>').text(`Humidity: ${response.current.humidity}%`);
            const windSpeed = $('<div>').text(`Wind Speed: ${response.current.wind_speed} MPH`);
            const uvIndex = $('<div>').text(`UV Index: ${response.current.uvi}`);
            container.append(weatherDescription, currentTemp, currentHumidity, windSpeed, uvIndex);
            todaysWeatherStatsDisplay.append(container);
        },
        displayFiveDayForecast(response) {
            
            for (i = 0; i < 5; i++) {
                dayDiv = $(`#day-div-${i}`);
                date = $('<div>');
                icon = $('<img>');
                temp = $('<div>');
                humidity = $('<div>');
                day = response.daily[i];
                date.text('placeholder');
                icon.attr('src', `http://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png`);
                temp.text(`Temp: ${day.temp.min}-${day.temp.max}`);
                humidity.text(`Humidity: ${day.humidity}%`);
                $(dayDiv).append(date, icon, temp, humidity);
            }
        },
        loadSearches() {
            for (i = 0; i < recentSearches.length; i++) {
                const thisSearch = $('<button>').addClass('button').attr('type', 'button').text(recentSearches[i]).attr('id', 'search-history');
                searchHistorySection.append(thisSearch);
            }
        },
        saveSearch(newSearch) {
            if (!recentSearches.includes(newSearch)) {
                recentSearches.push(newSearch);  // add new search to recent searches
                localStorage.setItem("recentSearches", JSON.stringify(recentSearches));
                weatherAPI.loadSearches();
            }

        }
    }


    searchButton.on('click', function () {
        zip = inputZipCode.val();
        weatherAPI.callByZip(zip);
    });

    if (Array.isArray(recentSearches)) {  // does an array already exist in local storage?
        weatherAPI.loadSearches();
    } else {
        recentSearches = [];
    }

    const location = {
        getLatLon() {
            navigator.geolocation.getCurrentPosition(this.assignLatLon);
        },
        assignLatLon(position) {
            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;
            console.log(`lat: ${latitude} \nlong: ${longitude}`);
            weatherAPI.callByLatLon(latitude, longitude);
            
            cityDateHeader.text(`City: Current Location`);
        }
    }
    location.getLatLon();

});