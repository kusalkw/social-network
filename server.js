const express = require('express');

const posts = require('./routes/api/posts')
const users = require('./routes/api/users')
const profile = require('./routes/api/profile')

const app = express();
const mongoose = require('mongoose');

const db = require('./config/keys').mongoURI

mongoose.connect(db, { useNewUrlParser: true ,useUnifiedTopology: true }).
then(() => console.log("connected")).
catch(err => console.log(err));


app.get("/", (req,res) => res.send('Hello')) 

app.use('/api/users', users)
app.use('/api/profile', profile)
app.use('/api/posts', posts)


const port = process.env.PORT || 3000

app.listen (port, () => console.log(`Server started on port ${port})`))