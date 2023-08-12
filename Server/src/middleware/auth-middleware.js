import { ResponseError } from "../err/response-error.js";
import jwt from "jsonwebtoken";
import { prismaClient } from "../application/database.js";

export const authMiddleware = (req, res, next) => {
  // const token = req.headers.authorization;
  const token = req.headers.authorization.split(" ")[1];

  if (!token) {
    throw new ResponseError(401, "Unauthorized");
  } else {
    jwt.verify(token, process.env.ACCESS_SECRET_KEY, async (err, user) => {
      if (err) {
        res.status(403).json({ errors: err.message });
      }

      const invalidToken = await prismaClient.invalidToken.findFirst({
        where: {
          token_jwt: token,
        },
      });

      if (invalidToken) {
        res.status(403).json({ errors: "Token is invalid!" });
      }

      req.user = user;
      next();
    });
  }
};
