const express = require('express');
const app = express();
const cors = require('cors');
const userRoutes = require('../routes/userRoutes.js');

app.use(cors());
app.use(express.json());

app.use('/api', userRoutes)

module.exports = app;