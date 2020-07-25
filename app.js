$('document').ready(function () {
// api key 93d2bcd8f73ead9c329f7c0c19abca09

// by latitude and longitude 
// api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&appid={your api key}

// by city and state
// api.openweathermap.org/data/2.5/weather?q={city name},{state code}&appid={your api key}

function apiCall (city, state){
    const queryURL = `api.openweathermap.org/data/2.5/weather?q=${city},${state}&appid=93d2bcd8f73ead9c329f7c0c19abca09`;
    $.ajax({
        url: queryURL,
        method: "GET"
      }).then(function(response) {
          console.log(response);
      });
}

apiCall('concord', 'nh');




});