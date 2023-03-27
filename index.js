const express = require("express");
const cors = require("cors");
const mongodb = require("mongodb");
const mongoclient = mongodb.MongoClient;
const app = express();
const dotenv = require("dotenv").config();
const URL = process.env.DB;
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET;

app.use(
  cors({
    origin: "*",
  })
);

app.use(express.json());

let authorize = (req, res, next) => {
  try {
    console.log(req.headers);
    if (req.headers.authorization) {
      let decodedToken = jwt.verify(req.headers.authorization, JWT_SECRET);
      if (decodedToken) {
        next();
      } else {
        res.status(401).json({ message: "Unauthorized" });
      }
    }
  } catch (error) {
    res.status(401).json({ message: "Unauthorized" });
  }
};

app.get("/",(req,res)=>{
  try {
    res.send("welcome")
  } catch (error) {
    res.send(error).status(401).json({ message: "Something went wrong" });
    
  }
})
app.post("/user/register", async (req, res) => {
  try {
    // Connect the Database
    const connection = await mongoclient.connect(URL);

    // Select the DB
    const db = connection.db("sample");

    // Hash the password
    var salt = await bcrypt.genSalt(10);
    console.log(salt);
    console.log(req.body.email);
    var hash = await bcrypt.hash(req.body.password, salt);
    req.body.password = hash;

    const user = await db.collection("users").insertOne(req.body);

    await connection.close();

    res.json({ message: "User created" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong" });
  }
});

app.post("/user/login", async (req, res) => {
  try {
    const connection = await mongoclient.connect(URL);

    const db = connection.db("sample");

    const user = await db
      .collection("users")
      .findOne({ email: req.body.email });

    if (user) {
      const compare = await bcrypt.compare(req.body.password, user.password);
      console.log(compare);
      if (compare) {
        // Issue Token
        const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
          expiresIn: "5m",
        });
        res.json({ message: "Success", token });
      } else {
        console.log("afaf");
        res.status(404).json({ message: "Incorrect Username/Password" });
      }
    } else {
      res.status(404).json({ message: "Incorrect Username/Password" });
    }
  } catch (error) {
    res.status(404).json({ message: "Incorrect Username/Password" });
  }
});

// Create
app.post("/product", authorize, async (req, res) => {
  try {
    const connection = await mongoclient.connect(URL);

    const db = connection.db("sample");

    const product = await db.collection("products").insertOne(req.body);

    await connection.close();

    res.json({ message: "Product created", id: product.insertedId });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong" });
  }
});

app.get("/products", authorize, async (req, res) => {
  try {
    const connection = await mongoclient.connect(URL);

    const db = connection.db("sample");

    const product = await db.collection("products").find({}).toArray();

    await connection.close();

    res.json(product);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong" });
  }
});

app.put("/product/:productId", authorize, async (req, res) => {
  try {
    const connection = await mongoclient.connect(URL);
    const db = connection.db("sample");
    const productData = await db
      .collection("products")
      .findOne({ _id: mongodb.ObjectId(req.params.productId) });

    if (productData) {
      delete req.body._id;
      const product = await db
        .collection("products")
        .updateOne(
          { _id: mongodb.ObjectId(req.params.productId) },
          { $set: req.body }
        );

      await connection.close();

      res.json(product);
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong" });
  }
});

app.get("/product/:productId", authorize, async (req, res) => {
  try {
    const connection = await mongoclient.connect(URL);

    const db = connection.db("sample");

    const product = await db
      .collection("products")
      .findOne({ _id: mongodb.ObjectId(req.params.productId) });

    await connection.close();

    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong" });
  }
});

app.delete(`/product/:productId`, authorize, async (req, res) => {
  try {
    const connection = await mongoclient.connect(URL);

    const db = connection.db("sample");

    const productData = await db
      .collection("products")
      .findOne({ _id: mongodb.ObjectId(req.params.productId) });

    if (productData) {
      const product = await db
        .collection("products")
        .deleteOne({ _id: mongodb.ObjectId(req.params.productId) });

      await connection.close();

      res.json(product);
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong" });
  }
});

app.listen(process.env.PORT || 3003,()=>{
  console.log(`port is running on ${process.env.PORT}`)
});
