var cardEl = [];
for (var i=1; i<6; i++) {
    var card = ".card-" + i;
    cardEl[i-1] = $(card);
}

var searchHist = [];
var buttonEl = [];
for (var i = 0; i < 5; i++) {
    recentId = "recent-" + eval(i+"+1");
    buttonEl[i] = $("<button type='submit' class='col-12 btn btn-secondary mb-1 recent-search'>")
    buttonEl[i].attr("id", recentId);
};

$(document).ready(function() {
    $("#recent-1").on("click", function() {
        var cityName = $(this).text();
        console.log(cityName);

        if (!cityName) {
            return;
        }
    
        fillDate();
    })
    
    $("#search").on("click", async function() {        
        var cityName = $(this).siblings("#city").val();
    
        if (!cityName) {
            return;
        }
    
        fillDate();
        
        
        var loc = await geoApi(cityName.replace(" ", "%20"));
        updateRecent(loc[2]);
        var data = await weatherApi(loc);
        currentWeather(data);
        forecast(data);
    
        $(".results").attr("style", "display: flex;");
        $(".wait").attr("style", "display: none;");
        return;
    })

    init();
})

// $("#search").on("click", async function() {
//     var cityName = $(this).siblings("#city").val();

//     if (!cityName) {
//         return;
//     }

//     fillDate();
    
    
//     var loc = await geoApi(cityName.replace(" ", "%20"));
//     updateRecent(loc[2]);
//     var data = await weatherApi(loc);
//     currentWeather(data);
//     forecast(data);

//     $(".results").attr("style", "display: flex;");

//     return;
// })

function init() {
    var searchHistory = localStorage.getItem("history");
    
    if (searchHistory == null) {
        searchHist = [];
    } else {
        searchHist = JSON.parse(searchHistory);
        searchHist.splice(5);
        for (i in searchHist) {
            buttonEl[i].text(searchHist[i]);
            $("#recent").append(buttonEl[i]);
        }
    }
}

function fillDate() {
    $("#today").text(moment().format("(MM/DD/YYYY)"));
    return;
}

function updateRecent(city) {
    searchHist.unshift(city);
    for (var i in searchHist) {
        if (i > 0 && searchHist[i] == searchHist[0]) {
            searchHist.splice(i, 1);
        }
    }
    searchHist.splice(5);
    for (var i in searchHist) {
        buttonEl[i].text(searchHist[i]);
        $("#recent").append(buttonEl[i]);
    }
    localStorage.setItem("history", JSON.stringify(searchHist));
}

async function geoApi(cityName) {
    var geoApiUrl = "http://api.openweathermap.org/geo/1.0/direct?q=" + cityName + "&limit=1&appid=" + apiKey;
    var loc = await fetch(geoApiUrl)
        .then(function(response) {
            return response.json();
        })
        .then(function (data) {
            $("#today-city").text(`${data[0].name}, ${data[0].country}`);            
            return [data[0].lat, data[0].lon, data[0].name];
        });
    
    return loc;
}

async function weatherApi(latLon) {
    var weatherApiUrl = "https://api.openweathermap.org/data/3.0/onecall?lat=" + latLon[0] + "&lon=" + latLon[1] + "&units=imperial&exclude=minutely,hourly&appid=" + apiKey;
    var data = await fetch(weatherApiUrl)
        .then(function(response) {
            return response.json();
        })
        // .then(function(data) {
        //     currentWeather(data);
        //     forecast(data);
        // })
    return data;
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
    todayUv(data.current.uvi);
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

function todayUv(uvi) {
    $("#today-uv").text(uvi);
    if (uvi < 2.5) {
        $("#today-uv").attr("style", "background-color: green");
    } else if (uvi < 5.5) {
        $("#today-uv").attr("style", "background-color: yellow");
    } else if (uvi < 7.5) {
        $("#today-uv").attr("style", "background-color: orange");
    } else {
        $("#today-uv").attr("style", "background-color: red");
    } 
    return;
}

function forecast(data) {
    

    for (var i in cardEl) {
        cardEl[i].empty();

        var cardTitleEl = $("<h5 class='card-title fw-bold'>");        
        cardTitleEl.addClass("card-title fw-bold");
        cardTitleEl.text(moment().add(1, "day").add(i, "day").format("MM/DD/YYYY"));
        
        var imgEl = $("<img alt='weather icon'>");
        var imgUrl = "https://openweathermap.org/img/wn/" + data.daily[i].weather[0].icon + ".png";
        imgEl.attr("src", imgUrl);

        var lowTempEl = $("<p>");
        var minTemp = data.daily[i].temp.min;
        lowTempEl.text(`Low: ${minTemp} °F`);
        
        var highTempEl = $("<p>");
        var maxTemp = data.daily[i].temp.max;
        highTempEl.text(`High: ${maxTemp} °F`);

        var windEl = $("<p>");
        var windDir = data.daily[i].wind_deg;
        var windCode = windDirConv(windDir);
        windEl.text(`Wind: ${windCode} ${data.daily[i].wind_speed} mph`);
        
        var humEl = $("<p>");
        humEl.text(`Humidity: ${data.daily[i].humidity} %`);

        cardEl[i].append(cardTitleEl, imgEl, lowTempEl, highTempEl, windEl, humEl);
    }

    return;
}

// search when enter is hit
// recent searches shuold be functional buttons