var express = require('express'),
	http = require('http'),
	app = express(),
	httpServer = http.createServer(app);

var PDF = require('pdfkit');
var fs = require('fs');
var calculate = require('./calculate.js');

var mysql = require('mysql');
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '111111',
  database : 'Rechnungssystem'
});

connection.connect();
//connection.end();

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

var invoiceIndex = 1;
var offerIndex = 1;

function euroOutput(num) {
	if (typeof num == "number") {
		num = num.toFixed(2).toString();
	}
	if (num.indexOf(".") >= 0)
		num = num.replace(".", ",");
	if (num != "" && num.indexOf(",") < 0)
		num += ",00";
	if (num.indexOf(",") >= 0) {
		var temp = num.split(",");
		if (temp[1].length == 1)
			num += "0";
	}
		
	return num;
}

function createText(textType) {
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
			 + gesamtPreis + "#"
			 + textType;
	
	return text;
}

app.set('port', 8080);
app.use(express.static(__dirname + '/public'));

app.get('/sendAddress', function(req, res) {
	address.customerName = unescape(req.query.name);
	address.street = unescape(req.query.street);
	address.zusatz = unescape(req.query.zusatz);
	address.plz = unescape(req.query.plz);
	address.ort = unescape(req.query.ort);
	address.land = unescape(req.query.land);
	if (req.query.name != "") {
		connection.query('select * from Rechnungsadresse where Name=' + '"' + req.query.name + '"', function(error, results, fields) {
			if (error) throw error;
			if (typeof results[0] != "undefined") {
				address.customerName = results[0].Name;
				address.street = results[0].SuH;
				address.zusatz = results[0].Adresszusatz;
				address.plz = results[0].PLZ;
				address.ort = results[0].Ort;
				address.land = results[0].Land;
				
				var text = address.customerName + "|"
						 + address.street + "|"
						 + address.zusatz + "|"
						 + address.plz + "|"
						 + address.ort + "|"
						 + address.land;
				res.send(text);
			}
		});
	}
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
	var tempBeschreibung = unescape(req.query.beschreibung).split("|");
	var tempMenge = req.query.menge.split("|");
	var tempPreisOhneUSt = req.query.preisOhneUSt.split("|");
	var tempUSt = req.query.ust.split("|");
	var tempPreisMitUSt = req.query.preisMitUSt.split("|");
	var tempGesamtPreis = req.query.gesamtPreis.split("|");

	for (var i = 0; i <= order.numOfRow; i++) {
		var lastPOU = order.preisOhneUSt[i];
		var lastPMU = order.preisMitUSt[i];

		order.beschreibung[i] = tempBeschreibung[i];
		order.menge[i] = tempMenge[i];
		order.preisOhneUSt[i] = euroOutput(tempPreisOhneUSt[i]);
		order.ust[i] = tempUSt[i];
		order.preisMitUSt[i] = euroOutput(tempPreisMitUSt[i]);
		order.gesamtPreis[i] = euroOutput(tempGesamtPreis[i]);

		if (tempPreisOhneUSt[i] != "" && tempUSt[i] != "" && tempPreisMitUSt[i] == "") {
			if (euroOutput(tempPreisOhneUSt[i]).indexOf(",") >= 0)
				var str = euroOutput(tempPreisOhneUSt[i]).replace(",", ".");
			order.preisMitUSt[i] = euroOutput(calculate.mul(parseFloat(str), calculate.div(parseInt(tempUSt[i]), 100) + 1));
			
			if (tempMenge[i] != "")
				order.gesamtPreis[i] = euroOutput(calculate.mul(parseFloat(order.preisMitUSt[i].replace(",", ".")), parseInt(tempMenge[i])));
		}

		if (tempPreisMitUSt[i] != "" && tempPreisOhneUSt[i] == "") {
			var str = euroOutput(tempPreisMitUSt[i]).replace(",", ".");
			if (tempMenge[i] != "")
				order.gesamtPreis[i] = euroOutput(calculate.mul(parseFloat(str), parseInt(tempMenge[i])));

			if (tempUSt[i] != "")
				order.preisOhneUSt[i] = euroOutput(calculate.div(parseFloat(str), calculate.div(parseInt(tempUSt[i]), 100) + 1));
		}

		if (tempPreisOhneUSt[i] != "" && tempPreisMitUSt[i] != "") {
			if (tempPreisOhneUSt[i] != lastPOU) {
				if (euroOutput(tempPreisOhneUSt[i]).indexOf(",") >= 0)
					var str = euroOutput(tempPreisOhneUSt[i]).replace(",", ".");
				order.preisMitUSt[i] = euroOutput(calculate.mul(parseFloat(str), calculate.div(parseInt(tempUSt[i]), 100) + 1));
				
				if (tempMenge[i] != "")
					order.gesamtPreis[i] = euroOutput(calculate.mul(parseFloat(order.preisMitUSt[i].replace(",", ".")), parseInt(tempMenge[i])));
			} else if (tempPreisMitUSt[i] != lastPMU) {
				var str = euroOutput(tempPreisMitUSt[i]).replace(",", ".");
				if (tempMenge[i] != "")
					order.gesamtPreis[i] = euroOutput(calculate.mul(parseFloat(str), parseInt(tempMenge[i])));

				if (tempUSt[i] != "")
					order.preisOhneUSt[i] = euroOutput(calculate.div(parseFloat(str), calculate.div(parseInt(tempUSt[i]), 100) + 1));
			} else {
				var str = euroOutput(tempPreisMitUSt[i]).replace(",", ".");
				if (tempMenge[i] != "")
					order.gesamtPreis[i] = euroOutput(calculate.mul(parseFloat(str), parseInt(tempMenge[i])));
			}
		}
	}
	
	res.send(createText("calculate"));
	console.log(order);
});

