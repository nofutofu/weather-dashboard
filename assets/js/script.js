var cityInput = document.querySelector('#search-bar');
var weatherData = document.querySelector('#weather-data');
var forecastEl = document.querySelector('#forecast');
var cityForm = document.querySelector('#city-form');
var stateInput = document.querySelector('#state-input');
let btnList = $('#btn-list');
var searchedYet = false;
let womp = 1;

var formLocationGenerator = function (event) {
    event.preventDefault();

    var city = cityInput.value.trim();
    var state = stateInput.value.trim();

    if (city, state) {
        cityInput.value = '';
        stateInput.value = ''; 
        getLocationData(city, state);
        cityHistory(city, state);
    } else if (city && !state){alert('Please enter a state.');
    } else if (state && !city){alert('Please enter a city.');
    } else {alert('Please enter location.');}
};

var getLocationData = function (city, state) {
    let locationUrl = "http://api.openweathermap.org/geo/1.0/direct?q=" + city + "," + state + ",US&appid=d8f7be0a2e28f048e4e507dffafc854d&units=imperial";
    fetch (locationUrl)
        .then(function (response) {
            if(response.ok) {
                response.json().then( function (data) {
                    let lat = data[0].lat;
                    let lon = data[0].lon;
                    getWeatherData(lat, lon);
                    fiveDayForecast(lat, lon);
                });
            } else {alert('There was an error retrieving location data');}
        })
}

var getWeatherData = function (lat, lon) {
    let apiUrl = "https://api.openweathermap.org/data/2.5/weather?lat=" + lat + "&lon=" + lon + "&appid=d8f7be0a2e28f048e4e507dffafc854d&units=imperial";
    fetch (apiUrl)
        .then(function (response) {
            if(response.ok) {
                response.json().then( function (data) {
                setText(data);
                }) 
            }
        })
}

var setText = function (data) {
    let placeholderTitle = document.querySelector('#placeholder-title');
    let cityName = document.querySelector('#city-name');
    let tempVal = document.querySelector('#temp');
    let windVal = document.querySelector('#wind');
    let humidityVal = document.querySelector('#humidity');
    let cloudDesc = document.querySelector('#cloud-coverage');
    if (placeholderTitle != null) {placeholderTitle.remove();}
    cityName.textContent = data.name;
    tempVal.textContent = "Temp: " + data.main.temp;
    windVal.textContent = "Wind: " + data.wind.speed + " MPH";
    humidityVal.textContent = "Humidity: " + data.main.humidity;
    cloudDesc.textContent = data.weather[0].description;
}

var fiveDayForecast = function (lat, lon) {

    let forecastUrl = "https://api.openweathermap.org/data/2.5/forecast?lat=" + lat + "&lon=" + lon + "&appid=d89372702a1dd70594cf41100a53ebe9&units=imperial"
    fetch (forecastUrl)
        .then(function (response) {
            if(response.ok)
                response.json().then( function (data){
                    let forecastTitle = document.querySelector('#forecast-title');
                    forecastTitle.textContent = '5 Day Forecast';
                    forecastText(data)
                })
        })
}

var forecastText = function (data) {
    let timeCheck = 39;
    let forecast = $('#forecast');
    burger = 1;
    if (!searchedYet) {
    for (var i = 0 ; timeCheck > i ; i++) {
        if (data.list[i].dt_txt.substring(11) == "00:00:00" ) {
            forecast.append('<div class="forecast-card forecast-card' + burger + '"></div>');
            forecast.children().eq(burger).append('<h4 class="forecast-date">' + data.list[i].dt_txt.substring(0,10) + '</h4>');
            forecast.children().eq(burger).append('<p class="forecast-temp">Temp: ' + data.list[i].main.temp + ' °F</p>');
            forecast.children().eq(burger).append('<p class="forecast-wind">Wind: ' + data.list[i].wind.speed + ' MPH</p>');
            forecast.children().eq(burger).append('<p class="forecast-humidity">Humidity: ' + data.list[i].main.humidity + '</p>');
            burger++;
            searchedYet = true;
        }
    }
} else {
    forecast.children().eq(1).remove();
    forecast.children().eq(1).remove();
    forecast.children().eq(1).remove();
    forecast.children().eq(1).remove();
    forecast.children().eq(1).remove();
    for (var i = 0 ; timeCheck > i ; i++) {
        if (data.list[i].dt_txt.substring(11) == "00:00:00" ) {
            forecast.append('<div class="forecast-card forecast-card' + burger + '"></div>');
            forecast.children().eq(burger).append('<h4 class="forecast-date">' + data.list[i].dt_txt.substring(0,10) + '</h4>');
            forecast.children().eq(burger).append('<p class="forecast-temp">Temp: ' + data.list[i].main.temp + ' °F</p>');
            forecast.children().eq(burger).append('<p class="forecast-wind">Wind: ' + data.list[i].wind.speed + ' MPH</p>');
            forecast.children().eq(burger).append('<p class="forecast-humidity">Humidity: ' + data.list[i].main.humidity + '</p>');
            burger++;
        }
     }
  }
}

for (let i = 0; i < 7; i++) {
    let storedCities = localStorage.getItem(`city${i}`)
    let storedStates = localStorage.getItem(`state${i}`)
    if (storedCities != null && storedStates != null) {
        btnList.append(`<button data-city="${storedCities}" data-state="${storedStates}" class="btn">${storedCities} ${storedStates}</button>`);
    }
}

const cityHistory = function (city, state) {
    let listItems = document.getElementById("btn-list").getElementsByTagName("button");
    let listLength = listItems.length;
    
    if (womp === 7) {womp = 1};

    if (listLength < 6) {
        localStorage.setItem(`city${womp}`, city);
        localStorage.setItem(`state${womp}`, state);
        let saveCity = localStorage.getItem(`city${womp}`);
        let saveState = localStorage.getItem(`state${womp}`);
        btnList.append(`<button data-city="${saveCity}" data-state="${saveState}" class="btn">${saveCity} ${saveState}</button>`);
        womp++;
        } else {
            btnList.children().eq(0).remove();
            localStorage.setItem(`city${womp}`, city);
            localStorage.setItem(`state${womp}`, state);
            let saveCity = localStorage.getItem(`city${womp}`);
            let saveState = localStorage.getItem(`state${womp}`);
            btnList.append(`<button data-city="${saveCity}" data-state="${saveState}" class="btn">${saveCity} ${saveState}</button>`);
            womp++;
        }
    }

const historySearch = function (event) {
    var city = event.target.getAttribute('data-city');
    var state = event.target.getAttribute('data-state');

    if (city, state) {
        getLocationData(city, state);
        cityInput.value = '';
        stateInput.value = ''; 
    }
}

btnList.on('click', historySearch);
cityForm.addEventListener('submit', formLocationGenerator);