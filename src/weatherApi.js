var request = require("request");
 
module.exports = {
    'cityWeather' : function(city, callback){
 
        //console.log("The Final Message Utterance to send POST as Query to Service Now");
        var options = { 
            method: 'GET',
            url: 'http://samples.openweathermap.org/data/2.5/weather',
            qs: { 
                "q":city,
                "appid":'b6907d289e10d714a6e88b30761fae22'                    
            },
            json:true
        };
 
        request(options, function (error, response, body) {
          //if (error) throw new Error(error);
          callback(null, response);
        });
    }
}