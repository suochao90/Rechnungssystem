function addHeader() {
	var string = "<h1>Rechnung System</h1>"
			   + "<header>"
			   + "<nav>"
			   + "<ul>"
			   + '<li><a href="index.html">Adresse</a></li>'
			   + '<li><a href="order.html">Bestellung</a></li>'
			   + '<li><a href="option.html">Optionen</a></li>'
			   + "</ul>"
			   + "</nav>"
			   + "</header>";

	document.getElementById("body").innerHTML += string;
}
