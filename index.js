// var express = require('express');
// var bodyParser = require('body-parser');
// var app = express();
// // Initialize the Alexa SDK
// var Alexa = require('alexa-sdk');

// var port = process.env.PORT || 3000;
// app.use(bodyParser.json());

// app.post('/', function(req, res) {
//     //console.log("Request : " + JSON.stringify(req.body));
//     // Build the context manually, because Amazon Lambda is missing
//     var context = {
//         succeed: function (result) {
//             console.log(result);
//             res.send(result);
//         },
//         fail:function (error) {
//             console.log(error);
//         }
//     };
    
//     // Delegate the request to the Alexa SDK and the declared intent-handlers
//     var alexa = Alexa.handler(req.body, context);
//     alexa.appId = "amzn1.ask.skill.f90712ef-cf51-4276-b1b6-bbcac167b830";
//     alexa.registerHandlers(handlers);
//     alexa.execute();
// });

// app.get('/', function(req, res) {
//     console.log("App Running!");
// });

// var handlers = {
//     'LaunchRequest': function() {
//         this.attributes['speechOutput'] = "Hello, I am Launch Request. Put Skill name here. How can I help?"
//         this.attributes['repromptSpeech'] = "Are you there?"
//         this.emit(":ask", this.attributes['speechOutput'], this.attributes['repromptSpeech']);
        
//     },

//     'WeatherIntent': function() {
//         var message = "Hello from node JS";
//         this.response.speak(message);
//         this.emit(':responseReady');
//     },

//     'SessionEndedRequest': function() {
//         console.log('session ended!');
//         this.attributes['endedSessionCount'] += 1;
//     },

//     'Unhandled': function () {
//         this.emit(':ask', HelpMessage, HelpMessage);
//     }
// };

// app.listen(port);
// console.log("Server Running Successfully at port " + port);

var express = require('express')
, app = express()
, server = require('http').createServer(app)
, deasync = require('deasync')
, weather = require('./src/weatherApi.js')
, port = process.env.PORT || 3000
, request = require('request');

// Creates the website server on the port #

// Handles the route for echo apis
app.post('/webhook', function(req, res){
  var requestBody = "";

  // Will accumulate the data
  req.on('data', function(data){
    requestBody+=data;
  });

  // Called when all data has been accumulated
  req.on('end', function(){
    var responseBody = {};

    // parsing the requestBody for information
    var jsonData = JSON.parse(requestBody);
    if(jsonData.request.type == "LaunchRequest")
    {
      // crafting a response
      responseBody = {
        "version": "0.1",
        "response": {
          "outputSpeech": {
            "type": "PlainText",
            "text": "Welcome to Shubham's Stormy weather assistant! Please say a command."
          },
          "card": {
            "type": "Simple",
            "title": "Opened",
            "content": "You started the Node.js Echo API Sample"
          },
          "reprompt": {
            "outputSpeech": {
              "type": "PlainText",
              "text": "Say a command"
            }
          },
          "shouldEndSession": false
        }
      };
    } else if(jsonData.request.type == "IntentRequest")
    {
      var outputSpeechText = "";
      var cardContent = "";
      if (jsonData.request.intent.name == "WeatherIntent")
      {
        //response modified
        // The Intent "TurnOn" was successfully called
        responseBody = {
        "version": '1.0',
        "response": {
            "shouldEndSession": true,
            "outputSpeech": { "type": 'SSML', "ssml": '<speak> Hello from node JS </speak>' } 
        },
        "sessionAttributes": {},
        "userAgent": 'ask-nodejs/1.0.25 Node/v6.10.0'
    }
    } else if (jsonData.request.intent.name == "cityIntent") {
          if (typeof jsonData.request.intent.slots.cityName.value != "undefined") {
            var city = jsonData.request.intent.slots.cityName.value;
            if (jsonData.request.dialogState == "STARTED") {
                //var outputSpeechText = "humidity is " + response.body.main.humidity + " with " + response.body.weather[0].description + ".";
                responseBody = {
                  "version": "1.0",
                  "response": {
                  "directives": [
                    {
                      "type": "Dialog.Delegate",
                      "updatedIntent": {
                        "name": "cityIntent",
                        "confirmationStatus": "NONE",
                        "slots": {
                          "cityName": {
                            "name": "cityName",
                            "value": city,
                            "confirmationStatus": "NONE"
                          }
                        }
                      }
                    }
                  ],
                  "shouldEndSession": false
                  }
              };
            } else if (jsonData.request.dialogState == "IN_PROGRESS" && jsonData.request.intent.slots.cityName.confirmationStatus == "CONFIRMED") {
              let response = deasync(function(callback){
                weather.cityWeather(city, callback);
              })();

              var outputSpeechText = "humidity is " + response.body.main.humidity + " with " + response.body.weather[0].description + ".";
              responseBody = {
                "version": '1.0',
                "response": {
                    "shouldEndSession": true,
                    "outputSpeech": { "type": 'SSML', "ssml": '<speak>' + outputSpeechText + '</speak>' } 
                },
                "sessionAttributes": {},
                "userAgent": 'ask-nodejs/1.0.25 Node/v6.10.0'
            }
            }
      } else {
        responseBody = {
          "version": "1.0",
          "response": {
          "directives": [
            {
              "type": "Dialog.Delegate",
              "updatedIntent": {
                "name": "cityIntent",
                "confirmationStatus": "NONE",
                "slots": {
                  "cityName": {
                    "name": "cityName",
                    "confirmationStatus": "NONE"
                  }
                }
              }
            }
          ],
          "shouldEndSession": false
          }
      };
      }
    }
      }
    res.statusCode = 200;
    res.contentType('application/json');
    res.send(responseBody);
    });
  });

app.listen(port);