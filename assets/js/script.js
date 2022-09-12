var cardTitles = [$(".card-title-1"), $(".card-title-2"), $(".card-title-3"), $(".card-title-4"), $(".card-title-5")];
var cityEl = $("#city");
var todayEl = $("#today");

function geoApi(cityName) {
    var geoApiUrl = "http://api.openweathermap.org/geo/1.0/direct?q=" + cityName + "&limit=1&appid=" + apiKey;
    
    fetch(geoApiUrl)
        .then(function(response) {
            return response.json();
        })
        .then(function (data) {
            var lat = data[0].lat;
            var lon = data[0].lon;
            weatherApi(lat, lon);
        })
}

function weatherApi(lat, lon) {
    var weatherApiUrl = "https://api.openweathermap.org/data/3.0/onecall?lat=" + lat + "&lon=" + lon + "&units=imperial&exclude=minutely,hourly&appid=" + apiKey;
    fetch(weatherApiUrl)
        .then(function(response) {
            return response.json();
        })
        .then(function(data) {
            currentWeather(data);
            forecast(data);
        })
    return;
}

function currentWeather(data) {
    var icon = data.current.weather[0].icon;
    var imgUrl = "https://openweathermap.org/img/wn/" + icon + ".png";
    $("#today-icon").attr("src", imgUrl);
    $("#today-temp").text(data.current.temp);
    var windDir = data.current.wind_deg;
    var windCode = windDirConv(windDir);
    $("#today-wind").text(`${windCode} ${data.current.wind_speed} mph`);
    $("#today-hum").text(data.current.humidity);
    $("#today-uv").text(data.current.uvi);
}

function windDirConv(windDir) {
    if (windDir >= 348.75 || windDir < 11.25) {
        windDirCode = "N";
    } else if (windDir < 33.75) {
        windDirCode = "NNE";
    } else if (windDir < 56.25) {
        windDirCode = "NE";
    } else if (windDir < 78.75) {
        windDirCode = "ENE";
    } else if (windDir < 101.25) {
        windDirCode = "E";
    } else if (windDir < 123.75) {
        windDirCode = "ESE";
    } else if (windDir < 146.25) {
        windDirCode = "SE";
    } else if (windDir < 168.75) {
        windDirCode = "SSE";
    } else if (windDir < 191.25) {
        windDirCode = "S";
    } else if (windDir < 213.75) {
        windDirCode = "SSW";
    } else if (windDir < 236.25) {
        windDirCode = "SW";
    } else if (windDir < 258.75) {
        windDirCode = "WSW";
    } else if (windDir < 281.25) {
        windDirCode = "W";
    } else if (windDir < 303.75) {
        windDirCode = "WNW";
    } else if (windDir < 326.25) {
        windDirCode = "NW";
    } else if (windDir < 348.75) {
        windDirCode = "NNW";
    } else {
        console.log("error");
    } 
    return windDirCode;
}

function forecast(data) {
    return;
}


        
//         var imgUrl = "https://openweathermap.org/img/wn/" + icon + ".png";
//         $("#today-icon").attr("src", imgUrl);
//         $("#today-temp").text(data.main.temp);

//     });

todayEl.text(moment().format("(MM/DD/YYYY)"));

for (var i in cardTitles) {
    cardTitles[i].text(moment().add(1, "day").add(i, "day").format("MM/DD/YYYY"));
}

$("#search").on("click", function() {
    var cityName = $(this).siblings("#city").val();

    $("#today-city").text(cityName);

    if (!cityName) {
        return;
    }
    
    geoApi(cityName.replace(" ", "%20"));
    return;
})

