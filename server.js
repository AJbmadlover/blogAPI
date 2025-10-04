const mongoose = require('mongoose');

const app = require('./app');

const connectDB = require('./config/db');

require('dotenv').config();

const PORT = process.env.PORT || 5000;

connectDB();

app.listen(PORT, ()=>{
    console.log(`Server is running at port ${PORT}`);
})