var request = require("request");
 
module.exports = {
    'cityWeather' : function(city, callback){
        //http://api.openweathermap.org/data/2.5/weather?q=chennai&appid=4d81047a5d639a9baf2ca66e875c0069
        //console.log("The Final Message Utterance to send POST as Query to Service Now");
        var options = { 
            method: 'GET',
            url: 'http://api.openweathermap.org/data/2.5/weather',
            qs: { 
                "q":city,
                "appid":'4d81047a5d639a9baf2ca66e875c0069'                    
            },
            json:true
        };
 
        request(options, function (error, response, body) {
          //if (error) throw new Error(error);
          callback(null, response);
        });
    }
}