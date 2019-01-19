try { 
	require('dotenv').config() 
} catch(ex) {};

const express = require('express'),
		app = express(),
		bodyParser = require('body-parser'),
		methodOverride = require('method-override'),
		sanitizer = require('sanitizer'),
		nodemailer	= require('nodemailer');
		// db = require('mongoose');

const smtpTransport = nodemailer.createTransport({
	host: 'in-v3.mailjet.com',
	port: 587,
	auth: {
		user: process.env.SMTP_USER,
		pass: process.env.SMTP_PASS,
	}
});

// db.connect(process.env.DATABASE_URL, {useNewUrlParser: true})
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride('_method'));
app.use(express.static('public'));
app.set('view engine', 'ejs');

app.use(function(req, res, next){
	res.locals = {
		title: 'Vorgenia',
		page: ''
	}
	next();
})

app.get('/', function(req, res){
	res.redirect('/home');
});
app.post('/message', function(req, res){
	const sender = req.body.email;
	const message = req.body.message;

	var mailOptions = {
		to: process.env.EMAIL,
		from: 'noreply@gregos.net',
		subject: `New message from ${sender}`,
		text: message
	};
	// smtpTransport.sendMail(mailOptions, function(err){
	// 	(err) ?  res.status(500).send(err) : res.status(200).send('ok');
	// });
	res.status(200).send(`new message from ${sender}: ${message}`);
});
app.get('*', function(req, res){
	res.render('home');
});

app.listen(process.env.PORT, process.env.IP, function(){
	console.log('Running node on address ' + process.env.IP + ':' + process.env.PORT);
});