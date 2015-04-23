var express = require('express');
var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');
var request = require('request');
var multer = require('multer')
var bodyparser = require('body-parser');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var cookieParser = require('cookie-parser');
var session = require('express-session');
 
var app = express();

// app.use(express.static('.'));

app.use(express.static(__dirname + '/public'));

// ['css', 'img', 'js', 'plugin', 'lib'].forEach(function (dir){
//     app.use('/'+dir, express.static(__dirname+'/'+dir));
// });

app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: true }));
app.use(multer());
app.use(session({ 
    secret: 'You cannot see it',
    resave: true,
    saveUninitialized: true
}));
app.use(cookieParser());
app.use(passport.initialize());
app.use(passport.session());

var connectionstring = process.env.OPENSHIFT_MONGODB_DB_URL || 'mongodb://localhost/mydb';
mongoose.connect(connectionstring);



app.use(express.static(__dirname + '/views'));

var LoginDBSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    email: String,
    usertype: String,
    favorite: [{ 
        driver: String,
        team: String
    }]
}, { collection: 'userLogin' });

var MessageSchema = new mongoose.Schema({
    //userFrom: { type: String, required: true, unique: true },
    //userTo: { type: String, required: true, unique: true },
    userFrom: String,
    userTo: String,
    message: { type: String, required: true },
    time: { type: Date, default: Date.now }
}, { collection: 'messageInfo' });

LoginDBSchema.plugin(uniqueValidator);
// UserInfoDBSchema.plugin(uniqueValidator);

var LoginDBModel = mongoose.model("LoginDBModel", LoginDBSchema);
// var UserInfoDBModel = mongoose.model("UserInfoDBModel", UserInfoDBSchema);
var MessageDBModel = mongoose.model("MessageDBModel", MessageSchema);

passport.use(new LocalStrategy(
    function (username, password, done) {
        LoginDBModel.findOne({ username: username, password: password }, function (err, user) {
            if (user) {
                return done(null, user);
            } else {
                return done(null, false, { message: 'Unable to login' });
            }
        });
}));

passport.serializeUser(function (user, done) {
    done(null, user);
});

passport.deserializeUser(function (user, done) {
    done(null, user);
});

var auth = function (req, res, next) {
    if (!(req.isAuthenticated())) {
        res.send(401);
    } else {
        next();
    }
};

app.post('/login', passport.authenticate('local'), function (req, res) {
    var user = req.user;
    res.json(user);
});

app.post('/register', function (req, res) {
    console.log(req.body);
    var newUser = req.body;
    newUser.usertype='user';  
    LoginDBModel.findOne({ username: newUser.username},function (err, user) {
    
        console.log(err);
        console.log(user);
        if(err) { return next(err); }
        if(user){
            res.json(null);
            return;
        }
        var newUser = new LoginDBModel(req.body);
        newUser.save(function(err, user){
            req.login(user, function(err){
                if(err) {return next(err);}
                res.json(user);
            });
        });
    });
});

app.put('/follow/:currentUser',function(req,res){
    console.log(req.body);
    var driver=req.body;
    var drivername = driver.Driver.givenName+" "+driver.Driver.familyName;
    var team = driver.Constructors[0].name;
  
    var username=req.params.currentUser; 
    console.log("hi");
    console.log(username);
    console.log("hi");

    var flag=LoginDBModel.findOne({'favorite.driver':drivername});
    
    console.log(flag);

    LoginDBModel.findOneAndUpdate({ 'username': username },
    {
        // $set:{
        //     "favorite.driver": drivername,
        //     "favorite.team" :team
        // } 
        $push:{
            "favorite":{ 
            "driver": drivername,
            "team" :team}
        } 
    }, function (err, res) 
    {
        console.log("User info updated");
        console.log(res);

    });
    LoginDBModel.find({ username: username }, function (err, data) {
        //console.log(data);
        res.send(data);
    });    
});


app.put("/follow/:username/favorite/:driver", function(req,res){
    var username = req.params.username;
    var driver = req.params.driver;

    console.log("hi");
    //console.log(userId);
    console.log(driver);
    console.log(username);
    console.log("hi");

    //$and :[{'username':username}, {'favorite.driver': driver}]
    //{"favorite":{$elemMatch: {"driver":driver}
    LoginDBModel.findOneAndUpdate({"username":username},
        {
            $pull:{
            "favorite":{"driver":driver},
            "multi": "true" 
        }
    }, function (err, res) {
        console.log("Favorite info updated");
        console.log(res);
    });

    LoginDBModel.find({ username: username }, function (err, data) {
        console.log(data);
        res.send(data);
    });  
});

app.get("/follow/:username", function(req,res){
    var username = req.params.username;
    LoginDBModel.find({'username':username},
        function(err, userInfo)
        {
            res.json(userInfo);
            console.log(userInfo);
        });
});

app.get("/rest/user", auth, function(req, res)
{
    LoginDBModel.find(function(err, users)
    {
        res.json(users);
    });
});

app.delete("/rest/user/:id", auth, function(req, res){
    LoginDBModel.findById(req.params.id, function(err, user){
        user.remove(function(err, count){
            LoginDBModel.find(function(err, users){
                res.json(users);
            });
        });
    });
});

app.put("/rest/user/:id", auth, function(req, res){
    LoginDBModel.findById(req.params.id, function(err, user){

        console.log(req.body);

        user.update(req.body, function(err, count){
            LoginDBModel.find(function(err, users){
                res.json(users);
            });
        });
    });
});

app.post("/rest/user", auth, function(req, res){
    LoginDBModel.findOne({username: req.body.username}, function(err, user) {
        if(user == null)
        {
            user = new LoginDBModel(req.body);
            user.save(function(err, user){
                LoginDBModel.find(function(err, users){
                    res.json(users);
                });
            });
        }
        else
        {
            LoginDBModel.find(function(err, users){
                res.json(users);
            });
        }
    });
});

app.get("/loggedin", function (req, res) {
    res.send(req.isAuthenticated() ? req.user : '0');
});

app.post("/logout", function (req, res) {
    req.session.destroy();
    res.send(200);
});

app.get('/', function (req, res) {
    res.sendfile(__dirname + 'index.html');
});

//app.listen(3000);
var ip = process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1';
var port = process.env.OPENSHIFT_NODEJS_PORT || 8000;

var server = app.listen(port, ip, function () {
    console.log('%s: Node server started on %s:%d ...',
                Date(Date.now()), ip, port)
});

var io = require('socket.io').listen(server);
var usernames = {};
var numUsers = 0;

// io.sockets.on('connection', function (socket) {
//     socket.on('send msg', function (data) {

//     var newMsg = new MessageDBModel({message:data});
//         newMsg.save(function (err) {
//             if (err) {
//                 throw err;
//             } else {
//                 io.sockets.emit('get msg', data);
//             }
//         });
//     });
// });

io.sockets.on('connection', function (socket) {

    socket.on('add user', function (username) {
    // we store the username in the socket session for this client
    socket.username = username;
    // add the client's username to the global list
    usernames[username] = username;
    ++numUsers;
    addedUser = true;
    socket.emit('login', {
      numUsers: numUsers
    });
    // echo globally (all clients) that a person has connected
    socket.broadcast.emit('user joined', {
      username: socket.username,
      numUsers: numUsers
    });
  });

    socket.on('send msg', function (data) {
    currentUser=socket.username;
    console.log(currentUser);
    var newMsg = new MessageDBModel({
        userFrom: currentUser,
        message:data});
        newMsg.save(function (err) {
            if (err) {
                throw err;
            } else {
                io.sockets.emit('get msg', currentUser,data);
            }
        });
    });
});