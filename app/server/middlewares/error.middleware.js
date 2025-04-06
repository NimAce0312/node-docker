const errorMiddleware = (err, req, res, next) => {
  try {
    let error = { ...err };
    error.message = err.message;
    console.log(err);

    // Mongoose Bad ObjectID
    if (err.name === "CastError") {
      const message = "Invalid ObjectID format.";
      error = new Error(message);
      error.status = 400;
    }

    // Mongoose duplicate key
    if (err.code === 11000) {
      const message = "Duplicate key error.";
      error = new Error(message);
      error.status = 409;
    }

    // Mongoose validation error
    if (err.name === "ValidationError") {
      const message = Object.values(err.errors).map((val) => val.message);
      error = new Error(message.join(", "));
      error.status = 422;
    }

    res.status(error.status || 500).json({
      success: false,
      error: error.message || "Server Error",
    });
  } catch (err) {
    next(err);
  }
};

export default errorMiddleware;
