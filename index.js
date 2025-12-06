const { faker } = require("@faker-js/faker");
const mysql = require("mysql2");
const express = require("express");
const app = express();
//method override
const methodOverride = require("method-override");
app.use(methodOverride("_method"));
app.use(express.urlencoded({ extended: true }));

//EJS require
const path = require("path");
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));

//Database connection
const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    database: "project1",
    password: "myAdmin@BD1"
});



//Using faker created rendom value 
let getRandomUser = () => {
    return [
        faker.string.uuid(),
        faker.internet.username(),
        faker.internet.email(),
        faker.internet.password(),
    ];
};


//Render count number in home page
app.get("/", (req, res) => {
    let q = `SELECT count(*) FROM user`;
    try {
        connection.query(q, (err, result) => {
        if(err) throw err;
        let count = result[0]["count(*)"];
        res.render("home.ejs", {count}); 
        });
    } catch (err) {
        console.log(err);
        res.send("something error")
    }
});


//Render user info in this page
app.get("/user", (req, res) => {
    let q = `SELECT * FROM user`;
    try {
        connection.query(q, (err, users) => {
        if(err) throw err;
 
        res.render("showUser.ejs", {users}); 
        });
    } catch (err) {
        console.log(err);
        res.send("something error")
    }  
});


//Edit Username 
app.get("/user/:id/edit", (req, res) => {
    let {id} = req.params;
    let q = `SELECT * FROM user WHERE id = '${id}'`;

    try {
        connection.query(q, (err, result) => {
        if(err) throw err;
        let user = result[0];
        res.render("edit.ejs", {user}); 
        });
    } catch (err) {
        console.log(err);
        res.send("something error")
    } 
});


//Update username in BD
app.patch("/user/:id", (req, res) => {
    let {id} = req.params;
    let {username:newUsename, password:fromPass} = req.body
    let q = `SELECT * FROM user WHERE id = '${id}'`;

    try {
        connection.query(q, (err, result) => {
        if(err) throw err;
        let user = result[0];

        if(fromPass != user.password){
            res.send("ERROR, WRONG Password");
        }else {
            let q2 = `UPDATE user SET username='${newUsename}' WHERE id = '${id}'`;
            connection.query(q2, (err, result) =>{
                if(err) throw err;
                res.redirect("/user");
            });
        }
    });
    } catch (err) {
        console.log(err);
        res.send("something error")
    }     
});



app.listen("8080",()=> {
    console.log("server is working");
});





