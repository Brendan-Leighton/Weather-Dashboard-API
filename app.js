$('document').ready(function () {
    const inputCityName = $('#city-search-input');
    const inputStateName = $('#state-search-input');
    const searchHistorySection = $('#search-history-section');
    const cityDateHeader = $('#city-date-title-header');
    const todaysWeatherStatsDisplay = $('#today-weather-stats-display');
    const fiveDayForecastSection = $('#five-day-forecast');
    const fiveDayDivIteration = '#day-div-';  // add ${i} to end of this when iterating the 5 day forecast 


    // api key 93d2bcd8f73ead9c329f7c0c19abca09

    // by latitude and longitude 
    // api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&appid={your api key}

    // by city and state
    // api.openweathermap.org/data/2.5/weather?q={city name},{state code}&appid={your api key}

    const weatherAPI = {
        call() {
            queryURL = 'api.openweathermap.org/data/2.5/weather?q=London,uk&appid=fe0750260bcd9b74a10be4cdcee06e63';
            $.ajax({
                url: queryURL,
                method: "GET"
            }).then(function (response) {
                console.log(response);
            });
        }
    }

    weatherAPI.call();




});