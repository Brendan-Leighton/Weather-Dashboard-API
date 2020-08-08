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
            $.ajax({
                url: `https://api.openweathermap.org/data/2.5/weather?zip=${zip},us&units=imperial&appid=fe0750260bcd9b74a10be4cdcee06e63`,
                method: "GET"
            }).then(function (response) {
                console.log('zip response', response);
                weatherAPI.saveSearch(response.name, zip);
                cityDateHeader.text(`City: ${response.name}`);
                weatherAPI.callByLatLon(response.coord.lat, response.coord.lon);
            });
        },
        callByLatLon(latitude, longitude) {
            $.ajax({
                url: `https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&units=imperial&exclude=minutely,hourly&appid=fe0750260bcd9b74a10be4cdcee06e63`,
                method: "GET"
            }).then(function (response) {
                console.log(response);
                weatherAPI.displayFiveDayForecast(response);
                weatherAPI.displayTodaysWeather(response);
            });
        },
        displayTodaysWeather(response) {
            if ($('#containerDiv')) {
                $('#containerDiv').remove();
            }
            const container = $('<div>').attr('id', 'containerDiv');
            const weatherDescription = $('<div>').text(`Type: ${response.current.weather[0].description.toUpperCase()}`);
            const weatherIcon = $('<img>').attr('src', `http://openweathermap.org/img/wn/${response.current.weather[0].icon}@2x.png`);
            cityDateHeader.append(weatherIcon);
            const currentTemp = $('<div>').text(`Temperature: ${response.current.temp} ${String.fromCharCode('8457')}`);
            const currentHumidity = $('<div>').text(`Humidity: ${response.current.humidity}%`);
            const windSpeed = $('<div>').text(`Wind Speed: ${response.current.wind_speed} MPH`);
            const uvIndex = $('<div>').text(`UV Index: ${response.current.uvi}`);
            container.append(weatherDescription, currentTemp, currentHumidity, windSpeed, uvIndex);
            todaysWeatherStatsDisplay.append(container);
        },
        displayFiveDayForecast(response) {
            if ($('.day-div-grid')) {
                $('.day-div-grid').remove();
            }
            dayDivCollection = $('<div>').addClass('day-div-grid');
            for (i = 0; i < 5; i++) {
                dayDiv = $(`<div>`).addClass('day-divs').attr('id', `day-div-${i}`);
                day = response.daily[i];
                date = $('<div>').text(moment().add(i, 'days').format('ddd M/D'));
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
            newSearchList = $('<div>').attr('id', 'new-search-list');
            for (i = 0; i < recentSearches.length; i++) {
                newSearchListItem = $('<div>');
                const thisSearch = $('<button>').addClass('button').attr('type', 'button').text(recentSearches[i].cityName).attr('id', 'search-history-button').attr('data-name', recentSearches[i].zipCode);
                newSearchListItem.append(thisSearch);
                newSearchList.append(newSearchListItem);
            }
            searchHistoryList.append(newSearchList);
        },
        saveSearch(cityName, zip) {  // cityName, zip
            var isCopy = false;
            weatherAPI.savedSearchObj.cityName = cityName;
            weatherAPI.savedSearchObj.zipCode = zip;
            //  loop through the saved recentSearches to determine if this city already exists,
            for (var i = 0; i < recentSearches.length && !isCopy; i++) {
                if (recentSearches[i].zipCode == zip) {
                    return isCopy = true;  //  if so we return isCopy as true to,
                }

            }
            if (!isCopy) {  //  bypass this statement so the new city doesn't get added, else we,
                recentSearches.push(weatherAPI.savedSearchObj);  // add new search to recent searches
                localStorage.setItem("recentSearches", JSON.stringify(recentSearches));
                weatherAPI.loadSearches();
            }
            
        },
        savedSearchObj: {
            cityName: "",
            zipCode: ""
        },
        searchFromHistory() {
            thisZip = $(this).attr('data-name');
            weatherAPI.callByZip(thisZip);
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
        // localStorage.setItem("recentSearches", []);
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
    $(document).on('click', '#search-history-button', weatherAPI.searchFromHistory);

    console.log(moment());

});