import { version } from "../../package.json";
import { Router } from "express";

export default ({ config, db }) => {
  let api = Router();

  api.get("/billingslab", (req, res) => {
    //find id in billingslab table and return the billingslab
    db.query("SELECT * from billingslab where active_status=true", (err, response) => {
      if (err) {
        console.log(err.stack);
      } else {
        console.log(response.rows);
        res.json({ "billingslabs": response.rows });
      }
    });


  });
 
  //perhaps expose some API metadata at the root
  api.get("/billingslab/:id", (req, res) => {
    //find id in company table and return the company
    console.log(req.params, 'Im stupid');

    db.query(`SELECT * from billingslab where id=${req.params.id}`, (err, response) => {
      if (err) {
        console.log(err.stack);
      } else {
        console.log(response.rows);
        res.json({ "billingslabs": response.rows });
      }
    });
  });

  //perhaps expose some API metadata at the root
  // api.get("/billingslab/:id", (req, res) => {
  //   //find id in company table and return the company
  //   console.log(req.body, 'Im stupid');
  //   if(!req.body){
  //   db.query(`SELECT * from billingslab where id=${req.params.id}`, (err, response) => {
  //     if (err) {
  //       console.log(err.stack);
  //     } else {
  //       console.log(response.rows);
  //       res.json({ "billingslabs": response.rows });
  //     }
  //   });}else{
  //     db.query(`SELECT price*${req.body.qty} as estimation from billingslab where product_id=${req.body.product_id}`, (err, response) => {
  //       if (err) {
  //         console.log(err.stack);
  //       } else {
  //         console.log(response.rows);
  //         res.json({ "estimation": response.rows });
  //       }
  //     });
  //   }
  // });

  api.post("/billingslab", (req, res) => {
    //take billingslab from req and insert into billingslab table
    console.log("body", req.body);
    const { id, product_id, price, active_status} = req.body;
    db.query(`insert into billingslab values(${id},${product_id},${price},${active_status})`, (err, response) => {
      if (err) {
        console.log(err.stack);
      } else {
        console.log(response.rows);
        res.json({ "status": "successfull", "response": response.rows });
      }
    });
  });

  api.put("/billingslab/:id", (req, res) => {
    console.log("req", req.params);
    console.log("body", req.body);
    const { product_id, price, active_status} = req.body;
    //take company id from path and find the id and update
    db.query(`update billingslab set product_id=${product_id}, price=${price}, active_status=${active_status} where id=${req.params.id}`, (err, response) => {
      if (err) {
        console.log(err.stack);
      } else {
        console.log(response.rows);
        res.json({ "status": "successfull", "response": response.rows, version, status: "live", method: "put" });
      }
    });
    //res.json({ version, status: "live", method: "put" });
  });

  api.delete("/billingslab/:id", (req, res) => {
    console.log("req", req.params);
    const active_status = false
    //take company id from path and find the id and update flag
    db.query(`update billingslab set active_status=${active_status} where id=${req.params.id}`, (err, response) => {
      if (err) {
        console.log(err.stack);
      } else {
        console.log(response.rows);
        res.json({ "status": "successfull", "response": response.rows, version, status: "live", method: "delete" });
      }
    });
    //res.json({ version, status: "live", method: "delete" });
  });

  // api.get("/billingslab/estimation", (req, res) => {
  //   //find id in company table and return the company
  //   // console.log(req.params, 'Im stupid');
  //   console.log(req.body,'body of estimation');
    

  //   db.query(`SELECT price*${req.body.qty} as estimation from billingslab where product_id=${req.body.product_id}`, (err, response) => {
  //     if (err) {
  //       console.log(err.stack);
  //     } else {
  //       console.log(response.rows);
  //       res.json({ "estimation": response.rows });
  //     }
  //   });
  // });

  api.get("/billingslab_estimate", (req,res) => {
    let arr = []
    db.query(`SELECT * from billingslab where active_status = true`, (err, response) => {
      if (err) {
        console.log(err.stack);
      } else {
        console.log(response.rows);
        // console.log(req.body);
        req.body.forEach(element => {
          response.rows.forEach(item =>{
            if( element.product_id == item.product_id){
              arr.push(element.qty*item.price);
            }
          })
        });
        res.json({"estimation": arr});
      }
    })
  });

  return api;
};
