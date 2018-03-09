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
          if (jsonData.request.intent.slots.cityName.name == "cityName") {
            city = jsonData.request.intent.slots.cityName.value;
            var options = { 
                method: 'GET',
                url: 'http://samples.openweathermap.org/data/2.5/weather',
                qs: { 
                    "q":city,
                    "appid":'b6907d289e10d714a6e88b30761fae22'                    
                },
                json:true
            };
            request(options, function(err, response, body){
                console.log("inside request");
                console.log(JSON.stringify(response) + "response");
                outputSpeechText = "humidity is " + response.main.humidity + "with " + response.weather.description + ".";
                console.log(outputSpeechText);    
            });
            if (jsonData.request.dialogState == "STARTED") {
                    responseBody = {
                        "version": "1.0",
                        "response": {
                        "outputSpeech": {
                            "type": "PlainText",
                            "text": outputSpeechText
                        },
                        "card": {
                            "type": "Simple",
                            "title": "cityIntent",
                            "content": "Hello from JS."
                        },
                        "reprompt": {
                            "outputSpeech": {
                            "type": "PlainText",
                            "text": "Say a command"
                            }
                        },
                        "directives": [
                                {
                                    "type": "Dialog.Delegate"
                                }
                        ],
                        "shouldEndSession": false
                        }
                    };
                }
      }
    }
      } else {
      // Not a recognized type
      responseBody = {
        "version": "0.1",
        "response": {
          "outputSpeech": {
            "type": "PlainText",
            "text": "Could not parse data"
          },
          "card": {
            "type": "Simple",
            "title": "Error Parsing",
            "content": JSON.stringify(requestBody)
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
    }
    res.statusCode = 200;
    res.contentType('application/json');
    res.send(responseBody);
    });
  });

app.listen(port);