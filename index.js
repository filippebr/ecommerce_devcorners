const bodyParser = require('body-parser');
const express = require('express');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');

// const { errorHandler, notFound } = require('./middlewares/errorHandler');

const app = express();
const dotenv = require('dotenv').config();
const PORT = process.env.PORT || 4000;
const dbConnect = require('./config/dbConnect');

const authRouter = require('./routes/authRoute');
const productRouter = require('./routes/productRoute');
const blogRouter = require('./routes/blogRoute');
const prodCategoryRouter = require('./routes/prodCategoryRoute');
const blogCategoryRouter = require('./routes/blogCategoryRoute');
const brandRouter = require('./routes/brandRoute');
const couponRouter = require('./routes/couponRoute');

dbConnect();

app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/api/user', authRouter);
app.use('/api/product', productRouter);
app.use('/api/blog', blogRouter);
app.use('/api/category', prodCategoryRouter);
app.use('/api/blogCategory', blogCategoryRouter);
app.use('/api/brand', brandRouter);
app.use('/api/coupon', couponRouter);

// app.use(notFound);
// app.use(errorHandler);

app.post('/users', (req, res) => {
  res.sendStatus(200)
})

if (['development', 'production'].includes(process.env.MODE)) {
  const PORT = process.env.PORT || 4000;
  app.listen(PORT, () => console.log(`App is running at http://localhost:${PORT}`));
} else {
  console.log('Server not started (test mode)')
}

module.exports = app

