//selecting all elements

const notificationElement = document.querySelector(".notification");
const iconElement = document.querySelector(".weather-icon")
const tempElement = document.querySelector(".temperature button");
const descElement = document.querySelector(".description p");
const locElement= document.querySelector(".location p");

//creating object for weather data
// const weather= {
//     temperature : {
//         value: 18,
//         unit: "Celsius"
//     },

//     description: "Few Clouds",
//     iconId: "01d",
//     city: "London",
//     country: "GB"
// };

const weather = {};

weather.temperature = {
    unit: "Celsius"
}

//Api request response
const kelvin = 273;
//Api key
const key = "82005d27a116c2880c8f0fcb866998a0";

function setPosition(position){
    let latitude = position.coords.latitude;
    let longitude = position.coords.longitude;
    getWeather(latitude, longitude);
}

function showError(error){
    notificationElement.style.display = "block";
    notificationElement.innerHTML = `<p> ${error.message} </p>`;
}

//getting geolocation of user if it's not then showing error message

if("geolocation" in navigator){
    navigator.geolocation.getCurrentPosition(setPosition, showError);
}
else{
    notificationElement.style.display = "block";
    notificationElement.innerHTML = "<p>Oops! Your Browser Doesn't Support Geolocation.</p>"
}

function getWeather(latitude, longitude){
    let api = `http://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${key}`;

    fetch(api)
        .then(function(response){
            let data = response.json();
            return data;
        })
        .then(function(data){
            weather.temperature.value = Math.floor(data.main.temp - kelvin);
            weather.description = data.weather[0].description;
            weather.iconId = data.weather[0].icon;
            weather.city = data.name;
            weather.country = data.sys.country;
        })
        .then(function(){
            displayWeather();
        });
}

function celsiusToFahrenheit( temperature ){
    return (temperature * 9/5)+32;
}

function displayWeather()
{
    //setting value dynamically as per api

    iconElement.innerHTML = `<img src="icons/${weather.iconId}.png" >`;
    tempElement.innerHTML = `<p>${weather.temperature.value} &#176;<span>C</span></p>`;
    descElement.innerHTML = weather.description;
    locElement.innerHTML = `${weather.city}, ${weather.country}`;
}

tempElement.addEventListener("click", function(){
    if(weather.temperature.value === undefined){
        return;
    }
    if(weather.temperature.unit === "Celsius"){
        let fahrenheit = Math.floor(celsiusToFahrenheit(weather.temperature.value));
        tempElement.innerHTML = `<p>${fahrenheit} &#176;<span>F</span></p>`;
        weather.temperature.unit = "Fahrenheit";
    }
    else{
        tempElement.innerHTML = `<p>${weather.temperature.value} &#176;<span>C</span></p>`;
        weather.temperature.unit = "Celsius";
    }
});

