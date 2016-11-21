var express = require('express'),
	http = require('http'),
	app = express(),
	httpServer = http.createServer(app);

var PDF = require('pdfkit');
var fs = require('fs');

var Address = function() {
	this.customerName;
	this.street;
	this.zusatz;
	this.plz;
	this.ort;
	this.land;
};

var Order = function() {
	this.numOfRow;
	this.beschreibung = new Array();
	this.menge = new Array();
	this.preisOhneUSt = new Array();
	this.ust = new Array();
	this.preisMitUSt = new Array();
	this.gesamtPreis = new Array();
}

var address = new Address();
var order = new Order();

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
	order.numOfRow = req.query.numOfRow;
	var tempBeschreibung = req.query.beschreibung.split("|");
	var tempMenge = req.query.menge.split("|");
	var tempPreisOhneUSt = req.query.preisOhneUSt.split("|");
	var tempUSt = req.query.ust.split("|");
	var tempPreisMitUSt = req.query.preisMitUSt.split("|");
	var tempGesamtPreis = req.query.gesamtPreis.split("|");
	for (var i = 0; i <= order.numOfRow; i++) {
		order.beschreibung[i] = tempBeschreibung[i];
		order.menge[i] = tempMenge[i];
		order.preisOhneUSt[i] = tempPreisOhneUSt[i];
		order.ust[i] = tempUSt[i];
		order.preisMitUSt[i] = tempPreisMitUSt[i];
		order.gesamtPreis[i] = tempGesamtPreis[i];
	}
	console.log(order);
});

app.get('/recoveryOrder', function(req, res) {
	if (typeof order.numOfRow != "undefined") {
		var beschreibung = order.beschreibung[0];
		var menge  = order.menge[0];
		var preisOhneUSt = order.preisOhneUSt[0];
		var ust = order.ust[0];
		var preisMitUSt = order.preisMitUSt[0];
		var gesamtPreis = order.gesamtPreis[0];

		for (var i = 1; i <= order.numOfRow; i++) {
			beschreibung = beschreibung + "|" + order.beschreibung[i];
			menge = menge + "|" + order.menge[i];
			preisOhneUSt = preisOhneUSt + "|" + order.preisOhneUSt[i];
			ust = ust + "|" + order.ust[i];
			preisMitUSt = preisMitUSt + "|" + order.preisMitUSt[i];
			gesamtPreis = gesamtPreis + "|" + order.gesamtPreis[i];
		}

		var text = order.numOfRow + "#"
				 + beschreibung + "#"
				 + menge + "#"
				 + preisOhneUSt + "#"
				 + ust + "#"
				 + preisMitUSt + "#"
				 + gesamtPreis;
		
		res.send(text);
	}
});

app.get('/submit', function(req, res) {
	var doc = new PDF();
	doc.pipe(fs.createWriteStream('./public/pdf/invoice.pdf'));

	doc.font('Helvetica-Bold')
	   .fontSize(20)
	   .text('RECHNUNG', {align: 'center'})
	   .moveDown(2);
	
	doc.fontSize(12)
	   .text('Rechnungsadresse:');

	var text = address.customerName + "\n"
			 + address.street + ", "
			 + address.zusatz + "\n"
			 + address.plz + " "
			 + address.ort + "\n"
			 + address.land;
	doc.font('Helvetica')
	   .text(text);

	var ihtct = "IHTCT Healthcare & Trade GmbH" + "\n"
	          + "Emanuel-Leutze-Str. 21" + "\n"
			  + "40547 Düsseldorf" + "\n"
			  + "Deutschland" + "\n"
			  + "USt-ID: DE305531798"
	for(i = 0; i < 5; i++) {
		doc.moveUp();
	}
	doc.font('Helvetica-Bold')
	   .text(ihtct, {align: 'right'});
	
	doc.end();

	address.customerName = "";
	address.street = "";
	address.zusatz = "";
	address.plz = "";
	address.ort = "";
	address.land = "";
	console.log(req.query);
	res.send("<script>window.location.href='/pdf/invoice.pdf';</script>");
});

httpServer.listen(app.get('port'), function () {
	console.log("Express server listening on port %s.", httpServer.address().port);
});
