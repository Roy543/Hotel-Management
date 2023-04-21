var express = require('express');
var session = require('express-session');
const bodyParser = require("body-parser");
const mysql = require('mysql');

var app = express();
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Create connection
var db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'hotel_management_db'
});

// Connect
db.connect(function (err) {
    if (!!err) {
        console.log('Error --> ');
        console.log('Error --> ', err);
    } else {
        console.log('Connected');
    }
});

// Create DB
app.get('/createdb', (req, res) => {
    let sql = 'CREATE DATABASE hotel_management_db';
    db.query(sql, (err, result) => {
        if (err) throw err;
        console.log(result);
        res.send({
            message: 'Database created successfully!',
            code: 200,
            error: false
        });
    });
});

//Employee Register

//Employee table create

app.get('/employeetable', (req, res) => {
    let sql = 'CREATE TABLE employee(emp_id int NOT NULL AUTO_INCREMENT,emp_fname VARCHAR(256), emp_lname VARCHAR(256), emp_contactno bigint, emp_address VARCHAR(256), emp_email VARCHAR(256), password VARCHAR(256), PRIMARY KEY(emp_id))';
    db.query(sql, (err, result) => {
        if (err) throw err;
        console.log(result);
        res.send({
            message: 'Table created successfully!',
            code: 200,
            error: false
        });
    });
});

//Employee data inserting

app.post('/employee_register', function (req, res) {

    console.log("Body", req.body);
    const reqData = req.body;
    let sql = 'INSERT INTO employee SET ?';
    let post = { emp_id: reqData.emp_id, emp_fname: reqData.emp_fname, emp_lname: reqData.emp_lname, emp_contactno: reqData.emp_contactno, emp_address: reqData.emp_address, emp_email: reqData.emp_email, password: reqData.password };
    db.query(sql, post, (err, result) => {
        if (err) throw err;
        console.log(result);
        res.send({
            message: 'Register successfully!',
            code: 200,
            error: false
        });
    });
});

app.post('/auth', (req, res) => {
    const reqData = req.body;
    console.log('reqData', req.body);
    let result1;
    let sql = `SELECT emp_email, password from employee where emp_email = ?`;
    let query = db.query(sql, [reqData.emp_email], (err, result) => {
        if (err) throw err;
        console.log(result);
        result1 = Object.values(JSON.parse(JSON.stringify(result)));
        console.log(result1);
        if (result1[0].emp_email == reqData.emp_email && result1[0].password == reqData.password) {
            res.send({
                message: 'Logged in successfully!',
                code: 200,
                error: false
            })
        } else if (result1[0].emp_email !== reqData.emp_email && result1[0].password !== reqData.password) {
            res.send('Incorrect Email or Password');
        }
        res.end();

    });
});

// Create room table
app.get('/createroomtable', (req, res) => {
    let sql = 'CREATE TABLE room(id int NOT NULL AUTO_INCREMENT, room_no int, room_type VARCHAR(255), bed_type VARCHAR(255), price float, PRIMARY KEY (id))';
    db.query(sql, (err, result) => {
        if (err) throw err;
        console.log(result);
        res.send({
            message: 'Table created successfully!',
            code: 200,
            error: false
        });
    });
});

// Add Room
app.post('/add-room', function (req, res) {
    console.log("Body ", req.body);
    const reqData = req.body;
    let sql = 'INSERT INTO room SET ?';
    let post = { room_no: reqData.room_no, room_type: reqData.room_type, bed_type: reqData.bed_type, price: reqData.price };
    db.query(sql, post, (err, result) => {
        if (err) throw err;
        console.log(result);
        res.send({
            message: 'Room added successfully!',
            code: 200,
            error: false
        });
    });
});

app.get('/updateroom', (req, res) => {
    const reqData = req.body;
    let sql = "UPDATE room set room_no= ?, room_type= ?, bed_type= ?, price= ? WHERE id= ?";
    let query = db.query(sql, [reqData.room_no, reqData.room_type, reqData.bed_type, reqData.price, reqData.id], (err, result) => {
        if (err) throw err;
        console.log(result);
        res.send({
            message: 'Room updated successfully!',
            code: 200,
            error: false,
        });
    });
})

app.get('/deleteroom', (req, res) => {
    const reqData = req.body;
    let sql = "Delete from room WHERE id= ?";
    let query = db.query(sql, [reqData.id], (err, result) => {
        if (err) throw err;
        console.log(result);
        res.send({
            message: 'Room deleted successfully!',
            code: 200,
            error: false
        });
    });
})

// Get single room with room number
app.post("/get-room", function (req, res) {
    const reqData = req.body;
    let sql = `Select * from room where room_no = ?`;
    let query = db.query(sql, [reqData.room_no], (err, result) => {
        if (err) throw err;
        console.log(result);
        res.send({
            message: 'Room Data retrieved',
            code: 200,
            error: false,
            data: result
        });
    });
});

// Get all room 
app.get("/get-all-room", function (req, res) {
    let sql2 = `Select * from room`;
    db.query(sql2, (err, result) => {
        if (err) throw err;
        console.log('DB result', result);
        res.send({
            message: 'Logged in successfully!',
            code: 200,
            error: false,
            data: result
        })
    });
});

//CUSTOMER CHECK-IN PART

