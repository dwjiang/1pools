const errorHandler = (err, req, res, next) => {
  if (err.status) {
    res.status(err.status).json({ message: err.message });
  } else {
    console.log(err);
    res.status(500).json({ message: "Internal server error" });
  }
}

const asyncWrapper = (cb) => {
  return (req, res, next) => cb(req, res, next).catch(next);
}

module.exports = {
  errorHandler,
  asyncWrapper,
};
