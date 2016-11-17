var express = require('express'),
	http = require('http'),
	app = express(),
	httpServer = http.createServer(app);

var PDF = require('pdfkit');
var fs = require('fs');

var address = function() {
	this.customerName;
	this.street;
	this.zusatz;
	this.plz;
	this.ort;
	this.land;
};

var order = function() {
	this.beschreibung;
	this.menge;
	this.preisOhneUSt;
	this.ust;
	this.preisMitUSt;
	this.gesamtPreis;
}

app.set('port', 8080);
app.use(express.static(__dirname + '/public'));

app.get('/sendAddress', function(req, res) {
	address.customerName = req.query.name;
	address.street = req.query.street;
	address.zusatz = req.query.zusatz;
	address.plz = req.query.plz;
	address.ort = req.query.ort;
	address.land = req.query.land;
	console.log(req.query);
});

app.get('/recoveryAddress', function(req, res) {
	var text = address.customerName + "|"
			 + address.street + "|"
			 + address.zusatz + "|"
			 + address.plz + "|"
			 + address.ort + "|"
			 + address.land;
	res.send(text);
});

app.get('/sendOrder', function(req, res) {
	order.beschreibung = req.query.beschreibung;
	order.menge = req.query.menge;
	order.preisOhneUSt = req.query.preisOhneUSt;
	order.ust = req.query.ust;
	order.preisMitUSt = req.query.preisMitUSt;
	order.gesamtPreis = req.query.gesamtPreis;
	console.log(req.query);
});

app.get('/recoveryOrder', function(req, res) {
	var text = order.beschreibung + "|"
			 + order.menge + "|"
			 + order.preisOhneUSt + "|"
			 + order.ust + "|"
			 + order.preisMitUSt + "|"
			 + order.gesamtPreis;
	res.send(text);
});

app.get('/submit', function(req, res) {
	var doc = new PDF();
	doc.pipe(fs.createWriteStream('./public/pdf/test.pdf'));
	var text = address.customerName + "\n"
			 + address.street + ", "
			 + address.zusatz + "\n"
			 + address.plz + " "
			 + address.ort + "\n"
			 + address.land;
	doc.text(text, 100, 100);
	doc.end();

	address.customerName = "";
	address.street = "";
	address.zusatz = "";
	address.plz = "";
	address.ort = "";
	address.land = "";
	console.log(req.query);
	res.send("<script>window.location.href='/pdf/test.pdf';</script>");
});

httpServer.listen(app.get('port'), function () {
	console.log("Express server listening on port %s.", httpServer.address().port);
});
