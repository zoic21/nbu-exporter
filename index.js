const bodyParser = require('body-parser');
const express = require('express');
const morgan = require('morgan');
const session = require('express-session');
const fs = require('fs');

const args = process.argv;
if(args.indexOf('debug') == -1){
  console.log = function() {}
}

const apiTimeout = 60 * 1000;
const app = express();
app.use(morgan('combined', {
  skip: function (req, res) { return res.statusCode < 400 }
}));
app.disable('x-powered-by');
app.use(bodyParser.json({limit: '1024mb'}));
app.use(bodyParser.urlencoded({limit: '1024mb',extended: true}));
app.set('trust proxy', 1);

app.use(session({
  genid: function (req) {
    return Math.floor(Math.random() * 10000000000000000000000000000000000000000).toString(36)+'1';
  },
  secret: 'A3Mht5l5j',
  resave: false,
  saveUninitialized: true,
  cookie: {secure: false}
}));

app.get('/metrics', function (req, res) {
    try {
      req.setTimeout(apiTimeout)
      return res.status(500).json({state : 'ok',error : "Coucou"});
    } catch (e) {
      console.error(e);
      return res.status(500).json({state : 'nok',error : "Backend error"});
    }
})


const server = app.listen(8181, function () {
  const host = server.address().address;
  const port = server.address().port;
  console.log(' listening at %s:%s', host, port);
});
server.setTimeout(1800000);

app._router.stack.forEach(function(r){
    if (r.route && r.route.path){
      console.log(r.route.path);
    }
  
})