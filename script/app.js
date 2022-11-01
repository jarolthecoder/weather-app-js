const backgroundVideo = document.querySelector('.weather-video source');
const videoFilter = document.querySelector('.video-mask');

const searchForm = document.querySelector('.search-holder');
const searchInput = document.querySelector('.search-input');

const locationTimezone = document.querySelector('.location');
const temperature = document.querySelector('.temperature');
const weatherIcon = document.querySelectorAll('.weather-icon');
const tempDescription = document.querySelector('.temp-description');
const forecastList = document.querySelector('.forecast-list');
const minTemp = document.querySelector('.min-temp');
const maxTemp = document.querySelector('.max-temp');

// Weather API
const apiKey = '0cb85d1b78724adcb31145606222206';
let serviceUrl;
let urlParams;

// Gets forecast based on user search
searchForm.addEventListener('submit', (e)=> {
    const userInput = searchInput.value;
    const charAccepted = /^[A-Za-z]+$/;
    e.preventDefault();
    searchInput.value = '';
    urlParams = `key=${apiKey}&q=${userInput}&days=7`;

    if(userInput.match(charAccepted)) {
        getForecast();
        searchInput.setAttribute('placeholder', 'Search city...'); 
        searchInput.style.borderColor = '#d2d2d2';
        searchInput.classList.remove('invalid-input');
    }   else {
        searchInput.setAttribute('placeholder', 'Invalid city name');
        searchInput.style.borderColor = '#ff6262';
        searchInput.classList.add('invalid-input');
    }
});

// Gets forecast of the users current location on window load
window.addEventListener('load', ()=> {
    if(navigator.geolocation) {
        navigator.geolocation.getCurrentPosition( position => {
            const {latitude: lat, longitude: long} = position.coords;

            urlParams = `key=${apiKey}&q=${lat},${long}&days=7`;

            if (location.protocol === 'http:') {
                serviceUrl = 'http://api.weatherapi.com/v1/forecast.json?';
            } else {
                serviceUrl = 'https://api.weatherapi.com/v1/forecast.json?';
            }

            getForecast();
        });
    }
})

// Forecast API Call
function getForecast() {
    forecastList.innerHTML = '';
    fetch(`${serviceUrl}${urlParams}`, {method: 'GET',headers: {'Content-Type': 'application/json'}})
        .then(resp => { resp.json()
            .then(data => {
                // Data destructuring
                const {temp_f, condition} = data.current;
                const {name, country} = data.location;
                const {forecastday} = data.forecast;
                const {maxtemp_f, mintemp_f} = forecastday[0].day;
        
                // Current weather display
                locationTimezone.innerHTML = `${name}, ${country}`;
                temperature.innerHTML = `${Math.floor(temp_f)}°F`;
                tempDescription.innerHTML = condition.text;
                minTemp.innerHTML = `${Math.floor(mintemp_f)}°F`;
                maxTemp.innerHTML = `${Math.floor(maxtemp_f)}°F`;

                // Background video change based on weather condition
                switch (condition.text) {
                    case 'Sunny':
                    case 'Partly cloudy':
                    default:
                        backgroundVideo.src = './assets/sun.mp4';
                        videoFilter.style.background = 'linear-gradient(#303e8f0e, #2f96a3a5)';
                        break
                        
                    case 'Overcast':
                    case 'Cloudy':  
                    case 'Patchy rain possible':
                    case 'Patchy snow possible': 
                    case 'Patchy sleet possible':
                    case 'Patchy freezing drizzle possible':
                    case 'Thundery outbreaks possible':
                    case 'Mist':
                    case 'Fog':
                    case 'Freezing fog':
                        backgroundVideo.src = './assets/cloudy.mp4';
                        videoFilter.style.background = 'linear-gradient(#0e0e0e8a, #040404d5)';
                        break

                    case 'Rainy':
                    case 'Light rain':
                    case 'Moderate rain':
                    case 'Moderate rain at times':
                    case 'Patchy light rain"': 
                    case 'Patchy light drizzle':
                    case 'Light drizzle':
                    case 'Freezing drizzle':
                    case 'Heavy freezing drizzle':
                    case 'Light rain shower':
                    case 'Moderate or heavy rain shower':
                    case 'Torrential rain shower':
                    case 'Light sleet showers':
                    case 'Moderate or heavy sleet showers':
                    case 'Patchy light rain with thunder':
                    case 'Moderate or heavy rain with thunder':
                        backgroundVideo.src = './assets/cloudy-rain.mp4';
                        videoFilter.style.background = 'linear-gradient(#0000, #040404d4)'
                        break
                    
                    case 'Snow':
                    case 'Blowing snow':
                    case 'Blizzard':
                    case 'Light sleet':
                    case 'Moderate or heavy sleet':
                    case 'Patchy light snow':
                    case 'Light snow':
                    case 'Patchy moderate snow':
                    case 'Moderate snow':
                    case 'Patchy heavy snow':
                    case 'Heavy snow':
                    case 'Ice pellets':
                    case 'Patchy light snow with thunder':
                    case 'Moderate or heavy snow with thunder':
                        backgroundVideo.src = './assets/snow.mp4';
                        videoFilter.style.background = 'linear-gradient(#2f5da3c8, #1c2b6182)';
                        break

                    case 'Clear':
                        backgroundVideo.src = './assets/clear-night-2.mp4';
                        videoFilter.style.background = 'linear-gradient(#06071479, #03030ce5)';
                        break   
                }

                document.querySelector('video').load();
                document.querySelector('video').setAttribute("playsinline", "");
                document.querySelector('video').setAttribute("muted", "");
                document.querySelector('video').play();
                
                // Dynamic markup for each day
                forecastday.forEach( f => listMarkup(f));
                
                // First item of forecast list - Current day
                const day = document.querySelectorAll('.day');
                day[0].innerHTML = 'Today';
            });
        });
}

// Creates HTML markup for each forecast day
function listMarkup(f) {
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
                                        <span class="min-title">Min </span>
                                        <span class="card-min-temp">${Math.floor(f.day.mintemp_f)}°F</span>
                                    </p>
                                    <p>
                                        <span class="max-title">Max </span>
                                        <span class="card-max-temp">${Math.floor(f.day.maxtemp_f)}°F</span>
                                    </p>
                                </div>
                            `
}