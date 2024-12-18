const express = require("express");
const app = express();
const port = 3000;
const mysql = require("mysql");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "plantsdatabase",
  port: 3308,
});

connection.connect(function (err) {
  if (err) throw err;
  console.log("Connected!");
});

///! unsafe method
// @ POST
// app.post("/trees", (req, res) => {
//   let sql;

//   sql = `
//     INSERT INTO trees
//     (name, height, type)
//     VALUES (
//         '${req.body.name}',
//         '${req.body.height}',
//         '${req.body.type}'
//     )
//     `;
//   connection.query(sql);

//   res.json({ message: "OK " });
// });
///! safe
app.post("/trees", (req, res) => {
  let sql;

  sql = `
    INSERT INTO trees
    (name, height, type)
    VALUES (
        ?,?,?
    )
    `;
  connection.query(sql, [req.body.name, req.body.height, req.body.type]);

  res.json({ message: "OK " });
});

///! get all info
app.get("/trees", (req, res) => {
  let sql;
  sql = `
  select * from trees;`;
  connection.query(sql, function (err, result) {
    if (err) throw err;

    res.json(result);
  });
});

///! get info on specific id
app.get("/trees/:id", (req, res) => {
  let sql;
  sql = `
  select * from trees where id = ?;`;

  connection.query(sql, [req.params.id], function (err, result) {
    if (err) {
      console.log("Error while fetching");
      return res
        .status(500)
        .json({ message: "Error while fetching", error: err.message });
    }
    if (result.length === 0) {
      return res.status(404).json({ message: "Data not found" });
    }
    res.json(result[0]);
  });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
