const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const passport = require('passport');

//routes
const posts = require('./routes/api/posts');
const users = require('./routes/api/users');
const profile = require('./routes/api/profile');

const app = express();

// Body parser middleware
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// DB Config
const db = require('./config/keys').mongoURI;

//Passport middleware
app.use(passport.initialize());

//Passport config
require('./config/passport')(passport);

// Connect to MongoDB
mongoose.connect(db, { useNewUrlParser: true ,useUnifiedTopology: true }).
then(() => console.log("connected")).
catch(err => console.log(err));


app.get("/", (req,res) => res.send('Hello'));

app.use('/api/users', users);
app.use('/api/profile', profile);
app.use('/api/posts', posts);


const port = process.env.PORT || 3000;

app.listen (port, () => console.log(`Server started on port ${port})`));
