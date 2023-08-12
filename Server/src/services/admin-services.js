import { prismaClient } from "../application/database.js";
import { ResponseError } from "../err/response-error.js";
import { createAdminValidation, getAdminValidation, loginAdminValidation, updateAdminValidation } from "../validation/admin-validation.js";
import { validate } from "../validation/validation.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const create = async (request) => {
  request = validate(createAdminValidation, request);

  const totalAdminInDatabase = await prismaClient.admin.count({
    where: {
      username: request.username,
    },
  });

  if (totalAdminInDatabase > 0) {
    throw new ResponseError(400, "Username has been registered!");
  }

  request.password = await bcrypt.hash(request.password, 10);

  return prismaClient.admin.create({
    data: request,
    select: {
      username: true,
      name: true,
    },
  });
};

const getAllAdmin = async () => {
  const admin = await prismaClient.admin.findMany({
    select: {
      username: true,
      name: true,
      profile_picture: true,
    },
  });

  return admin;
};

const login = async (request) => {
  request = validate(loginAdminValidation, request);

  const user = await prismaClient.admin.findFirst({
    where: {
      username: request.username,
    },
  });

  if (!user) {
    throw new ResponseError(401, "Username or password is wrong!");
  }

  const isPassworValid = await bcrypt.compare(request.password, user.password);

  if (!isPassworValid) {
    throw new ResponseError(401, "Username or password is wrong!");
  }

  const accessToken = jwt.sign({ username: user.username, isAdmin: true }, process.env.ACCESS_SECRET_KEY, { expiresIn: "2h" });
  const refreshToken = jwt.sign({ username: user.username, isAdmin: true }, process.env.REFRESH_SECRET_KEY, { expiresIn: "7d" });

  return {
    accessToken: accessToken,
    refreshToken: refreshToken,
  };
};

const get = async (username) => {
  username = validate(getAdminValidation, username);

  const user = await prismaClient.admin.findFirst({
    where: {
      username: username,
    },
    select: {
      username: true,
      name: true,
    },
  });

  if (!user) {
    throw new ResponseError(404, "User is not found!");
  }

  return user;
};

const update = async (username, request) => {
  request = validate(updateAdminValidation, request);

  const totalAdminInDatabase = await prismaClient.admin.count({
    where: {
      username: username,
    },
  });

  if (totalAdminInDatabase !== 1) {
    throw new ResponseError(404, "User is not found!");
  }

  const data = {};

  if (request.password) {
    data.password = await bcrypt.hash(request.password, 10);
  }

  if (request.name) {
    data.name = request.name;
  }

  if (request.profile_picture) {
    data.profile_picture = request.profile_picture;
  }

  return prismaClient.admin.update({
    data: data,
    where: {
      username: username,
    },
    select: {
      username: true,
      name: true,
      profile_picture: true,
    },
  });
};

const logout = async (username, token) => {
  username = validate(getAdminValidation, username);

  const totalAdminInDatabase = await prismaClient.admin.count({
    where: {
      username: username,
    },
  });

  if (totalAdminInDatabase !== 1) {
    throw new ResponseError(404, "User is not found!");
  }

  await prismaClient.invalidToken.create({
    data: {
      token_jwt: token,
      created_at: new Date(),
    },
  });

  return "OK";
};

export default { create, login, get, update, logout, getAllAdmin };
