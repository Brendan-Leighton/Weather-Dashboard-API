$('document').ready(function () {

    // 
    //  HTML ELEMENTS
    // 
    const inputZipCode = $('#zip-search-input');
    const searchButton = $('#search-button');
    const searchHistoryList = $('#search-history-list');
    const cityDateHeader = $('#city-date-title-header');
    const todaysWeatherStatsDisplay = $('#today-weather-stats-display');
    const fiveDayForecastSection = $('#five-day-forecast');
    // 
    //  STORAGE
    // 
    let recentSearches = JSON.parse(localStorage.getItem("recentSearches"));
    // by city and state
    // api.openweathermap.org/data/2.5/weather?q={city name},{state code}&appid={your api key}

    // 
    //  OBJECTS
    // 
    const weatherAPI = {
        callByZip(zip) {
            queryURL = `https://api.openweathermap.org/data/2.5/weather?zip=${zip},us&units=imperial&appid=fe0750260bcd9b74a10be4cdcee06e63`;
            $.ajax({
                url: queryURL,
                method: "GET"
            }).then(function (response) {
                console.log('zip response', response);
                weatherAPI.saveSearch(response.name, zip);
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
            const currentTemp = $('<div>').text(`Temperature: ${response.current.temp} ${String.fromCharCode('8457')}`);
            const currentHumidity = $('<div>').text(`Humidity: ${response.current.humidity}%`);
            const windSpeed = $('<div>').text(`Wind Speed: ${response.current.wind_speed} MPH`);
            const uvIndex = $('<div>').text(`UV Index: ${response.current.uvi}`);
            container.append(weatherDescription, currentTemp, currentHumidity, windSpeed, uvIndex);
            todaysWeatherStatsDisplay.append(container);
        },
        displayFiveDayForecast(response) {
            dayDivCollection = $('<div>').addClass('day-div-grid');
            for (i = 0; i < 5; i++) {
                dayDiv = $(`<div>`).addClass('day-divs').attr('id', `day-div-${i}`);
                day = response.daily[i];
                date = $('<div>').text('placeholder');
                icon = $('<img>').attr('src', `http://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png`);
                temp = $('<div>').text(`Temp: ${day.temp.min} - ${day.temp.max} ${String.fromCharCode('8457')}`);
                humidity = $('<div>').text(`Humidity: ${day.humidity}%`);
                dayDiv.append(date, icon, temp, humidity);
                dayDivCollection.append(dayDiv);
            }
            fiveDayForecastSection.append(dayDivCollection);
        },
        loadSearches() {
            if ($('#new-search-list')) {
                $('#new-search-list').remove();
            }
            newSearchList = $('<ul>').attr('id', 'new-search-list');
            for (i = 0; i < recentSearches.length; i++) {
                newSearchListItem = $('<li>');
                const thisSearch = $('<button>').addClass('button').attr('type', 'button').text(recentSearches[i]).attr('id', 'search-history');
                newSearchListItem.append(thisSearch);
                newSearchList.append(newSearchListItem);
            }
            searchHistoryList.append(newSearchList);
        },
        saveSearch(cityName, zip) {  // cityName, zip
            // for (i = 0; i < recentSearches.length; i++) {
            //     if (!recentSearches.key('zipCode').includes(zip)) {
            //         weatherAPI.savedSearchObj.cityName = cityName;
            //         weatherAPI.savedSearchObj.zipCode = zip;
            //         recentSearches.push(weatherAPI.savedSearchObj);  // add new search to recent searches
            //         localStorage.setItem("recentSearches", JSON.stringify(recentSearches));
            //     }
            // }
            // weatherAPI.loadSearches();
            // if (!recentSearches.includes(zip)) {
                weatherAPI.savedSearchObj.cityName = cityName;
                weatherAPI.savedSearchObj.zipCode = zip;
                recentSearches.push(weatherAPI.savedSearchObj);  // add new search to recent searches
                localStorage.setItem("recentSearches", JSON.stringify(recentSearches));
            // }

                // recentSearches.push(newSearch);  // add new search to recent searches
                // localStorage.setItem("recentSearches", JSON.stringify(recentSearches));
                // weatherAPI.loadSearches();
        },
        savedSearchObj: {
            cityName: "",
            zipCode: ""
        }
    }

    

    const location = {
        getCurrentGeoLocationLatLong() {
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

    // 
    //  RUN ON START UP
    // 
    
    if (!Array.isArray(recentSearches)) {  // does an array already exist in local storage?
        recentSearches = [];
        // localStorage.setItem('recentSearches', []);
        console.log('local storage should have been created');
    } else {
        weatherAPI.loadSearches();
    }
    location.getCurrentGeoLocationLatLong();

    // 
    //  EVENT LISTENERS
    // 
    searchButton.on('click', function () {
        zip = inputZipCode.val();
        weatherAPI.callByZip(zip);
    });

});