/* eslint-disable prettier/prettier */
/* eslint-disable arrow-body-style */
 
 
 // * Catch async
// function will get called as soon a new function is created.
  module.exports = fn => {
  return (req, res, next) => {
    // will catch error when error is found, and the error ends ups in the globalErrorHandling middleware.
    // with the code below you dont need a catch block.
    fn(req, res, next).catch(err => next(err));
  };
};