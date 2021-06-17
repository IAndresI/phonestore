require('dotenv').config();
const express = require('express');
const fileUpload = require('express-fileupload');
const cors = require('cors');
const path = require('path');

const errorHandler = require('./middlewares/ErrorHandlingMiddleware');
const router = require('./routes');

const PORT = process.env.PORT || 5000

const app = express();
app.use(express.json());
app.use(express.static(path.resolve(__dirname, 'static')))
app.use(fileUpload({}))
app.use(cors())
app.use('/api', router);
app.use(errorHandler)


const start = async () => {
  try {
    app.listen(PORT, () => {
      console.log(`Server start on ${PORT} port`);
    })
  }
  catch (err) {
    console.log(err);
  }
}


start();
