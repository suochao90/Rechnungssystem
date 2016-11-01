var express = require('express'),
	http = require('http'),
	app = express(),
	httpServer = http.createServer(app);

app.set('port', 8080);
app.use(express.static(__dirname + '/web'));

httpServer.listen(app.get('port'), function () {
	console.log("Express server listening on port %s.", httpServer.address().port);
});
