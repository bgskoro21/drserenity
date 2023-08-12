import { prismaClient } from "../application/database.js";
import mail from "../application/mail.js";
import { ResponseError } from "../err/response-error.js";
import { createCustomerValidation, getCustomerValidation, loginCustomerValidation, resetPasswordValidation, updateCustomerValidation } from "../validation/customer-validation.js";
import { validate } from "../validation/validation.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// Fungsi untuk membuat verification token
const generateVerificationToken = (email) => {
  const secret = process.env.REGISTER_SECRET_KEY;
  const expiresIn = "1d";

  const token = jwt.sign({ email }, secret, { expiresIn: expiresIn });
  return token;
};

const create = async (request) => {
  request = validate(createCustomerValidation, request);

  const totalCustomerInDatabase = await prismaClient.customer.count({
    where: {
      email: request.email,
    },
  });

  if (totalCustomerInDatabase > 0) {
    throw new ResponseError(400, "Email has been registered!");
  }

  request.password = await bcrypt.hash(request.password, 10);

  const newUser = await prismaClient.customer.create({
    data: request,
    select: {
      email: true,
      name: true,
      profile_picture: true,
    },
  });

  const verificationToken = generateVerificationToken(newUser.email);
  const verificationLink = `http://localhost:4000/verify/${verificationToken}`;

  const mailOptions = {
    from: "bagaskara_dwi_putra@teknokrat.ac.id",
    to: newUser.email,
    subject: "Email Verification",
    html: `Please click the link below to verify your email:<br><a href="${verificationLink}">${verificationLink}</a>`,
  };

  const message = await mail.sendVerificationEmail(mailOptions);
  if (message instanceof ResponseError) {
    throw message;
  }
  return message;
};

const verify = async (user, token) => {
  const userVerify = await prismaClient.customer.findUnique({
    where: {
      email: user.email,
    },
  });

  if (!userVerify) {
    throw new ResponseError(404, "User is not found!");
  }

  if (userVerify.verified_at) {
    throw new ResponseError(400, "User has beeen verified!");
  }

  await prismaClient.invalidToken.create({
    data: {
      token_jwt: token,
      created_at: new Date().toISOString(),
    },
  });

  return prismaClient.customer.update({
    where: {
      email: user.email,
    },
    data: {
      verified_at: new Date().toISOString(),
    },
    select: {
      email: true,
      name: true,
      profile_picture: true,
      verified_at: true,
    },
  });
};

const forgotPassword = async (email) => {
  email = validate(getCustomerValidation, email);

  const user = await prismaClient.customer.findFirst({
    where: {
      email: email,
    },
  });

  if (!user) {
    throw new ResponseError(404, "User not found!");
  }

  const forgotToken = jwt.sign({ email: user.email }, process.env.FORGOT_SECRET_KEY, { expiresIn: "1d" });
  const forgotLink = `http://localhost:4000/api/reset-password?token=${forgotToken}`;

  const mailOptions = {
    from: "bagaskara_dwi_putra@teknokrat.ac.id",
    to: user.email,
    subject: "Forgot Password",
    html: `Please click the link below to forgot your password:<br><a href=${forgotLink}>${forgotLink}</a>`,
  };

  const message = await mail.sendForgotPasswordLink(mailOptions);
  if (message instanceof ResponseError) {
    throw message;
  }
  return message;
};

const checkForgotToken = async (user, token) => {
  const email = await prismaClient.customer.findFirst({
    where: {
      email: user.email,
    },
    select: {
      email: true,
    },
  });

  if (!email) {
    throw new ResponseError(404, "User not found!");
  }

  await prismaClient.invalidToken.create({
    data: {
      token_jwt: token,
      created_at: new Date().toISOString(),
    },
  });

  return email;
};

const resetPassword = async (request) => {
  request = validate(resetPasswordValidation, request);

  const totalCustomerInDatabase = await prismaClient.customer.count({
    where: {
      email: request.email,
    },
  });

  if (totalCustomerInDatabase !== 1) {
    throw new ResponseError(404, "User not found!");
  }

  if (request.password !== request.password_confirmation) {
    throw new ResponseError(400, "Password confirmation doesn't match!");
  }

  const password = await bcrypt.hash(request.password, 10);

  return prismaClient.customer.update({
    where: {
      email: request.email,
    },
    data: {
      password: password,
    },
  });
};

const login = async (request) => {
  request = validate(loginCustomerValidation, request);

  const user = await prismaClient.customer.findFirst({
    where: {
      email: request.email,
    },
  });

  if (!user) {
    throw new ResponseError(401, "Email or password is wrong!");
  }

  const isPassworValid = await bcrypt.compare(request.password, user.password);

  if (!isPassworValid) {
    throw new ResponseError(401, "Email or password is wrong!");
  }

  const accessToken = jwt.sign({ email: user.email, isAdmin: false }, process.env.ACCESS_SECRET_KEY, { expiresIn: "1h" });
  const refreshToken = jwt.sign({ email: user.email, isAdmin: false }, process.env.REFRESH_SECRET_KEY, { expiresIn: "7d" });

  return {
    accessToken: accessToken,
    refreshToken: refreshToken,
  };
};

const get = async (email) => {
  email = validate(getCustomerValidation, email);

  const customer = await prismaClient.customer.findFirst({
    where: {
      email: email,
    },
    select: {
      email: true,
      name: true,
      profile_picture: true,
    },
  });

  if (!customer) {
    throw new ResponseError(404, "User is not found!");
  }

  return customer;
};

const update = async (email, request) => {
  request = validate(updateCustomerValidation, request);

  const customer = await prismaClient.customer.findFirst({
    where: {
      email: email,
    },
  });

  if (!customer) {
    throw new ResponseError(404, "User is not found!");
  }

  const data = {};

  if (request.name) {
    data.name = request.name;
  }

  if (request.password) {
    data.password = await bcrypt.hash(request.password, 10);
  }

  if (request.profile_picture) {
    data.profile_picture = request.profile_picture;
  }

  return prismaClient.customer.update({
    where: {
      email: email,
    },
    data: data,
    select: {
      email: true,
      name: true,
      profile_picture: true,
    },
  });
};

const logout = async (email, token) => {
  email = validate(getCustomerValidation, email);

  const totalCustomerInDatabase = await prismaClient.customer.count({
    where: {
      email: email,
    },
  });

  if (totalCustomerInDatabase !== 1) {
    throw new ResponseError(404, "User is not found!");
  }

  await prismaClient.invalidToken.create({
    data: {
      token_jwt: token,
      created_at: new Date(),
    },
    select: {
      token_jwt: true,
      created_at: true,
    },
  });

  return "OK";
};

export default {
  create,
  login,
  get,
  update,
  logout,
  verify,
  forgotPassword,
  checkForgotToken,
  resetPassword,
};
