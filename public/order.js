var numOfRow = 0;

function sendOrder() {
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
//	request.onreadystatechange = updatePage;
	request.send();
}

function recoveryOrder() {
	var url = "/recoveryOrder";
	request.open("GET", url, true);
	request.onreadystatechange = updatePage;
	request.send();
}

function updatePage() {
	if (request.readyState == 4 && request.status == 200) {
		var response = request.responseText.split("#");
		addRow(response[0]);
		
		var beschreibung = response[1].split("|");
		var menge = response[2].split("|");
		var preisOhneUSt = response[3].split("|");
		var ust = response[4].split("|");
		var preisMitUSt = response[5].split("|");
		var gesamtPreis = response[6].split("|");
		
		for (var i = 0; i <= response[0]; i++) {
			document.getElementById("beschreibung" + i).value = beschreibung[i];
			document.getElementById("menge" + i).value = menge[i];
			document.getElementById("preisOhneUSt" + i).value = preisOhneUSt[i];
			document.getElementById("ust" + i).value = ust[i];
			document.getElementById("preisMitUSt" + i).value = preisMitUSt[i];
			document.getElementById("gesamtPreis" + i).value = gesamtPreis[i];
		}
	}
}

function addRow(n) {
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

	if (typeof n == "undefined")
		n = 1;
	
	for (var j = 0; j < n; j++) {
		numOfRow ++;
		var idBeschreibung = "beschreibung" + numOfRow;
		var idMenge = "menge" + numOfRow;
		var idPreisOhneUSt = "preisOhneUSt" + numOfRow;
		var idUSt = "ust" + numOfRow;
		var idPreisMitUSt = "preisMitUSt" + numOfRow;
		var idGesamtPreis = "gesamtPreis" + numOfRow;

		var string = "<tr><td><input id='" + idBeschreibung + "' type=text class='beschreibung' onblur='sendOrder();'></td>"
				   + "<td><input id='" + idMenge + "' type=text class='menge' value='1' onFocus='this.value=''' onblur='sendOrder();'></td>"
				   + "<td><input id='" + idPreisOhneUSt + "' type=text class='preisOhneUSt' onblur='sendOrder();'></td>"
				   + "<td><input id='" + idUSt + "' type=text class='ust' onblur='sendOrder();'></td>"
				   + "<td><input id='" + idPreisMitUSt + "' type=text class='preisMitUSt' onblur='sendOrder();'></td>"
				   + "<td><input id='" + idGesamtPreis + "' type=text class='gesamtPreis' onblur='sendOrder();'></td></tr>";

		document.getElementById("order").innerHTML += string;
	}

	beschreibung = beschreibung.split("|");
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
	}
}
