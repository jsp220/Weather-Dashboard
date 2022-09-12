var cardTitles = [$(".card-title-1"), $(".card-title-2"), $(".card-title-3"), $(".card-title-4"), $(".card-title-5")];
var cityEl = $("#city");
var todayEl = $("#today");
var todayImgEl = $("#today-icon");
var todayTempEl = $("#today-temp")
var apiUrl = "https://api.openweathermap.org/data/2.5/weather?q=San%20Diego&units=imperial&APPID=3156f6ab42af6efa3211c272e0ef77df";

todayEl.text(moment().format("(MM/DD/YYYY)"));
for (var i in cardTitles) {
    cardTitles[i].text(moment().add(1, "day").add(i, "day").format("MM/DD/YYYY"));
}

fetch(apiUrl)
    .then(function (response) {
        return response.json();
    })
    .then(function (data) {
        var icon = data.weather[0].icon;
        console.log(data);
        
        var imgUrl = "https://openweathermap.org/img/wn/" + icon + ".png";
        todayImgEl.attr("src", imgUrl);
        todayTempEl.text(data.main.temp);

    })