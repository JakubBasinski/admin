const express = require('express');
const appRoutes = require('./routes/appRoutes');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const USER = process.env.USER;
const PASSWORD = process.env.PASSWORD;
const PORT = process.env.PORT;

const app = express();

app.use(
  cors({
    origin: '*',
  })
);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  );
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PATCH, PUT, DELETE, OPTIONS'
  );
  next();
});

app.use(appRoutes);

mongoose
  .connect(
    `mongodb+srv://${USER}:${PASSWORD}@pierwszycluster.ram8q.mongodb.net/task3?authSource=admin&replicaSet=atlas-cx3nkc-shard-0&w=majority&readPreference=primary&retryWrites=true&ssl=true`,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then((result) => {
    console.log('CONNECTED TO MONGODB', PORT);
    app.listen(PORT);
  })
  .catch((err) => console.log(err));
