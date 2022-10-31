const locationTimezone = document.querySelector('.location');
const temperature = document.querySelector('.temperature');
const weatherIcon = document.querySelectorAll('.weather-icon');
const tempDescription = document.querySelector('.temp-description');

const forecastList = document.querySelector('.forecast-list');
const minTemp = document.querySelector('.min-temp');
const maxTemp = document.querySelector('.max-temp');

function getForecast() {
    if(navigator.geolocation) {
        navigator.geolocation.getCurrentPosition( position => {
            const {latitude: lat, longitude: long} = position.coords;

            // Weather API
            let serviceUrl;
            const apiKey = '0cb85d1b78724adcb31145606222206';
            const urlParams = `key=${apiKey}&q=${lat},${long}&days=7`;

            if (location.protocol === 'http:') {
                serviceUrl = 'http://api.weatherapi.com/v1/forecast.json?';
            } else {
                serviceUrl = 'https://api.weatherapi.com/v1/forecast.json?';
            }
            
            fetch(`${serviceUrl}${urlParams}`)
                .then(resp => { resp.json()
                    .then(data => {
                        // Data destructuring
                        const {temp_f, condition} = data.current;
                        const {name, country} = data.location;
                        const {forecastday} = data.forecast;
                        const {maxtemp_f, mintemp_f} = forecastday[0].day;

                        // Current weather display
                        locationTimezone.innerHTML = `${name}, ${country}`;
                        temperature.innerHTML = Math.floor(temp_f) + '°' + 'F';
                        tempDescription.innerHTML = condition.text;
                        minTemp.innerHTML = Math.floor(mintemp_f) + '°';
                        maxTemp.innerHTML = Math.floor(maxtemp_f) + '°';
                        
                        // Dynamic markup for each forecast day
                        forecastday.forEach((f) => {
                            const weekDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
                            const date = new Date(`${f.date}`);
                            const currentDay = weekDays[date.getDay()];

                            const forecastItem = document.createElement('li');
                            forecastList.appendChild(forecastItem);
                            forecastItem.classList.add('weather-card');
                            forecastItem.innerHTML =`   <div class="card-left">
                                                            <h3 class="day">${currentDay}</h3>
                                                        </div>
                                                        <figure class="weather-icon-holder">
                                                                <img src="${f.day.condition.icon}" alt="" class="weather-icon">
                                                            </figure>
                                                        <div class="min-max-holder card-right">
                                                            <p>
                                                                <span class="temp-title min-title">Min </span>
                                                                <span class="card-min-temp">${Math.floor(f.day.mintemp_f)}°F</span>
                                                            </p>
                                                            <p>
                                                                <span class="temp-title max-title">Max </span>
                                                                <span class="card-max-temp">${Math.floor(f.day.maxtemp_f)}°F</span>
                                                            </p>
                                                        </div>
                                                    `
                        });
                        // First item of forecast list - Current day
                        const day = document.querySelectorAll('.day');
                        day[0].innerHTML = 'Today';
                    });
                });
        });
    }
}

getForecast();