import nodemailer from "nodemailer";
import { ResponseError } from "../err/response-error.js";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "bagaskara_dwi_putra@teknokrat.ac.id",
    pass: "19312112",
  },
});

const sendVerificationEmail = (mailOptions) => {
  return new Promise((resolve, reject) => {
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        reject(new ResponseError(500, error.message));
      } else {
        resolve("Registration sucessful. Please verify your email");
      }
    });
  });
};

const sendForgotPasswordLink = (mailOptions) => {
  return new Promise((resolve, reject) => {
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        reject(new ResponseError(500, error.message));
      } else {
        resolve("Forgot password link has been send. Please check your email!");
      }
    });
  });
};

export default {
  sendVerificationEmail,
  sendForgotPasswordLink,
};
