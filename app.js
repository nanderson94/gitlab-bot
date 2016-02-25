// Load our npm modules
var request = require('request');
var Gitlab = require('node-gitlab');
var Datastore = require('nedb');
var config = require('./config.json');
var express = require('express');
var bodyParser = require('body-parser');
var reply = require('./lib/slack-reply.js');
var commands = require('/lib/commands.js');

// Initalize nedb
var db = {};
db.git = new Datastore({filename: config['db-path']+"/git.db", autoload: true});


// Initalize express
var app = express();

// Initalize middleware to process Slack's request
// app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

function hr(err, res, body) {
  console.log(err);
  console.log(body);
}

app.post('/slack', function(req, res) {
  console.log(req.body);
  if (req.body['token'] != config['token']) {
    res.send("This URL is for bots only! Please go to https://srct.gmu.edu");
  } else {
    var incoming = req.body.text.split(req.body.trigger_word)[1].trim();
    var parts = incoming.split(" ");
    switch (parts[0]) {
      case "register":
      case "reg":
        if (typeof parts[1] == "undefined") {
          reply(req.body.channel_name, {text: "Purpose: Registers a gitlab repository to this channel.\nUsage: git: register <REPLACEME>"}, hr);
        } else {
          reply(req.body.channel_name, {text: "Not implemented"}, hr);
        }
        break;
      case "info":
        reply(req.body.channel_name, {text: "This will show you some basic information about the repository registered to this channel"}, hr)
        break;
      case "issue":
        if (typeof parts[1] == "undefined") {
          reply(req.body.channel_name, {text: "Purpose: Shows information about an issue.\nUsage: git: issue <number>"}, hr)
        } else {
          reply(req.body.channel_name, {text: "This will be information about the issue you requested."}, hr);
        }
        break;
      case "pullrequest":
      case "pr":
        if (typeof parts[1] == "undefined") {
          reply(req.body.channel_name, {text: "Purpose: Shows information about a pull request.\nUsage: git: pullrequest|pr <number>"}, hr);
        } else {
          reply(req.body.channel_name, {text: "This will show information about a pull request" }, hr);
        }
        break;
      case "help":
      default:
        reply(req.body.channel_name, {text: "Oh boy I need to find a better way to handle help documentation" }, hr);
        break;
    }

    // reply("#"+req.body['channel_name'], {text:"Hi", text:"Hello"}, hr);
    res.send("boop");
  }
});

var server = app.listen(config['port']);
  

