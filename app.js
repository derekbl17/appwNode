const express = require("express");
const app = express();
const port = 3000;
const mysql = require("mysql");
const cors = require("cors");

app.use(cors());
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
    );
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

// doesnt work
///! @PUT update /:id
// app.put("/trees/:id", (req, res) => {
//   let sql = `
//   update plants
//   set name = ?, height = ?, type = ?
//   where id = ?;`;

//   connection.query(
//     sql,
//     [req.body.name, req.body.height, req.body.type, req.params.id],
//     (err, result) => {
//       const selectSQL = `select * from plants where id = ?;`;

//       connection.query(selectSQL, [req.params.id], (err, updatedResult) => {
//         res.json({
//           message: "Record updated",
//           updatedResult: updatedResult[0],
//         });
//       });
//     }
//   );
// });
// update working =>
app.put("/trees/:id", function (req, res) {
  let sql = `
  UPDATE trees
  SET name = ?, height = ?, type = ?
  WHERE id = ?
  `;
  connection.query(
    sql,
    [req.body.name, req.body.height, req.body.type, req.params.id],
    (err, result) => {
      const selectSQL = `SELECT * FROM plants WHERE id = ?`;

      connection.query(selectSQL, [req.params.id], (err, updatedResult) => {
        res.json({
          message: "Record updated",
          updatedResult: updatedResult[0],
        });
      });
    }
  );
});

///@ DELETE /:id
app.delete("/trees/:id", (req, res) => {
  let sql = `
  DELETE from trees
  where id = ?;`;
  connection.query(sql, [req.params.id], function (err, result) {
    if (err) {
      return res
        .status(500)
        .json({ message: "Error deleting data", error: err.message });
    }

    res.json({
      message: "Record deleted",
      result: result,
    });
  });
});
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
