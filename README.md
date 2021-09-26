# 📖 Weather Dashboard

## 💡 The Dashboard

This is a server-side API dashboard using open API to get weather data. User can either enter a city name, or click on a history searched city to look up  it's current and future weather.

## 💡 The design

* There are 1 HTML, 1 CSS and 1 Javascript files.

* The index.html provides the fundamental layout of the web page using bootstrap.

* The script.js handles user clicks, store history data, retrive weather API data and render them on the dashboard.

* The style.css contains styles of the pages. Most styles are using bootstrap classes

* When the page loads, it automatically loads Sydney's weather if there's no local stored data. If there is, it loads the latest searched city data.

* If use clicks on the history data, it will use the city name and display the current and future weather (instead of display old weather data). So whenever a city is clicked, it calls the API again for the most updated data.

## 💡 Links

* Please go to [LINK](https://shaotangyen.github.io/weather-forecast/) to check out the final page.

* Or [Link](https://github.com/shaotangyen/weather-forecast) to go to GitHub page.


## 💡 Screenshots

The following animation demonstrates the Weather Dashboard functionality:

![A user search for a city and the dashboard shows the current and future weather.](./Assets/demo.gif)

---

© 2021 Made by Shao
