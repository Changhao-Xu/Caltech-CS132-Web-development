/*
 * NAME: Changhao Xu
 * DATE: June 2, 2023
 * CS 132 Spring 2023
 * 
 * This is the app.js file for final project, an e-commerce store that sells keyboards.
 * This API supports the following endpoints:
 * GET /store
 * GET /detail
 * GET /store/:category
 * GET /cart        -- This is the optional "cart" features for graduates/seniors, I implemented for extra credit hopefully ;)
 * GET /faq         -- Option 6: An additional view for a FAQ page.
 * 
 * POST /addCart
 * POST /removeCart
 * POST /order      -- Option 2: A way for a user to buy a product/item from your e-commerce store.
 * POST /contact
 * 
 */

"use strict";
const express = require("express");
const fs = require("fs/promises");
// const globby = require("globby");
// const path = require("path");
const multer = require("multer");
const mysql = require("promise-mysql");

const app = express();
// The following app.use are from Lecture 18
// to point "/" to "public/" so that we can visit "localhost:8000/index.html"
app.use(express.static("public"));
// built-in middleware, for application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));
// built-in middleware, for application/json
app.use(express.json());
// use "multer" module, for multipart/form-data (required with FormData)
app.use(multer().none());

const CLIENT_ERR_CODE = 400;
const SERVER_ERR_CODE = 500;
const SERVER_ERROR = "Server is currently down. Please try again later.";

/**
 * This is the starter template of SQL Connection from Extra Lecture: Node.js and SQL Connection
 * Establishes a database connection to the keyboarddb and returns the database object.
 * Any errors that occur during connection should be caught in the function
 * that calls this one.
 * @returns {Object} - The database object for the connection.
 */
async function getDB() {
    const db = await mysql.createConnection({
      // Variables for connections to the database.
      host: "localhost",      // fill in with server name
      port: "3306",           // fill in with a port (will be different mac/pc)
      user: "root",           // fill in with username
      password: "root",       // fill in with password
      database: "keyboarddb"  // fill in with db name
    });
    return db;
  }
  
// Handle GET /store, display all products in main view page
app.get("/store", async (req, res, next) => {
  let db;
  try {
    db = await getDB();
    let qry = "SELECT * FROM store";
    let rows = await db.query(qry);
    let jsonResponse = rows.map(row => {
      return {"keyboard_id": row.keyboard_id, "keyboard_img": row.keyboard_img, "keyboard_descr": row.keyboard_descr,
              "category": row.category, "price": row.price, "quantity": row.quantity};
      
    });
    res.json(jsonResponse);
  } catch (error) {
    res.status(SERVER_ERR_CODE).json({"msg": SERVER_ERROR});
  }
  if (db) { // otherwise if error, then db not defined
    db.end();
  }
});

// Handle GET /detail, request and return detailed information about a single item
app.get("/detail", async (req, res, next) => {
  if (req.query["keyboard_id"]) {
    let db;
    try {
      db = await getDB();
      let qry = `SELECT * FROM store WHERE keyboard_id = ${req.query["keyboard_id"]}`;
      let rows = await db.query(qry);
      if (rows.length) {
        let jsonResponse = rows.map(row => {
          return {"keyboard_id": row.keyboard_id, "keyboard_img": row.keyboard_img, "keyboard_descr": row.keyboard_descr,
                  "category": row.category, "price": row.price, "quantity": row.quantity};
        });
        res.json(jsonResponse);
      } else {
        res.status(CLIENT_ERR_CODE).json({ "msg": "Invalid keyboard_id. Keyboard does not exist." });
      }
    } catch (error) {
      res.status(SERVER_ERR_CODE).json({"msg": SERVER_ERROR});
    }
    if (db) { // otherwise if error, then db not defined
      db.end();
    }
  } else {
    res.status(CLIENT_ERR_CODE).json({ "msg": "Missing required keyboard_id." });
  }
});

// Handle GET /store/:category
app.get("/store/:category", async (req, res, next) => {
  if (req.params["category"].length) {
    let db;
    try {
      db = await getDB();
      let qry = `SELECT * FROM store WHERE category LIKE '%${req.params["category"]}%'`;
      let rows = await db.query(qry);
      if (rows.length) {
        let jsonResponse = rows.map(row => {
          return {"keyboard_id": row.keyboard_id, "keyboard_img": row.keyboard_img, "keyboard_descr": row.keyboard_descr,
                  "category": row.category, "price": row.price, "quantity": row.quantity};
        });
        res.json(jsonResponse);
      } else {
        res.status(CLIENT_ERR_CODE).json({"msg":"Invalid category. This category does not exist."});
      }
    } catch (error) {
      res.status(SERVER_ERR_CODE).json({"msg": SERVER_ERROR});
    }
    if (db) { // otherwise if error, then db not defined
      db.end();
    }
  } else {
    res.status(CLIENT_ERR_CODE).json({"msg":"Missing required category."});
  }
});

// Handle GET /cart, display all products in cart page
app.get("/cart", async (req, res, next) => {
  let db;
  try {
    db = await getDB();
    let qry = "SELECT * FROM cart";
    let rows = await db.query(qry);
    let jsonResponse = rows.map(row => {
      return {"keyboard_id": row.keyboard_id, "order_qty": row.order_qty};
    });
    res.json(jsonResponse);
  } catch (error) {
    res.status(SERVER_ERR_CODE).json({"msg": SERVER_ERROR});
  }
  if (db) { // otherwise if error, then db not defined
    db.end();
  }
});

