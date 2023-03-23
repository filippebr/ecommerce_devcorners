//Not found
const notFound = (req, res, next) => {
  const error = new Error(`Not Found: ${req.originalUrl}`);
  res.status(404).send('Sorry, we cannot find this address!');
  next(error);
};

//Error Handler
// const errorHandler = (err, res) => {
//   const statusCode = res.statusCode == 200 ? 500 : res.statusCode;
//   res.status(statusCode);
//   res.json({
//     message: err?.message,
//     stack: err?.stack
//   })
// };

const errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode == 200 ? 500 : res.statusCode;
  res.status(statusCode);
  res.json({
    message: err?.message,
    stack: err?.stack
  })
  next(err); // add this line to pass the error to the next middleware
};

module.exports = { notFound, errorHandler };