app.get('/recoveryOrder', function(req, res) {
	if (typeof order.numOfRow != "undefined") {
		res.send(createText("recovery"));
	}
});

app.get('/submit', function(req, res) {
	var doc = new PDF();
	doc.pipe(fs.createWriteStream('./public/pdf/invoice.pdf'));

	doc.image('logo.png', 73, 36, {
		fit: [90, 55]
	});
	doc.font('Helvetica-Bold')
	   .fontSize(20);
	if (req.query.type == "offer")
		doc.text('ANGEBOT', {align: 'right'});
	else
		doc.text('RECHNUNG', {align: 'right'});
	doc .moveDown(2);
	
	doc.fontSize(12);
	if (req.query.type == "order")
	   doc.text('Rechnungsadresse:');

	if (address.zusatz != "")
		var text = address.customerName + "\n"
				 + address.street + ", "
				 + address.zusatz + "\n"
				 + address.plz + " "
				 + address.ort + "\n"
				 + address.land;
	else
		var text = address.customerName + "\n"
				 + address.street + "\n"
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
	doc.font('Helvetica-Bold');
	doc.text(ihtct, {align: 'right'});

	var date = new Date();
	var year = date.getFullYear();
	var month = date.getMonth() + 1;
	var day = date.getDate();
	if (month >= 1 && month <= 9) {
		month = "0" + month;
	}
	if (day >= 0 && day <= 9) {
		day = "0" + day;
	}
	var date = day + "." + month + "." + year;
	doc.moveDown(3);
	if (req.query.type == "offer") {
		doc.text("Angebotsdatum: ", {continued: true});
		doc.font('Helvetica')
		   .text(date);
		doc.font('Helvetica-Bold')
		   .text("Angebotsnummer: ", {continued: true});
		doc.font('Helvetica')
		   .text("A" + year + month + day + offerIndex);
		offerIndex++;
	} else {
		doc.text("Rechnungsdatum / Lieferdatum: ", {continued: true});
		doc.font('Helvetica')
		   .text(date);
		doc.font('Helvetica-Bold')
		   .text("Rechnungsnummer: ", {continued: true});
		doc.font('Helvetica')
		   .text("R" + year + month + day + invoiceIndex);
		invoiceIndex++;
	}

	doc.moveTo(73, 295)
	   .lineTo(540, 295)
	   .stroke();


	doc.font('Helvetica-Bold')
	   .text("Menge", 73, 337)
	   .text("Beschreibung", 120, 337)
	   .text("Stückpreis\n(ohne USt.)", 290, 330)
	   .text("USt.%", 358, 337)
	   .text("Stückpreis\n(inkl. USt.)", 399, 330)
	   .text("Gesamtpreis\n(inkl. USt.)", 467, 330);
	
	doc.moveTo(73, 365)
	   .lineTo(540, 365)
	   .stroke();

	doc.font('Helvetica');
	var positionY = 375;
	var nettoSum = 0;
	var sum = 0;
	for (var i = 0; i <= order.numOfRow; i++) {
		if (order.menge[i] != '' && order.beschreibung[i] != '' && order.preisOhneUSt[i] != '' && order.ust[i] != '' && order.preisMitUSt[i] != '' && order.gesamtPreis != '') {
			doc.text(order.menge[i], 73, positionY)
			   .text(order.beschreibung[i], 120, positionY)
			   .text(order.preisOhneUSt[i] + " €", 290, positionY)
			   .text(order.ust[i], 358, positionY)
			   .text(order.preisMitUSt[i] + " €", 399, positionY)
			   .text(order.gesamtPreis[i] + " €", 467, positionY);
			positionY += 20;
			if (order.preisOhneUSt[i].indexOf(",") >= 0)
				var strNetto = order.preisOhneUSt[i].replace(",", ".");
			nettoSum = calculate.add(nettoSum, calculate.mul(parseFloat(strNetto), parseInt(order.menge[i])));
			if (order.gesamtPreis[i].indexOf(",") >= 0)
				var strSum = order.gesamtPreis[i].replace(",", ".");
			sum = calculate.add(sum, parseFloat(strSum));
		}
	}
	doc.lineWidth(2)
	   .moveTo(73, positionY)
	   .lineTo(540, positionY)
	   .stroke();
	var ustSum = calculate.sub(sum, nettoSum);
	nettoSum = euroOutput(nettoSum);
	ustSum = euroOutput(ustSum);
	sum = euroOutput(sum);
	doc.text(nettoSum + " €", 467, positionY + 10);
	doc.text("Nettobetrag:", 370, positionY + 10);
	doc.text(ustSum + " €", 467, positionY + 30);
	doc.text("Umsatzsteuern:", 370, positionY + 30);
	doc.moveTo(370, positionY + 50)
	   .lineTo(540, positionY + 50)
	   .stroke();
	doc.font("Helvetica-Bold")
	   .text(sum + " €", 467, positionY + 60);
	doc.text("GESAMT:", 370, positionY + 60);

	if (req.query.type == "offer") {
		doc.font("Helvetica")
		   .text("Dieses Angebot ist 1 Woche ab dem Datum des Angebots gültig.", 73, positionY + 100)
		   .moveDown()
		   .text("Zur Annahme des Angebots überweisen Sie uns den Gesamtbetrag unter Angabe der Angebotsnummer. Nach Erhalt des oben genannten Betrages werden wir mit Ihnen die Warenübergabe abstimmen.");
	}

	doc.font("Helvetica")
	   .fontSize(8);
	doc.text("IHTCT Healthcare & Trade GmbH, Emanuel-Leutze-Str. 21, 40547 Düsseldorf", 73, 655, {align: 'center'});
	doc.text("Inhaber: Jianping Zhou; AG Düsseldorf, HRB 76781", {align: 'center'});
	doc.text("USt-ID-Nummer: DE305531798", {align: 'center'});
	doc.text("Web: www.ihtct.de  E-Mail: info@ihtct.de", {align: 'center'});
	doc.moveDown()
	   .text("Bankverbindubng: IBAN: DE82 3007 0024 0290 8168 00", {align: 'center'});
	doc.text("BIC: DEUTDEDBDUE", {align: 'center'});
	
	doc.end();

	if (address.customerName != "") {
		connection.query('select * from Rechnungsadresse where Name=' + '"' + address.customerName + '"', function(error, results, fields) {
			if (error) throw error;
			if (typeof results[0] == "undefined") {
				if (address.customerName != "" &&
					address.street != "" &&
					address.plz != "" &&
					address.ort != "" &&
					address.land != "") {
					var values = "('" + address.customerName + "','"
							   + address.street + "','"
							   + address.zusatz + "','"
							   + address.plz + "','"
							   + address.ort + "','"
							   + address.land + "')";
					connection.query('insert into Rechnungsadresse values' + values, function(error, results, fields) {
						if (error) throw error;
						address.customerName = "";
						address.street = "";
						address.zusatz = "";
						address.plz = "";
						address.ort = "";
						address.land = "";
					});
				}
			} else {
				address.customerName = "";
				address.street = "";
				address.zusatz = "";
				address.plz = "";
				address.ort = "";
				address.land = "";
			}
		});
	}

	for (var i = 0; i <= order.numOfRow; i++) {
		order.beschreibung[i] = "";
		order.menge[i] = "";
		order.preisOhneUSt[i] = "";
		order.ust[i] = "";
		order.preisMitUSt[i] = "";
		order.gesamtPreis[i] = "";
	}
	order.numOfRow = 0;
	console.log(req.query);
	res.send("<script>window.location.href='/pdf/invoice.pdf';</script>");
});

httpServer.listen(app.get('port'), function () {
	console.log("Express server listening on port %s.", httpServer.address().port);
});
