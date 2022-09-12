var cardTitles = [$(".card-title-1"), $(".card-title-2"), $(".card-title-3"), $(".card-title-4"), $(".card-title-5")];
var todayEl = $(".today");

todayEl.text(moment().format("(MM/DD/YYYY)"));
for (var i in cardTitles) {
    cardTitles[i].text(moment().add(1, "day").add(i, "day").format("MM/DD/YYYY"));
}
