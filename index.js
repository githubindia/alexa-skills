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
, port = process.env.PORT || 3000;

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
    // console.log(requestBody);
    // console.log(JSON.stringify(requestBody));

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
            "text": "Welcome to Echo Sample! Please say a command"
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
    }
    else if(jsonData.request.type == "IntentRequest")
    {
      var outputSpeechText = "";
      var cardContent = "";
      if (jsonData.request.intent.name == "WeatherIntent")
      {
        // The Intent "TurnOn" was successfully called
        outputSpeechText = "Congrats! You asked to turn on but it was not implemented";
        cardContent = "Successfully called " + jsonData.request.intent.name + ", but it's not implemented!";
      }
      else if (jsonData.request.intent.name == "TurnOff")
      {
        // The Intent "TurnOff" was successfully called
        outputSpeechText = "Congrats! You asked to turn off but it was not implemented";
        cardContent = "Successfully called " + jsonData.request.intent.name + ", but it's not implemented!";
      }else{
        outputSpeechText = jsonData.request.intent.name + " not implemented";
        cardContent = "Successfully called " + jsonData.request.intent.name + ", but it's not implemented!";
      }
      responseBody = {
          "version": "0.1",
          "response": {
            "outputSpeech": {
              "type": "PlainText",
              "text": outputSpeechText
            },
            "card": {
              "type": "Simple",
              "title": "Open Smart Hub",
              "content": cardContent
            },
            "shouldEndSession": false
          }
        };
    }else{
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