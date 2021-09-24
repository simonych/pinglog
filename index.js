const restify = require('restify');

//////////////////////////////////////////////////////
const pinoms = require('pino-multi-stream')
const childProcess = require('child_process')
const stream = require('stream')

const cwd = process.cwd()
const { env } = process

const logThrough = new stream.PassThrough()
const prettyStream = pinoms.prettyStream()
const streams = [
  { stream: logThrough },
  { stream: prettyStream }
]
const log = pinoms(pinoms.multistream(streams))

const child = childProcess.spawn(process.execPath, [
  require.resolve('pino-tee'),
  'info', `${__dirname}/log/info`,
  'warn', `${__dirname}/log/warn`,
  'error', `${__dirname}/log/error`,
  'fatal', `${__dirname}/log/fatal`
], { cwd, env })

logThrough.pipe(child.stdin)
////////////////////////////////////////////////////

function respond(req, res, next) {
  res.send('hello ' + req.params.name);
  log.info(JSON.stringify(req.params, null, '  '));
  next();
}

var server = restify.createServer();
server.get('/log/:name', respond);
server.head('/log/:name', respond);

server.listen(5145, function() {
  log.info('%s listening at %s', server.name, server.url);
});
