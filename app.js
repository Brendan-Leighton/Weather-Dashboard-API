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
        call(location) {
            weatherAPI.saveSearch(location);
            queryURL = `https://api.openweathermap.org/data/2.5/weather?zip=${location},us&units=imperial&appid=fe0750260bcd9b74a10be4cdcee06e63`;
            $.ajax({
                url: queryURL,
                method: "GET"
            }).then(function (response) {
                weatherAPI.displayTodaysWeather(response);
            });
        },
        displayTodaysWeather(response) {
            const recentSearchHistory = $('#containerDiv');
            if (recentSearchHistory) {
                recentSearchHistory.remove();
                console.log(`should have removed search history`);
            }
            cityDateHeader.text(`City: ${response.name}`);
            const container = $('<div>').attr('id', 'containerDiv');
            const weatherDescription = $('<div>').text(`Type: ${response.weather[0].main}, ${response.weather[0].description}`);
            const weatherIcon = $('<img>').attr('src', `http://openweathermap.org/img/wn/${response.weather[0].icon}@2x.png`);
            cityDateHeader.append(weatherIcon);
            const degreeF = String.fromCharCode('8457');
            const currentTemp = $('<div>').text(`Temperature: ${response.main.temp}${degreeF}`);
            const currentHumidity = $('<div>').text(`Humidity: ${response.main.humidity}%`);
            const windSpeed = $('<div>').text(`Wind Speed: ${response.wind.speed} MPH`);
            const uvIndex = $('<div>').text(`UV Index: to be determined`);
            container.append(weatherDescription, currentTemp, currentHumidity, windSpeed, uvIndex);
            todaysWeatherStatsDisplay.append(container);
        },
        displayFiveDayForecast() {

        },
        loadSearches() {
            // function removeOldSearches() {
            //     const searchHistory = $('#search-history');
            //     if (searchHistory) {
            //         searchHistory.remove();
            //         removeOldSearches();
            //     }
            // }
            // removeOldSearches();
            for (i = 0; i < recentSearches.length; i++) {
                const thisSearch = $('<div>').text(recentSearches[i]).attr('id', 'search-history');
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
        weatherAPI.call(zip);
    });

    if (Array.isArray(recentSearches)) {  // does an array already exist in local storage?
        weatherAPI.loadSearches();
    } else {
        recentSearches = [];
    }

});