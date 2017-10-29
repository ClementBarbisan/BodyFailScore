var express = require('express'),
    app     = express(),
    morgan  = require('morgan');
    
Object.assign=require('object-assign')

app.engine('html', require('ejs').renderFile);
app.use(morgan('combined'));
app.use(express.static(__dirname + '/public'))

var port = process.env.PORT || 8080,
    ip   = process.env.IP   || '0.0.0.0',
    mongoURL = process.env.MONGO_URL,
    mongoURLLabel = "";

if (mongoURL == null) {
  var mongoHost = 'localhost',
      mongoPort = 8000,
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
		col.insert({date: Date.now(), skeleton: [{n0:[{x:req.query.n0x, y:req.query.n0y, z:req.query.n0z}],
												n1:[{x:req.query.n1x, y:req.query.n1y, z:req.query.n1z}],
												n2:[{x:req.query.n2x, y:req.query.n2y, z:req.query.n2z}],
												n3:[{x:req.query.n3x, y:req.query.n3y, z:req.query.n3z}],
												n4:[{x:req.query.n4x, y:req.query.n4y, z:req.query.n4z}],
												n5:[{x:req.query.n5x, y:req.query.n5y, z:req.query.n5z}],
												n6:[{x:req.query.n6x, y:req.query.n6y, z:req.query.n6z}],
												n7:[{x:req.query.n7x, y:req.query.n7y, z:req.query.n7z}],
												n8:[{x:req.query.n8x, y:req.query.n8y, z:req.query.n8z}],
												n9:[{x:req.query.n9x, y:req.query.n9y, z:req.query.n9z}],
												n10:[{x:req.query.n10x, y:req.query.n10y, z:req.query.n10z}],
												n11:[{x:req.query.n11x, y:req.query.n11y, z:req.query.n11z}],
												n12:[{x:req.query.n12x, y:req.query.n12y, z:req.query.n12z}],
												n13:[{x:req.query.n13x, y:req.query.n13y, z:req.query.n13z}],
												n14:[{x:req.query.n14x, y:req.query.n14y, z:req.query.n14z}],
												n15:[{x:req.query.n15x, y:req.query.n15y, z:req.query.n15z}],
												n16:[{x:req.query.n16x, y:req.query.n16y, z:req.query.n16z}],
												n17:[{x:req.query.n17x, y:req.query.n17y, z:req.query.n17z}],
												n18:[{x:req.query.n18x, y:req.query.n18y, z:req.query.n18z}],
												n19:[{x:req.query.n19x, y:req.query.n19y, z:req.query.n19z}],
												n20:[{x:req.query.n20x, y:req.query.n20y, z:req.query.n20z}],
												n21:[{x:req.query.n21x, y:req.query.n21y, z:req.query.n21z}],
												n22:[{x:req.query.n22x, y:req.query.n22y, z:req.query.n22z}],
												n23:[{x:req.query.n23x, y:req.query.n23y, z:req.query.n23z}],
												n24:[{x:req.query.n24x, y:req.query.n24y, z:req.query.n24z}],
												n25:[{x:req.query.n25x, y:req.query.n25y, z:req.query.n25z}]
		}]});
	}
});

app.get('/', function (req, res) {
  // try to initialize the db on every request if it's not already
  // initialized.
  if (db) {
    var col = db.collection('counts');
    // Create a document with request IP and current time of request
    col.insert({ip: req.ip, date: Date.now()});
    col.count(function(err, count){
      res.render('index.html', { pageCountMessage : count, dbInfo: dbDetails });
    });
  } else {
    res.render('index.html', { pageCountMessage : null});
  }
});

app.get('/pagecount', function (req, res) {
  // try to initialize the db on every request if it's not already
  // initialized.
  if (!db) {
    initDb(function(err){});
  }
  if (db) {
    db.collection('counts').count(function(err, count ){
      res.send('{ pageCount: ' + count + '}');
    });
  } else {
    res.send('{ pageCount: -1 }');
  }
});

// error handling
app.use(function(err, req, res, next){
  console.error(err.stack);
  res.status(500).send('Something bad happened!');
});

initDb(function(err){
  console.log('Error connecting to Mongo. Message:\n'+err);
});

app.listen(port, ip);
console.log('Server running on http://%s:%s', ip, port);

module.exports = app ;
