function addHeader() {
	var string = '<img src="logo.png" alt="logo" width="300" height="90.8">'
			   + "<h1>BILIN Angebots- und Rechnungssystem</h1>"
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
