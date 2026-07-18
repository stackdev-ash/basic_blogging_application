const express = require('express');
const mongoose = require('mongoose');
const cookieparser= require('cookie-parser');
const path = require("path");

const userroute = require('./routes/user');
const blogroute = require('./routes/blog');
const blog=require('./models/blog');

const app = express();
const port = 8000;
const { checkforauthenticationcookie } = require('./middlewares/authentication');


mongoose.connect('ADD MONGO URL').then((e) => console.log("Mongodb connected"));

app.set('view engine', 'ejs');
app.set('views', path.resolve("./views"));

app.use(express.urlencoded({extended:false}))
app.use(cookieparser());
app.use(checkforauthenticationcookie("token"));
app.use(express.static(path.resolve("./public")))

app.get('/', async(req, res) => {
    const allblogs =await blog.find({});
    res.render("home",{
        user: req.user,
        blogs:allblogs
    });
})

app.use("/user", userroute);
app.use("/blog", blogroute);
app.listen(port, () => {
    console.log(`🚀 Server running at http://localhost:${port}`);
});