//customer check-in table create
app.get('/customertable', (req, res) => {
    let sql = 'CREATE TABLE checkin(id int NOT NULL AUTO_INCREMENT,name VARCHAR(256), room_type VARCHAR(255), mobile_no bigint,address VARCHAR(256), bed_type VARCHAR(255), gender VARCHAR(256), email VARCHAR(256), room_no int, check_in date, id_proof bigint, price float, PRIMARY KEY (id))';
    db.query(sql, (err, result) => {
        if (err) throw err;
        console.log(result);
        res.send({
            message: 'Table created',
            code: 200,
            error: false
        });
    });
});

//customer data insert

app.post('/customer-checkin', function (req, res) {

    console.log("Body ", req.body);
    const reqData = req.body;
    let sql = 'INSERT INTO checkin SET ?';
    let post = { id: reqData.id, name: reqData.name, room_type: reqData.room_type, mobile_no: reqData.mobile_no, address: reqData.address, bed_type: reqData.bed_type, gender: reqData.gender, email: reqData.email, room_no: reqData.room_no, check_in: reqData.check_in, id_proof: reqData.id_proof, price: reqData.price };
    db.query(sql, post, (err, result) => {
        if (err) throw err;
        console.log(result);
        console.log({
            message: 'Data inserted successfully',
            code: 200,
            error: false
        });
    });
});

//Customer Checkout 

//customer checkout table create

app.get('/customercheckout', (req, res) => {
    let sql = 'CREATE TABLE checkout(id int NOT NULL AUTO_INCREMENT,name VARCHAR(256), check_in date, check_out date,room_no int, mobile_no bigint, price_per_day int, number_of_days int, amount int, email VARCHAR(256), PRIMARY KEY (id))';
    db.query(sql, (err, result) => {
        if (err) throw err;
        console.log(result);
        res.send({
            message: 'Table created successfully!',
            code: 200,
            error: false
        });
    });
});

//customer checkout table data insertion

//data retrieval from checkin table for non editable field
app.get("/getcheckinroom", function (req, res) {
    const reqData = req.body;
    let result1;
    let sql = `Select name, mobile_no, room_no, check_in, email from checkin where room_no = ?`;
    let query = db.query(sql, [reqData.room_no], (err, result) => {
        if (err) throw err;
        console.log(result);
        res.send('Got room');
        result1 = Object.values(JSON.parse(JSON.stringify(result)));
        console.log(result1);
    });

    //data insertion in checkout table
    setTimeout(function () {
        const reqData = req.body;
        let money = reqData.price_per_day * reqData.number_of_days;
        let sql1 = `INSERT INTO checkout SET name= ?, room_no=?, check_in= ?, check_out= ?, mobile_no= ?, price_per_day= ?, number_of_days= ?, amount= ?, email= ?`;
        let query1 = db.query(sql1, [result1[0].name, result1[0].room_no, result1[0].check_in, reqData.check_out, result1[0].mobile_no, reqData.price_per_day, reqData.number_of_days, money, result1[0].email], (err, result) => {
            if (err) throw err;
            console.log({
                message: 'Data added successfully!',
                code: 200,
                error: false
            });
        })
    }, 1000)
});
// customer billing details table

app.get('/customerbillingtable', (req, res) => {
    let sql = 'CREATE TABLE billing(id int NOT NULL AUTO_INCREMENT,name VARCHAR(256), mobile_no bigint, gender VARCHAR(256),email VARCHAR(256), id_proof bigint, address VARCHAR(256), check_in date, room_no int, room_type VARCHAR(255), bed_type VARCHAR(255), service float, amount float, grand_total float, PRIMARY KEY (id))';
    db.query(sql, (err, result) => {
        if (err) throw err;
        console.log(result);
        res.send({
            message: 'Table created succsessfully',
            code: 200,
            error: false
        });
    });
});

//Data retrieval from checkin table

app.get("/getcheckoutdetails", function (req, res) {

    const reqData = req.body;
    let result1 = [];
    let sql = `Select amount from checkout where room_no = ?`;
    let query = db.query(sql, [reqData.room_no], (err, result) => {
        if (err) throw err;
        console.log(result);
        // res.send('Got room');
        result1 = Object.values(JSON.parse(JSON.stringify(result)));
        console.log(result1);
    });

    let result2;
    let sql1 = `Select name, mobile_no, gender, email, id_proof, address, check_in, room_no, room_type, bed_type from checkin where room_no= ?`;
    let query1 = db.query(sql1, [reqData.room_no], (err, result) => {
        if (err) throw err;
        console.log(result);
        // res.send('Got checkin details');
        result2 = Object.values(JSON.parse(JSON.stringify(result)));
        console.log(result2);
    });

    let service = 50;
    setTimeout(() => {
        console.log('result1 -----', result1);
        let grandTotal = service + result1[0]?.amount;
        let sql2 = 'INSERT INTO billing SET name= ?, mobile_no= ?, gender= ?, email= ?, id_proof= ?, address= ?, check_in= ?, room_no= ?, room_type= ?, bed_type= ?, service= ?, amount= ?, grand_total= ?';
        let query2 = db.query(sql2, [result2[0].name, result2[0].mobile_no, result2[0].gender, result2[0].email, result2[0].id_proof, result2[0].address, result2[0].check_in, result2[0].room_no, result2[0].room_type, result2[0].bed_type, service, result1[0]?.amount, grandTotal], (err, result) => {
            if (err) throw err;
        })
    }, 1000);

    let sql3 = `Select * from billing where room_no = ?`;
    let query3 = db.query(sql3, [reqData.room_no], (err, result) => {
        if (err) throw err;
        console.log(result);
        res.send({
            message: 'Bill created successfully!',
            code: 200,
            error: false,
            data: result
        });
    });

});

app.listen(3000, function () {
    console.log("Server is running on port 3000");
});