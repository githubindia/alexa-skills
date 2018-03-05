var express = require('express');
var bodyParser = require('body-parser');
var app = express();
// Initialize the Alexa SDK
var Alexa = require('alexa-sdk');
app.use(bodyParser.json());

app.post('/', function(req, res) {
    console.log("request received");
    // Build the context manually, because Amazon Lambda is missing
    var context = {
        succeed: function (result) {
            console.log(result);
            res.json(result);
        },
        fail:function (error) {
            console.log(error);
        }
    };
    
    // Delegate the request to the Alexa SDK and the declared intent-handlers
    var alexa = Alexa.handler(req.body, context);
    alexa.appId = "amzn1.ask.skill.f90712ef-cf51-4276-b1b6-bbcac167b830";
    alexa.registerHandlers(handlers);
    alexa.execute();
});

app.get('/', function(req, res) {
    console.log("inside get");
});

var handlers = {
    'LaunchRequest': function() {

        this.emit('WheatherIntent');
    },
    'WeatherIntent': function() {

        var message = "Hello from node JS";

        this.response.speak(message);
        this.emit(':responseReady');

    },
    'SessionEndedRequest': function() {

        console.log('session ended!');
        this.attributes['endedSessionCount'] += 1;
    },
    'Unhandled': function () {
        this.emit(':ask', HelpMessage, HelpMessage);
    }
};

app.listen(3000);