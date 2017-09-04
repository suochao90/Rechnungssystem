function sendInventory() {
	var beschreibung = document.getElementById("beschreibung0").value;
	var menge = document.getElementById("menge0").value;
	var preisOhneUSt = document.getElementById("preisOhneUSt0").value;
	var ust = document.getElementById("ust0").value;
	var preisMitUSt = document.getElementById("preisMitUSt0").value;
	var gesamtPreis = document.getElementById("gesamtPreis0").value;
	
	for (var i = 1; i <= numOfRow; i++) {
		beschreibung = beschreibung + "|" + document.getElementById("beschreibung" + i).value;
		menge = menge + "|"+ document.getElementById("menge" + i).value;
		preisOhneUSt = preisOhneUSt + "|" + document.getElementById("preisOhneUSt" + i).value;
		ust = ust + "|" + document.getElementById("ust" + i).value;
		preisMitUSt = preisMitUSt + "|" + document.getElementById("preisMitUSt" + i).value;
		gesamtPreis = gesamtPreis + "|" + document.getElementById("gesamtPreis" + i).value;
	}

	var url = "/sendOrder?numOfRow=" + escape(numOfRow)
			+ "&beschreibung=" + escape(beschreibung)
			+ "&menge=" + escape(menge)
			+ "&preisOhneUSt=" + escape(preisOhneUSt)
			+ "&ust=" + escape(ust)
			+ "&preisMitUSt=" + escape(preisMitUSt)
			+ "&gesamtPreis=" + escape(gesamtPreis);
	url = url.replace(/\+/g, "%2B");
	request.open("GET", url, true);
	request.onreadystatechange = updatePage;
	request.send();
}

function recoveryInventory() {
	var url = "/recoveryInventory";
	request.open("GET", url, true);
	request.onreadystatechange = updatePage;
	request.send();
}

function updatePage() {
	if (request.readyState == 4 && request.status == 200) {
		var response = request.responseText.split("#");
		addRow(response[0]);
		var artikelnummer = response[1].split("|");
		var artikelbezeichnung = response[2].split("|");
		var menge = response[3].split("|");
		var einstandspreis = response[4].split("|");
		var inventurwert = response[5].split("|");
		
		for (var i = 0; i < response[0]; i++) {
			document.getElementById("position" + i).value = i + 1;
			document.getElementById("artikelnummer" + i).value = artikelnummer[i];
			document.getElementById("artikelbezeichnung" + i).value = artikelbezeichnung[i];
			document.getElementById("menge" + i).value = menge[i];
			document.getElementById("einstandspreis" + i).value = einstandspreis[i];
			document.getElementById("inventurwert" + i).value = inventurwert[i];
		}
	}
}

function addRow(n) {
/*	var artikelnummer = document.getElementById("artikelnummer0").value;
	var artikelbezeichnung = document.getElementById("artikelbezeichnung0").value;
	var menge = document.getElementById("menge0").value;
	var einstandspreis = document.getElementById("einstandspreis0").value;
	var inventurwert = document.getElementById("inventurwert0").value;
	
	if (typeof n == "undefined")
		n = 1;
	
	for (var i = 1; i < n; i++) {
		artikelnummer = beschreibung + "|" + document.getElementById("beschreibung" + i).value;
		menge = menge + "|"+ document.getElementById("menge" + i).value;
		preisOhneUSt = preisOhneUSt + "|" + document.getElementById("preisOhneUSt" + i).value;
		ust = ust + "|" + document.getElementById("ust" + i).value;
		preisMitUSt = preisMitUSt + "|" + document.getElementById("preisMitUSt" + i).value;
		gesamtPreis = gesamtPreis + "|" + document.getElementById("gesamtPreis" + i).value;
	}*/
	
	for (var j = 0; j < n; j++) {
		var idPosition = "position" + j;
		var idArtikelnummer = "artikelnummer" + j;
		var idArtikelbezeichnung = "artikelbezeichnung" + j;
		var idMenge = "menge" + j;
		var idEinstandspreis = "einstandspreis" + j;
		var idInventurwert = "inventurwert" + j;

		var string = "<tr><td><input id='" + idPosition + "' type=text class='position'></td>"
				   + "<td><input id='" + idArtikelnummer + "' type=text class='idArtikelnummer'></td>"
				   + "<td><input id='" + idArtikelbezeichnung + "' type=text class='artikelbezeichnung'></td>"
				   + "<td><input id='" + idMenge + "' type=text class='menge'></td>"
				   + "<td><input id='" + idEinstandspreis + "' type=text class='einstandspreis'></td>"
				   + "<td><input id='" + idInventurwert + "' type=text class='inventurwert'></td>"

		document.getElementById("inventory").innerHTML += string;
	}

/*	beschreibung = beschreibung.split("|");
	menge = menge.split("|");
	preisOhneUSt = preisOhneUSt.split("|");
	ust = ust.split("|");
	preisMitUSt = preisMitUSt.split("|");
	gesamtPreis = gesamtPreis.split("|");
	
	for (var k = 0; k < numOfRow; k++) {
		document.getElementById("beschreibung" + k).value = beschreibung[k];
		document.getElementById("menge" + k).value = menge[k];
		document.getElementById("preisOhneUSt" + k).value = preisOhneUSt[k];
		document.getElementById("ust" + k).value = ust[k];
		document.getElementById("preisMitUSt" + k).value = preisMitUSt[k];
		document.getElementById("gesamtPreis" + k).value = gesamtPreis[k];
	}*/
}
