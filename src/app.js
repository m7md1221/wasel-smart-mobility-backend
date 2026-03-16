const express = require('express');
const bodyparser = require('body-parser');
const app = express();

const v1Routes = require("./routes/v1");

// Middleware
app.use(express.json());
app.use(bodyparser.json());
// Routes
app.use("/api/v1", v1Routes);

app.get('/', (req, res) => {
    res.send("Hello World");
});

app.get('/blog', (req, res) => {
    res.send("Hello blog");
});
// Error route (optional)
app.use((req, res) => res.status(404).json({ message: "Route not found" }));

module.exports = app;