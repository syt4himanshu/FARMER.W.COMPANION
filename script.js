const apiKey = '36417e4de12644208a5164212242306'; 
const geoDBApiKey ='c95b093f93msh30379131f06e071p1db943jsncc696ece55ae'; 

document.getElementById('city').addEventListener('input', () => {
    const city = document.getElementById('city').value;
    if (city.length > 2) {
        getCitySuggestions(city);
    } else {
        document.getElementById('suggestions').classList.remove('active');
    }
});

document.getElementById('searchBtn').addEventListener('click', () => {
    const city = document.getElementById('city').value;
    getWeather(city);
});

async function getCitySuggestions(query) {
    try {
        const response = await fetch(`https://wft-geo-db.p.rapidapi.com/v1/geo/cities?namePrefix=${query}`, {
            method: 'GET',
            headers: {
                'X-RapidAPI-Key': geoDBApiKey,
                'X-RapidAPI-Host': 'wft-geo-db.p.rapidapi.com'
            }
        });
        if (!response.ok) throw new Error('Failed to fetch city suggestions');
        const data = await response.json();
        displayCitySuggestions(data.data);
    } catch (error) {
        console.error(error.message);
    }
}

function displayCitySuggestions(cities) {
    const suggestions = document.getElementById('suggestions');
    suggestions.innerHTML = '';
    cities.forEach(city => {
        const div = document.createElement('div');
        div.textContent = `${city.city}, ${city.country}`;
        div.addEventListener('click', () => {
            document.getElementById('city').value = city.city;
            suggestions.classList.remove('active');
            getWeather(city.city);
        });
        suggestions.appendChild(div);
    });
    suggestions.classList.add('active');
}

async function getWeather(city) {
    try {
        const response = await fetch(`https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city}`);
        if (!response.ok) throw new Error('City not found');
        const data = await response.json();
        displayWeather(data);
    } catch (error) {
        alert(error.message);
    }
}

function displayWeather(data) {
    const weatherInfo = document.getElementById('weatherInfo');
    weatherInfo.classList.add('active');

    weatherInfo.innerHTML = `
        <h2>${data.location.name}, ${data.location.country}</h2>
        <div class="temp">${data.current.temp_c}°C</div>
        <div class="description">${data.current.condition.text}</div>
        <div class="details">
            <div>
                <p><strong>Humidity:</strong> ${data.current.humidity}%</p>
                <p><strong>Pressure:</strong> ${data.current.pressure_mb} hPa</p>
            </div>
            <div>
                <p><strong>Wind Speed:</strong> ${data.current.wind_kph} kph</p>
                <p><strong>Wind Direction:</strong> ${data.current.wind_dir}</p>
            </div>
        </div>
    `;
}
