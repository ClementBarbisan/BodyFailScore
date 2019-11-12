var express = require('express'),
    app     = express(),
    morgan  = require('morgan'),
    fs      = require('fs'),
    http    = require('http'),
    oplogEmitter = require('oplog-emitter'),
    emitter = null;

Object.assign=require('object-assign')

app.engine('html', require('ejs').renderFile);
app.use(morgan('combined'));
app.use(express.static(__dirname + '/public'));
app.set('views', __dirname + '/views');

var port = process.env.PORT || 8080,
    ip   = process.env.IP   || '0.0.0.0',
    mongoURL = process.env.MONGO_URL,
    mongoURLLabel = "";
var server = http.createServer(app).listen(port);
/*var server = https.createServer({
    key: fs.readFileSync('server.key'),
    cert: fs.readFileSync('server.csr'),
    ca: fs.readFileSync('intermediateCert.cer')
}, app).listen(443);
*/
var io = require('socket.io')(server);

if (mongoURL == null) {
  var mongoHost = 'localhost',
      mongoPort = 27017,
      mongoDatabase = 'bodyfailscore',
      mongoPassword = null,
      mongoUser = null;

  if (mongoHost && mongoPort && mongoDatabase) {
    mongoURLLabel = mongoURL = 'mongodb://';
    if (mongoUser && mongoPassword) {
      mongoURL += mongoUser + ':' + mongoPassword + '@';
    }
    // Provide UI label that excludes user id and pw
    mongoURLLabel += mongoHost + ':' + mongoPort + '/' + mongoDatabase;
    mongoURL += mongoHost + ':' +  mongoPort + '/' + mongoDatabase;

  }
}
var db = null,
    dbDetails = new Object();
emitter = new oplogEmitter('mongodb://127.0.0.1:27017/local');

emitter.on('insert', function()
{
    io.sockets.emit('reload', {value: true});
    console.log('insert to database');
});

var initDb = function(callback) {
  if (mongoURL == null) return;

  var mongodb = require('mongodb');
  if (mongodb == null) return;

  mongodb.connect(mongoURL, function(err, conn) {
    if (err) {
      callback(err);
      return;
    }

    db = conn;
    dbDetails.databaseName = db.databaseName;
    dbDetails.url = mongoURLLabel;
    dbDetails.type = 'MongoDB';

    console.log('Connected to MongoDB at: %s', mongoURL);
  });
};

