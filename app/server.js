const express = require("express")
const path = require("path")
const fs = require("fs")
const bodyParser = require("body-parser")
let MongoClient = require('mongodb').MongoClient;
const app = express()

app.use(bodyParser.urlencoded({
    extended: true
  }));
  app.use(bodyParser.json());
  

app.get('/profile-picture', function (req, res) {
    let img = fs.readFileSync(path.join(__dirname, "images/profile-1.jpg"));
    res.writeHead(200, {'Content-Type': 'image/json' });
    res.end(img, 'binary');
  });



  // use when starting application locally
let mongoUrlLocal = "mongodb://mongoadmin:secret@localhost:27078";
// use when starting application as docker container
let mongoUrlDocker = "mongodb://admin:password@mongodb";
// pass these options to mongo client connect request to avoid DeprecationWarning for current Server Discovery and Monitoring engine
let mongoClientOptions = { useNewUrlParser: true, useUnifiedTopology: true };
// "user-account" in demo with docker. "my-db" in demo with docker-compose
let databaseName = "user-account";
// let databaseName = "my-db";
// require("./config/db").connect(mongoUrlLocal,mongoClientOptions)


  
  app.post('/update-profile', function (req, res) {
    let userObj = req.body;

    MongoClient.connect(mongoUrlLocal, function (err, client) {
        if (err) throw err;
    
        let db = client.db("user-account");
        userObj['userid'] = 1;
    
        let myquery = { userid: 1 };
        let newvalues = { $set: userObj };
    
        db.collection("users").updateOne(myquery, newvalues, {upsert: true}, function(err, res) {
          if (err) throw err;
          client.close();
          // Send response

        });
    
      });

      res.status(200).json(userObj);
  });
  

  app.get('/get-profile', function (req, res) {
    let response = {};
    // Connect to the db
    MongoClient.connect(mongoUrlLocal, function (err, client) {
      if (err) throw err;
  
      let db = client.db("user-account");
    //   console.log(db)
  
      let myquery = { userid:1 };
  
      db.collection("users").findOne(myquery, function (err, result) {
        if (err) throw err;
        response = result;
        // client.close();
  
        // Send response
        res.send(response ? response : {});
      });
    });



  });
  
  

app.get("/",(req,res)=>{
    res.sendFile(path.join(__dirname,"index.html"))
})

app.listen(3000,()=>console.log("app is listening on port 3000"))
