//  server.js

	// setup ===============================
	var express = require('express');  
	var app = express();	// create our app w/ express
	var mongoose = require('mongoose');	// mongoose for mongodb
	var morgan = require('morgan'); 	// log requests to the console (express4)
	var bodyParser = require('body-parser'); // pull information from the HTML POST (express4)
	var methodOverride = require('method-override'); // simulate DELETE and PUT


	// configuration ===================

	mongoose.connect('mongodb://localhost/todo');

	app.use(express.static(__dirname + '/public'));
	app.use(morgan('dev'));
	app.use(bodyParser.urlencoded({'extended':'true'}));
	app.use(bodyParser.json());
	app.use(bodyParser.json({ type: 'applicatioin/vnd.api+json'}));
	app.use(methodOverride());

	// listen (start app with node server.js) ===============
	app.listen(9090);
	console.log("App listening on port 8080");

// routes================================================

	// api ----------------------------------------------
	// get all todos
	app.get('/api/todos', function(req, res) {

		// use mongoos to get all todos in the database
		Todo.find(function(err, todos) {

			// if there is an error retrieving, send the error. nothing after res.send(err) will execute
			if (err)
				res.send(err)

			res.json(todos);
		});
	});

	// create todo and send back all todos after creation
	app.post('/api/todos', function(req, res) {

		// create a todo, information comes from AJX request from Angular
		Todo.create({
			text : req.body.text,
			done : false
		}, function(err, todo) {
			if (err)
				res.send(err);

			// get and return all the todos after you create another
			Todo.find(function(err, todos) {
				if(err)
					res.send(err)
				res.json(todos);
			});
		});
	});