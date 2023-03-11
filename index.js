const express = require('express')
const app = express()
const dotenv = require('dotenv').config()
const PORT = process.env.PORT || 4000
const dbConnect = require('./config/dbConnect')
const authRoute = require('./routes/authRoute')
dbConnect();

app.use('/', (req, res) => {
  res.send('Hello from server side')
})

app.use('/api/user', authRoute);

app.listen(PORT, () => {
  console.log(`Server is running PORT ${PORT}`);
})