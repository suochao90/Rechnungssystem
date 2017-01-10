function sendAddress() {
	var name = document.getElementById("name").value;
	var street = document.getElementById("street").value;
	var zusatz = document.getElementById("zusatz").value;
	var plz = document.getElementById("plz").value;
	var ort = document.getElementById("ort").value;
	var land = document.getElementById("land").value;
	var url = "/sendAddress?name=" + escape(name)
			+ "&street=" + escape(street)
			+ "&zusatz=" + escape(zusatz)
			+ "&plz=" + escape(plz)
			+ "&ort=" + escape(ort)
			+ "&land=" + escape(land);
	request.open("GET", url, true);
	request.onreadystatechange = updatePage;
	request.send();
}

function recoveryAddress() {
	var url = "/recoveryAddress";
	request.open("GET", url, true);
	request.onreadystatechange = updatePage;
	request.send();
}

function updatePage() {
	if (request.readyState == 4 && request.status == 200) {
		var response = request.responseText.split("|");
		if (response[0] !== "undefined")
			document.getElementById("name").value = response[0];
		if (response[1] !== "undefined")
			document.getElementById("street").value = response[1];
		if (response[2] !== "undefined")
			document.getElementById("zusatz").value = response[2];
		if (response[3] !== "undefined")
			document.getElementById("plz").value = response[3];
		if (response[4] !== "undefined")
			document.getElementById("ort").value = response[4];
		if (response[5] !== "undefined")
			document.getElementById("land").value = response[5];
	}
}
