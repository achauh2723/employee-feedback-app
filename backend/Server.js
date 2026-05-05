const express = require("express");
const cors = require("cors");
const sql = require("mssql");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const app = express();
app.use(cors());
app.use(express.json());

const SECRET = "mysecretkey";

const config = {
  user: "testuser",
  password: "Test@123",
  server: "localhost",
  database: "feedback_app",
  options: {
    instanceName: "SQLEXPRESS",
    trustServerCertificate: true,
  },
};

sql.connect(config)
  .then(() => console.log("Connected to SQL Server"))
  .catch((err) => console.log(err));

const verifyToken = (req, res, next) => {
  const token = req.headers["authorization"];
  if (!token) return res.status(403).send("No token");

  try {
    jwt.verify(token, SECRET);
    next();
  } catch {
    res.status(401).send("Invalid token");
  }
};

app.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const hash = await bcrypt.hash(password, 10);

    await sql.query`
      INSERT INTO users (name, email, password)
      VALUES (${name}, ${email}, ${hash})
    `;

    res.send("Registered");
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const result = await sql.query`
      SELECT * FROM users WHERE email = ${email}
    `;

    const user = result.recordset[0];
    if (!user) return res.status(401).send("User not found");

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).send("Wrong password");

    const token = jwt.sign({ id: user.id }, SECRET);
    res.json({ token });

  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
});


app.get("/employees", verifyToken, async (req, res) => {
  try {
    const result = await sql.query`SELECT * FROM employees`;
    res.json(result.recordset);
  } catch (err) {
    res.status(500).send(err);
  }
});

app.post("/employees", verifyToken, async (req, res) => {
  const { name, email } = req.body;

  try {
    await sql.query`
      INSERT INTO employees (name, email)
      VALUES (${name}, ${email})
    `;
    res.send("Employee added");
  } catch (err) {
    res.status(500).send(err);
  }
});

app.delete("/employees/:id", verifyToken, async (req, res) => {
  const id = req.params.id;

  try {
    await sql.query`DELETE FROM reviews WHERE assigned_to = ${id}`;
    await sql.query`DELETE FROM employees WHERE id = ${id}`;
    res.send("Deleted");
  } catch (err) {
    res.status(500).send(err);
  }
});


app.get("/reviews", verifyToken, async (req, res) => {
  try {
    const result = await sql.query`SELECT * FROM reviews`;
    res.json(result.recordset);
  } catch (err) {
    res.status(500).send(err);
  }
});

app.post("/reviews", verifyToken, async (req, res) => {
  const { title, description, assigned_to } = req.body;

  try {
    await sql.query`
      INSERT INTO reviews (title, description, assigned_to)
      VALUES (${title}, ${description}, ${assigned_to})
    `;
    res.send("Review added");
  } catch (err) {
    res.status(500).send(err);
  }
});

app.delete("/reviews/:id", verifyToken, async (req, res) => {
  const id = req.params.id;

  try {
    await sql.query`DELETE FROM reviews WHERE id = ${id}`;
    res.send("Deleted");
  } catch (err) {
    res.status(500).send(err);
  }
});

app.get("/feedback", verifyToken, async (req, res) => {
  try {
    const result = await sql.query`
      SELECT f.*, r.title, e.name 
      FROM feedback f
      JOIN reviews r ON f.review_id = r.id
      JOIN employees e ON f.reviewer_id = e.id
    `;
    res.json(result.recordset);
  } catch (err) {
    res.status(500).send(err);
  }
});

app.post("/feedback", verifyToken, async (req, res) => {
  const { review_id, reviewer_id, comment, rating } = req.body;

  try {
    await sql.query`
      INSERT INTO feedback (review_id, reviewer_id, comment, rating)
      VALUES (${review_id}, ${reviewer_id}, ${comment}, ${rating})
    `;
    res.send("Feedback added");
  } catch (err) {
    res.status(500).send(err);
  }
});

app.delete("/feedback/:id", verifyToken, async (req, res) => {
  const id = req.params.id;

  try {
    await sql.query`DELETE FROM feedback WHERE id = ${id}`;
    res.send("Deleted");
  } catch (err) {
    res.status(500).send(err);
  }
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});