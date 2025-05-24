import express from "express";
import bodyParser from "body-parser";

const app = express();
const port = 3000;

var blogs = {};
var getId = function() {
    let id = 0;
    for (let i = 0; i < 8; i++) {
        id += Math.floor(Math.random() * 10) * (Math.pow(10, i));
    }
    if (blogs[id]) return getId();
    return id;
};

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
    res.render("index.ejs");
});

app.get("/read", (req, res) => {
    res.render("read.ejs", {blogs: blogs});
});

app.get("/write", (req, res) => {
    res.render("write.ejs");
});

app.get("/blog", (req, res) => {
    if(!req.query['id']) return res.redirect("/read");
    let id = req.query['id'];
    let blog = blogs[id];
    res.render("blog.ejs", {blog: blog});
});

app.post("/write", (req, res) => {
    let post = {};
    post.title = req.body.title;
    post.content = req.body.content;
    post.date = (new Date()).toUTCString();
    if (req.body.id) post.id = req.body.id;
    else post.id = getId();
    blogs[post.id.toString()] = post;
    res.redirect("/read");
});

app.post("/edit", (req, res) => {
    let id = req.body['id'];
    res.render("write.ejs", { blog: blogs[id], id: id });
    delete blogs[id];
});

app.post("/delete", (req, res) => {
    let id = req.body['id'];
    delete blogs[id];
    res.redirect("/read");
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});