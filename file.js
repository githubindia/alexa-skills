let response = deasync(function(callback){
    weather.cityWeather(city, callback);
})();//130