// Handle POST /addCart, add item from the cart
app.post("/addCart", async (req, res, next) => {
  let keyboard_id = req.body.keyboard_id;
  let db;
  try {
    db = await getDB();
    // validate parameters, then update cart with new product
    let validId = (await db.query(`SELECT * FROM store WHERE keyboard_id = ${keyboard_id}`)).length;
    if (validId) {
      let inCart = (await db.query(`SELECT * FROM cart WHERE keyboard_id = ${keyboard_id}`)).length;
      if (inCart) { // if item in cart already, add quantity + 1
        await db.query(`UPDATE cart SET order_qty = (order_qty + 1) WHERE keyboard_id = ${keyboard_id}`);
      } else { // if item not in cart yet, insert item into cart
        await db.query(`INSERT INTO cart(keyboard_id, order_qty) VALUES (${keyboard_id}, 1)`);
      }
      res.json({ "msg" : "Your keyboard has been added to cart!"});
    } else {
      res.status(CLIENT_ERR_CODE).json({"msg":"Invalid keyboard_id. Keyboard does not exist."});
    }
  } catch (error) {
    res.status(SERVER_ERR_CODE).json({"msg": SERVER_ERROR});
  }
  if (db) { // otherwise if error, then db not defined
    db.end();
  }
});

// Handle POST /removeCart, remove item from the cart
app.post("/removeCart", async (req, res, next) => {
  let keyboard_id = req.body.keyboard_id;
  let db;
  try {
    db = await getDB();
    // validate parameters, then update cart with new product
    let inCart = (await db.query(`SELECT * FROM cart WHERE keyboard_id = ${keyboard_id}`)).length;
    if (inCart) { // if item in cart already, subtract quantity - 1
      await db.query(`UPDATE cart SET order_qty = (order_qty - 1) WHERE keyboard_id = ${keyboard_id}`);
      // check if order_qty <=0, if so, remove item from cart
      await db.query(`DELETE FROM cart WHERE order_qty <= 0`);
      res.json({ "msg" : "Your keyboard has been removed from cart!"});
    } else {
      res.status(CLIENT_ERR_CODE).json({"msg":"Invalid request. Keyboard is not in cart."});
    }
  } catch (error) {
    res.status(SERVER_ERR_CODE).json({"msg": SERVER_ERROR});
  }
  if (db) { // otherwise if error, then db not defined
    db.end();
  }
});

// Handle POST /order
app.post("/order", async (req, res, next) => {
  let keyboard_id = req.body.keyboard_id;
  let order_qty = req.body.order_qty;
  let db;
  try {
    db = await getDB();
    // validate parameters, order_qty <= store quantity
    let resp = await db.query(`SELECT quantity FROM store WHERE keyboard_id = ${keyboard_id}`);
    let store_quantity = resp[0].quantity;
    if (order_qty <= store_quantity && store_quantity) { // order is valid
      let updated_store_quantity = store_quantity - order_qty;
      let resp = await db.query(`UPDATE store SET quantity = ${updated_store_quantity} WHERE keyboard_id = ${keyboard_id}`);
      await db.query("DELETE FROM cart");
      res.json({ "msg" : "Your order has been received!"});
    } else {
      res.status(CLIENT_ERR_CODE).json({"msg":"No sufficient keyboards to order. Please contact us for bulk order."});
    }
  } catch (error) {
    res.status(SERVER_ERR_CODE).json({"msg": SERVER_ERROR});
  }
  if (db) { // otherwise if error, then db not defined
    db.end();
  }
});

// Handle GET /faq
app.get("/faq", async (req, res, next) => {
  let db;
  try {
    db = await getDB();
    let qry = "SELECT * FROM faq";
    let rows = await db.query(qry);
    let jsonResponse = rows.map(row => {
      return {faq_id: row.faq_id, question: row.question, answer: row.answer};
    });
    res.json(jsonResponse);
  } catch (error) {
    res.status(SERVER_ERR_CODE).json({"msg": SERVER_ERROR});
  }
  if (db) { // otherwise if error, then db not defined
    db.end();
  }
});

// Handle POST /contact
app.post("/contact", async (req, res, next) => {
  let name = req.body.name;
  let email = req.body.email;
  let subject = req.body.subject;
  let inquiry = req.body.inquiry;

  // validate parameters, then update sql database with new data
  if (name && email && subject && inquiry) {
    let db;
    try {
      db = await getDB();
      let qry = `INSERT INTO contact(name, email, subject, inquiry) VALUES ('${name}', '${email}', '${subject}', '${inquiry}')`;
      await db.query(qry);
      res.json({ "msg" : "Your inquiry has been submitted!"});
    } catch (error) {
      res.status(SERVER_ERR_CODE).json({"msg": SERVER_ERROR});
    }
    if (db) { // otherwise if error, then db not defined
      db.end();
    }
  } else {
    res.status(CLIENT_ERR_CODE).json({"msg":"Missing required inquiry inputs, please complete the form."});
  }
});

// Lastly, start the app on an open port, this code is from Lecture 17
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log("Listening on port " + PORT));