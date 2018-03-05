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
    alexa.registerHandlers(handlers);
    alexa.execute();
});

var handlers = {
    'LaunchRequest': function() {

        this.emit('HelloWorldIntent');
    },
    'HelloWorldIntent': function() {

        var message = "Hello from node JS";

        this.response.speak(message);
        this.emit(':responseReady');
    },
    'SessionEndedRequest': function() {

        console.log('session ended!');
        this.attributes['endedSessionCount'] += 1;
    }
};

app.listen(3000);