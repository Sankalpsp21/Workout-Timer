var express = require('express');
var exphbs = require('express-handlebars');
const { MongoClient } = require('mongodb');
const axios = require("axios");

var mongoPassword = process.env.MONGO_PASSWORD;
const uri =
  'mongodb+srv://sankalpsp21:' +
  mongoPassword +
  "@quotable-workouts.dhewxoj.mongodb.net";

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function connect() {
  try {
    await client.connect();

    const database = client.db('workouts_db');
    const collection = database.collection('workouts');

    var app = express();
    var port = process.env.PORT || 3333;

    app.engine('handlebars', exphbs.engine({ defaultLayout: null }));
    app.set('view engine', 'handlebars');

    app.use(express.json());
    app.use(express.static('public'));

    app.get('/', async function (req, res) {
      try {
        const workoutData = await collection.find().toArray();
        res.status(200).render('workoutsPage', {
          workouts: workoutData
        });
      } catch (err) {
        console.error(err);
        res.status(500).send('Error retrieving workouts from DB');
      }
    });

    app.get('/workouts/:name', async function(req, res) {
      try {
        var name = req.params.name;

        const workout = await collection.findOne({ title: name });
        if (workout) {
          res.status(200).send(workout);
        } else {
          res.status(404).send('Workout not found');
        }
      } catch (err) {
        console.error(err);
        res.status(500).send('Error retrieving workout from DB');
      }
    });

    app.post('/workouts', async function (req, res) {
      try {
        var workout = {
          title: req.body.title,
          totalDuration: req.body.totalDuration,
          exercises: req.body.exercises
        };

        const result = await collection.insertOne(workout);
        res.status(200).send('Workout successfully added!');
      } catch (err) {
        console.error(err);
        res.status(500).send('Error adding workout to DB');
      }
    });

    app.get('/quote', function (req, res) {
      axios.get("https://api.quotable.io/random")
        .then(function(response) {
          var quote = response.data.content;
          var author = response.data.author;

          data = {
            quote: quote,
            author: author
          };

          res.status(200).send(data);
        })
        .catch(function (error) {
          console.error(error);
          res.status(500).send('Error retrieving quote');
        });
    });

    app.delete('/workouts', async function (req, res) {
      try {
        var workoutTitle = req.body.title;
        const result = await collection.deleteOne({ title: workoutTitle });
        if (result.deletedCount > 0) {
          res.status(200).send('Workout successfully removed!');
        } else {
          res.status(404).send('Workout not found');
        }
      } catch (err) {
        console.error(err);
        res.status(500).send('Error removing workout from DB');
      }
    });

    app.listen(port, function () {
      console.log("== Server is listening on port", port);
    });
  } catch (e) {
    console.error(e);
  }
}

connect();
