var numOfRow = 0;

function sendOrder() {
/*	for (var i = 0; i <= numOfRow; i++) {
		var beschreibung = document.getElementById("beschreibung" + i).value;
		var menge = document.getElementById("menge" + i).value;
		var preisOhneUSt = document.getElementById("preisOhneUSt" + i).value;
		var ust = document.getElementById("ust" + i).value;
		var preisMitUSt = document.getElementById("preisMitUSt" + i).value;
		var gesamtPreis = document.getElementById("gesamtPreis" + i).value;
		var url = "/sendOrder?numOfRow=" + escape(i)
				+ "&beschreibung=" + escape(beschreibung)
				+ "&menge=" + escape(menge)
				+ "&preisOhneUSt=" + escape(preisOhneUSt)
				+ "&ust=" + escape(ust)
				+ "&preisMitUSt=" + escape(preisMitUSt)
				+ "&gesamtPreis=" + escape(gesamtPreis);
		request.open("GET", url, true);
	//	request.onreadystatechange = updatePage;
		request.send();
	}*/

	loopAjax(0, numOfRow);
}

function recoveryOrder() {
	var url = "/recoveryOrder";
	request.open("GET", url, true);
	request.onreadystatechange = updatePage;
	request.send();
}

function updatePage() {
	if (request.readyState == 4 && request.status == 200) {
		var response = request.responseText.split("|");
		if (response[0] !== "undefined")
			document.getElementById("beschreibung0").value = response[0];
		if (response[1] !== "undefined")
			document.getElementById("menge0").value = response[1];
		if (response[2] !== "undefined")
			document.getElementById("preisOhneUSt0").value = response[2];
		if (response[3] !== "undefined")
			document.getElementById("ust0").value = response[3];
		if (response[4] !== "undefined")
			document.getElementById("preisMitUSt0").value = response[4];
		if (response[5] !== "undefined")
			document.getElementById("gesamtPreis0").value = response[5];
	}
}

function addRow() {
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

function loopAjax(index, length) {
	if (index > length)
		return;
	
	var beschreibung = document.getElementById("beschreibung" + index).value;
	var menge = document.getElementById("menge" + index).value;
	var preisOhneUSt = document.getElementById("preisOhneUSt" + index).value;
	var ust = document.getElementById("ust" + index).value;
	var preisMitUSt = document.getElementById("preisMitUSt" + index).value;
	var gesamtPreis = document.getElementById("gesamtPreis" + index).value;
	var url = "/sendOrder?numOfRow=" + escape(index)
			+ "&beschreibung=" + escape(beschreibung)
			+ "&menge=" + escape(menge)
			+ "&preisOhneUSt=" + escape(preisOhneUSt)
			+ "&ust=" + escape(ust)
			+ "&preisMitUSt=" + escape(preisMitUSt)
			+ "&gesamtPreis=" + escape(gesamtPreis);
	request.open("GET", url, true);
//	request.onreadystatechange = updatePage;
	request.send();
	index ++;
	loopAjax(index, length);
}