app.get('/addSample', function(req, res)
{
	if (!db) 
	{
		initDb(function(err){});
	}
	if (db)
	{
		var col = db.collection('movements');
        if (req.query.n16x) {
            col.insert({
                date: Date.now(), place: req.query.place, skeleton: {
                    n0: {x: req.query.n0x, y: req.query.n0y, z: req.query.n0z},
                    n1: {x: req.query.n1x, y: req.query.n1y, z: req.query.n1z},
                    n2: {x: req.query.n2x, y: req.query.n2y, z: req.query.n2z},
                    n3: {x: req.query.n3x, y: req.query.n3y, z: req.query.n3z},
                    n4: {x: req.query.n4x, y: req.query.n4y, z: req.query.n4z},
                    n5: {x: req.query.n5x, y: req.query.n5y, z: req.query.n5z},
                    n6: {x: req.query.n6x, y: req.query.n6y, z: req.query.n6z},
                    n7: {x: req.query.n7x, y: req.query.n7y, z: req.query.n7z},
                    n8: {x: req.query.n8x, y: req.query.n8y, z: req.query.n8z},
                    n9: {x: req.query.n9x, y: req.query.n9y, z: req.query.n9z},
                    n10: {x: req.query.n10x, y: req.query.n10y, z: req.query.n10z},
                    n11: {x: req.query.n11x, y: req.query.n11y, z: req.query.n11z},
                    n12: {x: req.query.n12x, y: req.query.n12y, z: req.query.n12z},
                    n13: {x: req.query.n13x, y: req.query.n13y, z: req.query.n13z},
                    n14: {x: req.query.n14x, y: req.query.n14y, z: req.query.n14z},
                    n15: {x: req.query.n15x, y: req.query.n15y, z: req.query.n15z},
                    n16: {x: req.query.n16x, y: req.query.n16y, z: req.query.n16z},
                    n17: {x: req.query.n17x, y: req.query.n17y, z: req.query.n17z},
                    n18: {x: req.query.n18x, y: req.query.n18y, z: req.query.n18z},
                    n19: {x: req.query.n19x, y: req.query.n19y, z: req.query.n19z},
                    n20: {x: req.query.n20x, y: req.query.n20y, z: req.query.n20z},
                    n21: {x: req.query.n21x, y: req.query.n21y, z: req.query.n21z},
                    n22: {x: req.query.n22x, y: req.query.n22y, z: req.query.n22z},
                    n23: {x: req.query.n23x, y: req.query.n23y, z: req.query.n23z},
                    n24: {x: req.query.n24x, y: req.query.n24y, z: req.query.n24z}
                }
            });
        }
        else
        {
            col.insert({
                date: Date.now(), place: req.query.place, skeleton: {
                    n0: {x: req.query.n0x, y: req.query.n0y, z: req.query.n0z},
                    n1: {x: req.query.n1x, y: req.query.n1y, z: req.query.n1z},
                    n2: {x: req.query.n2x, y: req.query.n2y, z: req.query.n2z},
                    n3: {x: req.query.n3x, y: req.query.n3y, z: req.query.n3z},
                    n4: {x: req.query.n4x, y: req.query.n4y, z: req.query.n4z},
                    n5: {x: req.query.n5x, y: req.query.n5y, z: req.query.n5z},
                    n6: {x: req.query.n6x, y: req.query.n6y, z: req.query.n6z},
                    n7: {x: req.query.n7x, y: req.query.n7y, z: req.query.n7z},
                    n8: {x: req.query.n8x, y: req.query.n8y, z: req.query.n8z},
                    n9: {x: req.query.n9x, y: req.query.n9y, z: req.query.n9z},
                    n10: {x: req.query.n10x, y: req.query.n10y, z: req.query.n10z},
                    n11: {x: req.query.n11x, y: req.query.n11y, z: req.query.n11z},
                    n12: {x: req.query.n12x, y: req.query.n12y, z: req.query.n12z},
                    n13: {x: req.query.n13x, y: req.query.n13y, z: req.query.n13z},
                    n14: {x: req.query.n14x, y: req.query.n14y, z: req.query.n14z},
                    n15: {x: req.query.n15x, y: req.query.n15y, z: req.query.n15z}
                }
            });
        }
        //col.find().sort({"date": -1}).limit(50).toArray().then(function (data)
        //{
        //    var json = JSON.stringify(data);
        //    fs.writeFile('public/bodyfail.json', json, 'utf8');
            res.status(200).send('OK');
        //});
        //console.log(test);

	}
});

app.get('/get_range_data_length', function (req, res) {
    if (!db)
    {
        initDb(function(err){});
    }
	console.log(db);
    if (db) {
        var col = db.collection('movements');
            col.find().sort({"date": -1}).skip(parseInt(req.query.range)).limit(48).toArray().then(function (data) {
                res.status(200).send(data.length.toString());
            });
    }
});

app.get('/get_range_data', function (req, res) {
    if (!db)
    {
        initDb(function(err){});
    }
	console.log(db);
    if (db) {
        var col = db.collection('movements');

            col.find().sort({"date": -1}).skip(parseInt(req.query.range)).limit(48).toArray().then(function (data) {
                var json = JSON.stringify(data);
                res.status(200).send(json);
            });
    }
});

app.get('/get_data', function (req, res) {
    if (!db)
    {
        initDb(function(err){});
    }
	console.log(db);
    if (db) {
        var col = db.collection('movements');
        col.find().sort({"date": -1}).limit(48).toArray().then(function (data) {
            var json = JSON.stringify(data);
            res.status(200).send(json);
        });
    }
});

app.get('/database', function (req, res) {
    res.render('index.html');
});

app.get('/portable', function (req, res) {
    res.render('portable.html');
});

app.get('/', function (req, res) {
    res.render('homepage.html');
});

// error handling
app.use(function(err, req, res, next){
  console.error(err.stack);
  res.status(500).send('Something bad happened!');
});

initDb(function(err){
  console.log('Error connecting to Mongo. Message:\n'+err);
});

module.exports = app ;
