const express = require("express");
const database = require("./model/database");
const bodyps = require("body-parser");
const session = require("express-session");

const app = express();

app.set("view engine", "ejs");
app.set("views", "view");

app.use(express.static(__dirname + "/public"));
app.use(bodyps.urlencoded({extended:true}));
app.use(session({
    secret : "asduuadasdhu",
    resave : false,
    saveUninitialized : true,
    cookie : {
        maxAge : 60*60*1000
    }
}));

app.get("/", (req, res) => {
    if (req.session.sesi) {
        database.query(`SELECT * FROM pesan`, (err, result) => {
            res.render("chat", {pesannya : result, namanya : nama})
        })
    } else {
        res.redirect("/login")
    }
});

app.get("/login", (req, res) => {
    res.render("login")
});

app.post("/autentikasi", (req, res) => {
    const data = {
        email : req.body.email,
        password : req.body.password
    }

    database.query(`SELECT * FROM user WHERE email = '${data.email}' AND password = '${data.password}'`, (err, result) => {
        if (result.length > 0) {
            for (let user of result) {
                const email = data.email
                nama = user.nama
                req.session.sesi = email
                res.redirect("/")
            }
        }
    });
});

app.post("/kirim", (req, res) => {
    const data = {
        nama : req.body.nama,
        pesan : req.body.pesan
    }

    database.query(`INSERT INTO pesan (nama, pesan) VALUES ('${data.nama}', '${data.pesan}')`, (err, finish) => {
        if (finish) {
            res.redirect("/")
        }
    })
})

app.listen(3000);