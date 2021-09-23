const restify = require('restify');

function respond(req, res, next) {
  res.send('hello ' + req.params.name);
  next();
}

var server = restify.createServer();
server.get('/log/:name', respond);
server.head('/log/:name', respond);

server.listen(5145, function() {
  console.log('%s listening at %s', server.name, server.url);
});
