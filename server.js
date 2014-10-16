var express = require('express');
var session = require('express-session')
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser')
var app = express();
var _ = require("underscore");
var bcrypt = require("bcrypt");
var sqlite = require("sqlite3");

var sqlite3 = require("sqlite3").verbose();
var db = new sqlite3.Database(__dirname+'/db/development.db');
// Create our users table if it doesn't exist
db.run("CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY, name TEXT, username TEXT UNIQUE, password TEXT, auth_token TEXT UNIQUE)");

app.use('/', express.static(__dirname));
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(session({secret: 'sfssdcsdshukuikjihjdsidjsds'}));
app.use(cookieParser('sfssdcsdshukuikjihjdsidjsds'));

/*
 * ルーティング設定
 */
var routes = require("./routes")(app, db, _, bcrypt);

app.listen(3000);

process.on("exit", function(){
    db.close();
});

console.log('Server StartUp: http://localhost:3000/');
