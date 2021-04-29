
// Load the modules
var express = require('express'); //Express - a web application framework that provides useful utility functions like 'http'
var app = express();
var bodyParser = require('body-parser'); // Body-parser -- a library that provides functions for parsing incoming requests
app.use(bodyParser.json());              // Support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // Support encoded bodies
const axios = require('axios');
const qs = require('query-string');
const { response } = require('express');

// Set the view engine to ejs
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/'));// Set the relative path; makes accessing the resource directory easier

//Create Database Connection

var pgp = require('pg-promise')();
const dev_dbConfig = {
	host: 'db',
	port: 5432,
	database: process.env.POSTGRES_DB,
	user: process.env.POSTGRES_USER,
	password: process.env.POSTGRES_PASSWORD
};
const isProduction = process.env.NODE_ENV === 'production';
const dbConfig = isProduction ? process.env.DATABASE_URL : dev_dbConfig;
// fixes: https://github.com/vitaly-t/pg-promise/issues/711
if (isProduction) {
	pgp.pg.defaults.ssl = {rejectUnauthorized: false};
}

const db = pgp(dbConfig);

// set the view engine to ejs
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/'));//This line is necessary for us to use relative paths and access our resources directory


// Home page - DON'T CHANGE
app.get('/', function(req, res) {
  axios.get('http://www.omdbapi.com/?t=Avengers&apikey=b719e2cd&')
  res.render('pages/main', {
    my_title: "Search",
    items: '',
    error: false,
    message: ''
  });
});

//to request data from API for given search criteria
//TODO: You need to edit the code for this route to search for movie reviews and return them to the front-end
app.post('/get_feed', function(req, res) {
  var title = req.body.title; //TODO: Remove null and fetch the param (e.g, req.body.param_name); Check the NYTimes_home.ejs file or console.log("request parameters: ", req) to determine the parameter names
  var displayMessage = req.body.message;

  if(title) {
    axios({
      	url: `http://www.omdbapi.com/?t=` +title+ `&apikey=b719e2cd`,
        method: 'GET',
        dataType:'json',
      })
        .then(info => {
          
          console.log(info.data);
          //res.send(info["Search"][0][Title]);

          res.render('pages/main',{
            my_title: "Movie Poster",
            items: info.data,
            error: false,
            message: displayMessage
          })
        })
        .catch(error => {
          if (error.response) {
            console.log(error.response.data);
            console.log(error.response.status);
          }
          console.log(error);
          res.render('pages/main',{
            my_title: "Movie Poster",
            items: '',
            error: true,
            message: error
          })
        });
  }
  else {
    console.log(error);
  }
});

app.get('/reviews', function(req, res) {
  var allReviews = 'select * from movieReviews;';
  db.task('get-everything', task => {
      return task.batch([
          task.any(allReviews)
      ]);
  })
      .then(info => {
          res.render('pages/reviews',{
              my_title: "Movie Reviews",
              reviews: info[0]
          })
      })
      .catch(error => {
          res.render('pages/reviews', {
              my_title: 'Movie Reviews',
              reviews: '',
          })
      });

});

app.post('/main/add_review',function(req,res){
	// Create a table within the database that has id, movie_title, review, review_date columns

  var today = new Date();
  
  var movie_title = req.body.movie_title;
  var review = req.body.review;

	var insert_statement = "INSERT INTO movieReviews(movie_title, review, review_date) VALUES('" + movie_title + "','" +
	review + "','" + today.toUTCString() + "') ON CONFLICT DO NOTHING;";

  var reviews = "select * from movieReviews;";
 
	db.task('post-data', task => {
        return task.batch([
            task.any(insert_statement),
						task.any(reviews)
        ]);
    })
	.then(data => {
		res.render('pages/reviews',{
      my_title:"Reviews",
			reviews: data[1]
		})
	})
	.catch(err => {
		console.log('Add Review Error');
		res.render('pages/reviews',{
      my_title:"Reviews",
			reviews: ''
		})
	});

});

app.post('/reviews/filter',function(req,res){
	// Create a table within the database that has id, movie_title, review, review_date columns
  
  var movie_title = req.body.movie_title;
  var reviews = "select * from movieReviews where movie_title = '" + movie_title + "';";
  
  if(reviews){
    
    db.task('post-data', task => {
        return task.batch([
            task.any(reviews)
        ]);
    })
  .then(data => {
    res.render('pages/reviews',{
      my_title:"Reviews",
      reviews: data[0]
    })
  })
  .catch(err => {
    console.log('Add Review Error');
    res.render('pages/reviews',{
      my_title:"Reviews",
      reviews: ''
    })
  });
  }
});

console.log('3000 is the magic port');

//app.listen(3000);
const server = app.listen(process.env.PORT || 3000, () => {
  console.log(`Express running → PORT ${server.address().port}`);
});

module.exports = server;
