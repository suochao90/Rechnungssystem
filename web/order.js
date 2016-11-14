function sendOrder() {
	var beschreibung = document.getElementById("beschreibung").value;
	var menge = document.getElementById("menge").value;
	var preisOhneUSt = document.getElementById("preisOhneUSt").value;
	var ust = document.getElementById("ust").value;
	var preisMitUSt = document.getElementById("preisMitUSt").value;
	var gesamtPreis = document.getElementById("gesamtPreis").value;
	var url = "/sendOrder?beschreibung=" + escape(beschreibung)
			+ "&menge=" + escape(menge)
			+ "&preisOhneUSt=" + escape(preisOhneUSt)
			+ "&ust=" + escape(ust)
			+ "&preisMitUSt=" + escape(preisMitUSt)
			+ "&gesamtPreis=" + escape(gesamtPreis);
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
		var response = request.responseText.split("|");
		if (response[0] !== "undefined")
			document.getElementById("beschreibung").value = response[0];
		if (response[1] !== "undefined")
			document.getElementById("menge").value = response[1];
		if (response[2] !== "undefined")
			document.getElementById("preisOhneUSt").value = response[2];
		if (response[3] !== "undefined")
			document.getElementById("ust").value = response[3];
		if (response[4] !== "undefined")
			document.getElementById("preisMitUSt").value = response[4];
		if (response[5] !== "undefined")
			document.getElementById("gesamtPreis").value = response[5];
	}
}
