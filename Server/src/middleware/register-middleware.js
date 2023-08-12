import { prismaClient } from "../application/database.js";
import { ResponseError } from "../err/response-error.js";
import jwt from "jsonwebtoken";

export const registerMiddleware = (req, res, next) => {
  const { token } = req.params;

  if (!token) {
    throw new ResponseError(404, "Verify token not found!");
  } else {
    jwt.verify(token, process.env.REGISTER_SECRET_KEY, async (err, user) => {
      if (err) {
        res.status(403).json({ errors: err.message });
      }

      const invalidToken = await prismaClient.invalidToken.findFirst({
        where: {
          token_jwt: token,
        },
      });

      if (invalidToken === 1) {
        res.status(403).json({ errors: "Token is Invalid" });
      }

      req.user = user;
      next();
    });
  }
};
