const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const port = process.env.PORT || 8081;
const app = express();
app.use(bodyParser.json());
app.use(cors());
app.use(bodyParser.json());

const mysql = require('mysql');
const pool  = mysql.createPool({
  connectionLimit : 10,
  host: "localhost",
  user: "root",
  password: "",
  database: "task"
});


app.post('/', (req, res)=>{
  let iduser = req.body.id;
  let dateFrom = req.body.dateFrom;
  let dateTo = req.body.dateTo;
   pool.getConnection(function(err, connection) {
    if (err) throw err;
    console.log("Connected!");
    if (iduser != ''){
      connection.query(`SELECT * FROM stats WHERE partner_id = ${iduser} AND date BETWEEN date("${dateFrom}") AND date("${dateTo}")`, function (err, result, fields) {
        if (err) throw err;
        // console.log(result);
        res.send({
          answer: result
        })
        connection.release();
      });
    } else {
      // id empty
      connection.query(`SELECT * FROM stats WHERE  date BETWEEN date("${dateFrom}") AND date("${dateTo}")`, function (err, result, fields) {
        if (err) throw err;
        res.send({
          answer: result
        })
        connection.release();
      });
    }

  });

});

app.listen(port, function(){
  console.log(`server is up at ${port}`)
});


