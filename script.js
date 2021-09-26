var weatherHistoryArray = [];
var historyItemNumber = 5;
var userFormEl = document.querySelector('#search-form');
var cityInputEl = document.querySelector('#search-input');
var currentWeatherTitleEl = document.querySelector('#current-weather-title');
var currentWeatherContentEl = document.querySelector('#current-weather-content');
var fiveDayForcastCardsEl = document.querySelector('#five-day-forecast');
var historySearchEl = document.querySelector('#history-search');
var UpdateHistoryArray = true;

function capitalizeAString(str) {
    str = str.toLowerCase();
    var arr = str.split(" ");
    for (i = 0; i < arr.length; i++) {
        arr[i] = arr[i].charAt(0).toUpperCase() + arr[i].slice(1); //capitalize first letter of each word
    }
    return arr.join(" "); //return a capitalized string
}

//Use openweathermap's geo api to get lat, lon from a city name
function updateAndStoreWeatherInfo(city, updateHistoryArray) {
    var currenCityQueryUrl = "https://api.openweathermap.org/geo/1.0/direct?q=" + city + "&limit=1&appid=ee38b7171f375ee2a195d6472fbf2e98";
    var currenWeatherQueryUrl = "";

    fetch(currenCityQueryUrl)
        .then(function (response) {
            if (!response.ok) {
                console.log("Error:" + response.status);
                throw response.json();
            }
            return response.json();
        })
        .then(function (response) {
            //use Lan and Lon to call all weather info from one query
            currenWeatherQueryUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=" + response[0].lat + "&lon=" + response[0].lon + "&exclude=minutely,hourly&units=imperial&appid=ee38b7171f375ee2a195d6472fbf2e98";
            storeWeatherInfo(city, currenWeatherQueryUrl, updateHistoryArray);
        })
        .catch(function (error) {
            //console.log("Coordinate Error Message: " + error);
            alert("Coordinate Error Message: " + error);
        });

}

// store city names into an array for future search, render current city name, current weather and future weather
function storeWeatherInfo(city, currenWeatherQueryUrl, updateHistoryArray) {
    fetch(currenWeatherQueryUrl)
        .then(function (response) {
            if (!response.ok) {
                console.log("Error:" + response.status);
                throw response.json();
            }
            return response.json();
        })
        .then(function (response) {
            //if the array is bigger than a set max number, reduce it
            if (updateHistoryArray) {
                if (weatherHistoryArray.length >= historyItemNumber) {
                    weatherHistoryArray.pop();
                }
                //store the cityInfo array into the weatherHistory array
                weatherHistoryArray.unshift(city);
                //store into local storage
                localStorage.setItem("weather-info", JSON.stringify(weatherHistoryArray));
            }
            renderDashboard(city, response);
        })
        .catch(function (error) {
            //console.log("enter error message: " + error);
            alert("Weather Data Error Message: " + error);
        });
}

//render the dashboard given a city name, and it's object from api
function renderDashboard(city, weatherObj) {
    //render buttons //
    renderHistoryListItems();
    //Weather icon ref: https://openweathermap.org/weather-conditions
    var day0WeatherIcon = "http://openweathermap.org/img/wn/" + weatherObj.current.weather[0].icon + ".png";
    var day0TempC = ((weatherObj.current.temp - 32) * 5 / 9).toFixed(2);
    var day0WindSpeed = weatherObj.current.wind_speed;
    var day0Humidity = weatherObj.current.humidity;
    var day0UVIndex = weatherObj.current.uvi;
    var UVColor = getUVColor(day0UVIndex);
    var day0Date = moment.unix(weatherObj.current.dt).format("D/M/YYYY");
    //render day 0 info
    currentWeatherTitleEl.innerHTML = city + " (" + day0Date + ") <img src=\"" + day0WeatherIcon + "\">";
    currentWeatherContentEl.innerHTML = "Temp: " + day0TempC + "°C <br\>Wind: " + day0WindSpeed + " MPH<br\>Humidity: " + day0Humidity + " % <br\>UV Index:   ";
    currentWeatherContentEl.innerHTML += "<span class=\"rounded-3 px-3 text-white fw-bold\" style=\"background-color: " + UVColor + "\">" + day0UVIndex + "   </span>";

    // rander next 5 day's weather info cards //
    fiveDayForcastCardsEl.innerHTML = "";
    for (i = 1; i <= 5; i++) {
        var titleDate = document.createElement('p');
        titleDate.classList = 'fw-bold';
        titleDate.textContent = moment.unix(weatherObj.daily[i].dt).format("D/M/YYYY");

        var icon = document.createElement('img');
        icon.setAttribute('src', "http://openweathermap.org/img/wn/" + weatherObj.daily[i].weather[0].icon + ".png");

        var content = document.createElement('p');
        var tempC = ((weatherObj.daily[i].temp.day - 32) * 5 / 9).toFixed(2);
        var windSpeed = weatherObj.daily[i].wind_speed;
        var humidity = weatherObj.daily[i].humidity;
        content.innerHTML = 'Temp: ' + tempC + '°C <br>Wind: ' + windSpeed + ' MPH <br>Humidity: ' + humidity + ' %';

        var card = document.createElement('div');
        card.classList = "col bg-light border border-secondary rounded m-1 p-2";
        card.appendChild(titleDate);
        card.appendChild(icon);
        card.appendChild(content);
        fiveDayForcastCardsEl.appendChild(card);
    }
}

//render history list item as buttons using the city array
function renderHistoryListItems() {
    historySearchEl.textContent = "";
    for (i = 0; i < weatherHistoryArray.length; i++) {
        var btn = document.createElement('button');
        btn.classList = 'btn btn-secondary btn-block w-100 m-2 history-item';
        btn.textContent = weatherHistoryArray[i];
        btn.setAttribute('data-city', weatherHistoryArray[i]);
        historySearchEl.appendChild(btn);
    }
}

//return a string of colors to represent UV's condition
function getUVColor(UV) {
    if (0 <= UV && UV < 2) {
        return "#8DC443"; //green
    } else if (2 <= UV && UV < 7) {
        return "#FDD835"; //yellow
    } else if (7 <= UV && UV < 11) {
        return "#D1394A"; //red
    } else if (11 <= UV) {
        return "#954F71"; //purple
    }
}

function historyItemHandler(event) {
    event.preventDefault();
    var city = event.target.getAttribute('data-city');
    updateAndStoreWeatherInfo(city, true);
}

function formSubmitHandler(event) {
    event.preventDefault();

    var city = cityInputEl.value.trim();
    if (city) {
        city = capitalizeAString(city);
        updateAndStoreWeatherInfo(city, true);
    } else {
        alert("Please enter a city name.");
    }
}

function init() {
    var storedList = JSON.parse(localStorage.getItem("weather-info"));
    if (storedList !== null) {
        weatherHistoryArray = storedList;
        updateAndStoreWeatherInfo(weatherHistoryArray[0], false);
    } else {
        updateAndStoreWeatherInfo("Sydney", true);
    }
}

init();

userFormEl.addEventListener('submit', formSubmitHandler);
historySearchEl.addEventListener('click', historyItemHandler);
