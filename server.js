// var path = require('path');
var fs = require('fs');
var express = require('express');
var exphbs = require('express-handlebars');
const amqp = require("amqplib/callback_api");
const axios = require("axios");

var workoutData = require('./workoutData.json')

//Setting up the engine
var app = express();
var port = process.env.PORT || 3333;


app.engine('handlebars', exphbs.engine({ defaultLayout: null }))
app.set('view engine', 'handlebars')

app.use(express.json())

//Ensures that the css and script files are accesible
app.use(express.static('public'));


//Handles the home page
app.get('/', function (req, res) {
  res.status(200).render('workoutsPage', {
    workouts: workoutData
  })
})

//Getting a specific workout
app.get('/workouts/:name', function(req, res) {

  var name = req.params.name.toLowerCase();

  for(var i = 0; i < workoutData.length; i++) {
    if(workoutData[i].title.toLowerCase() == name) {
      res.status(200).send(workoutData[i]);
      return;
    }
  }
})

//Adding workout to the database
app.post('/workouts', function (req, res) {
  var workout = req.body

  var workout = {
    title: req.body.title,
    totalDuration: req.body.totalDuration,
    exercises: req.body.exercises
  }


  workoutData.push(workout)



  fs.writeFile(
    './workoutData.json',
    JSON.stringify(workoutData, null, 2),
    function (err) {
      if (err) {
        res.status(500).send("Error writing workout to DB")
      } else {
        res.status(200).send("Workout successfully added!!!!!")
      }
    }
  )

})

//Requests quote from the microservice
app.get('/quote', function (req, res) {
  axios
      .get("https://api.quotable.io/random")
      .then(function(response) {
        var quote = response.data.content;
        var author = response.data.author;
        console.log(quote + " - " + author);

        data = {
          quote: quote,
          author: author
        }

        res.status(200).send(data);
      }) 
})

app.delete('/workouts', function (req, res) {
  var workoutTitle = req.body.title

  for(var i = 0; i < workoutData.length; i++) {
    if(workoutData[i].title == workoutTitle) {
      workoutData.splice(i, 1)
      break
    }
  }

  fs.writeFile(
    './workoutData.json',
    JSON.stringify(workoutData, null, 2),
    function (err) {
      if (err) {
        res.status(500).send("Error removing workout from DB")
      } else {
        res.status(200).send("Workout successfully removed!!!!!")
      }
    }
  )
})

app.listen(port, function () {
  console.log("== Server is listening on port", port);
})




