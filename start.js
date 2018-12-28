try { 
	require('dotenv').config() 
} catch(ex) {};

var 	express = require('express'),
		app = express(),
	 	faker = require('faker'),
		bodyParser = require('body-parser'),
		methodOverride = require('method-override'),
		sanitizer = require('sanitizer'),
		db = require('mongoose');

db.connect(process.env.DATABASE_URL, {useNewUrlParser: true})
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride('_method'));
app.use(express.static('public'));
app.set('view engine', 'ejs');

app.use(function(req, res, next){
	res.locals.title = "Vorgenia";
	next();
})


app.get('/', function(req, res){
	res.locals.page = 'Home';
	res.render('home');
});

app.get('*', function(req, res){
	res.render('error404');
});

app.listen(process.env.PORT, process.env.IP, function(){
	console.log('Running node on address ' + process.env.IP + ':' + process.env.PORT);
});