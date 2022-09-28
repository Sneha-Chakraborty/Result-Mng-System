const path = require('path');
const express = require('express');
const ejs = require('ejs');
const bodyParser = require('body-parser');

const app = express();

var session = require('express-session');

var flash = require('connect-flash');
const port = 3000;

app.use(
    session({
      resave: false,
      saveUninitialized: true,
      secret:"this is a result mng system",
      cookie: { maxAge: 14400000 },
    })
);
app.use(flash());

const mysql = require('mysql');
const encoder = express.urlencoded({

    extended: false

});

const connection=mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'root',
    database:'res_mng_system'
});

connection.connect(function(err){
    if(!err) console.log(err);
    else console.log('Database Connected!');
});


//set views file
app.set('views',path.join(__dirname,'views'));
app.set('views', './views/target');

//set view engine
app.set('view engine', 'ejs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

//home page
app.get('/',(req, res) =>{
    // res.send('new user from page');
    res.render('user_home', {
        title : 'Result Management System'
        
    });

});


app.get('/teacher',(req, res) => {
    // res.send('CRUD Operation using NodeJS / ExpressJS / MySQL');
    let sql = "SELECT * FROM studscores";
    let query = connection.query(sql, (err, rows) => {
        if (err) {
            console.error('error connecting: ' + err.stack);
            return;
          }
        res.render('user_index', {
            title : 'Result Management System',
            users : rows
        });
    });
});


app.get('/student',(req, res) =>{
    // res.send('new user from page');
    res.render('./views/model/Student', {
        title : 'Result Management System'
        
    });

});


app.post("/find",encoder,function(req,res){

    var rollno = req.body.rollno;

    // var dob = req.body.dob;
    var name=req.body.name;


    connection.query("select * from studscores where  rollno = ? and name = ?",[rollno,name] , function(error,rows){

        if(rows.length > 0)
        {
            res.render("target/final",{

                title: 'Result Management System',

                // users : results[0]
                users:rows

        });
        }

        else{

             //console.log('Incorrect Roll number or Date of Birth!');
            res.render('errorHandler/error', {
                title : 'Result Management System'
                
            });

         }

    });

});


app.get('/add',(req, res) =>{
    // res.send('new user from page');
    res.render('user_add', {
        title : 'Result Management System'
        
    });

});


app.get('/home',(req, res) =>{
    // res.send('new user from page');
    res.render('user_home', {
        title : 'Result Management System'
        
    });

});

app.get('/try_result',(req, res) =>{
    // res.send('new user from page');
    res.render('model/Student', {
        title : 'Result Management System'
        
    });

});

app.post('/save',(req, res) => { 
    let data = {rollno:req.body.rollno, name:req.body.name, dob:req.body.dob, scores:req.body.scores};
    // let data = {name: req.body.name, email: req.body.email, phone_no: req.body.phone_no};
   // let query1 = `Select * from result where req.body = ${userId}`;
    let sql = "INSERT INTO studscores SET ?";
    let query = connection.query(sql, data,(err, results) => {
        if( err & err == "ER_DUP_ENTRY" ){
            next();
          }
          else{
            res.redirect('/teacher');
          }
    });
});

app.get('/edit/:userId',(req, res) => {
    const rollno = req.params.rollno;
    let sql = `Select * from studscores where rollno = ${rollno}`;
    let query = connection.query(sql,(err, result) => {
        if(err) throw err;
        res.render('user_edit', {
            title : 'CRUD Operation using NodeJS / ExpressJS / MySQL',
            user : result[0]
        });
    });
});

app.post('/update',(req, res) => {
    const userId = req.body.rollno;
    let sql = "update studscores SET rollno='"+req.body.rollno+"',  Name='"+req.body.name+"',  dob='"+req.body.dob+"', scores='"+req.body.scores+"' where  rollno ="+rollno;
    let query = connection.query(sql,(err, results) => {
        
      res.redirect('/teacher');
    });
});

app.get('/delete/:userId',(req, res) => {
    const rollno = req.params.rollno;
    let sql = `DELETE from result where rollno = ${rollno}`;
    let query = connection.query(sql,(err, result) => {
        if(err) throw err;
        res.redirect('/teacher');
    });
});

// Server Listening
app.listen(port, (err) => {
    if(err) throw err;
    else
    console.log('Server is running at port : %d', port);
});



//Teacher login

//route to Teacher login page

app.get('/teacher_login',(req,res) => {

    res.render('teacher_login', {

        title: 'Result Management System',

        //message: 'Incorrect Id or Password!',

        // serverError : req.flash('error')

    });
});


app.post("/loginteach",encoder, function(req,res){

    var tid = req.body.tid;

    var pswrd = req.body.pswrd;
    connection.query("select * from teachers where  tid = ? and pswrd = ?",[tid,pswrd] , function(error,results,fields){    

        if(results.length>0)
        {

            res.redirect('/teacher');

        }

        else{
            res.render('errorHandler/error_teacher', {
                title : 'Result Management System'
                
            });

        }

    });

});