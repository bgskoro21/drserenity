import { ResponseError } from "../err/response-error.js";

export const errorMiddleware = (err, req, res, next) => {
  if (!err) {
    next();
    return;
  }

  if (Array.isArray(err)) {
    return res.status(400).json({
      errors: err,
    });
  }

  if (err instanceof ResponseError) {
    return res.status(err.status).json({
      errors: err.message,
    });
  } else {
    return res.status(500).json({
      errors: err.message,
    });
  }
};
