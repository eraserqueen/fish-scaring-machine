// server.js
// where your node app starts

// init
var H = require("hyperweb");
var datastore = require("./datastore").sync;

app = H.blastOff();
datastore.initializeApp(app);

app.get("/", function (request, response) {
  try {
    initializeDatastoreOnProjectCreation();
    var params = datastore.get("params");
    console.log("params", params);
    if(typeof(params.speed) == "undefined") {
      datastore.set("params", defaultParams);
    }
    response.render('index.html', {
      title: "Fish-scaring machine",
      params: params
    });
  } catch (err) {
    handleError(err, response);
  }
});

app.post("/params", function (request, response) {
  try {
    console.log(request.body);
    var post = request.body;
    var params = {
      speed: post.speed,
      increment: post.increment,
      rate: post.rate,
      maxsize: post.maxsize,
      timeout: post.timeout,
      bgcolor: post.bgcolor,
      circlecolor: post.circlecolor,
      loomcolor: post.loomcolor
    };
    datastore.set("params", params);
    response.redirect("/");
  } catch (err) {
    handleError(err, response);
  }
});


function handleError(err, response) {
  response.status(500);
  response.send(
    "<html><head><title>Internal Server Error!</title></head><body><pre>"
    + JSON.stringify(err, null, 2) + "</pre></body></pre>"
  );
}

// ------------------------
// DATASTORE INITIALIZATION

function initializeDatastoreOnProjectCreation() {
  if (!datastore.get("initialized")) {
    console.log("init datastore");
    datastore.set("params", defaultParams);
    datastore.set("initialized", true);
  }
}

var defaultParams = {
  speed:100,
  increment:1,
  rate:1.5,
  maxsize:0,
  timeout:2000,
  bgcolor:"000000",
  circlecolor:"333333",
  loomcolor:"ffffff"
};