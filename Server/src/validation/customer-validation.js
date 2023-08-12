import Joi from "joi";

const createCustomerValidation = Joi.object({
  email: Joi.string().max(100).email().required(),
  name: Joi.string().max(100).required(),
  password: Joi.string().max(100).required(),
});

const loginCustomerValidation = Joi.object({
  email: Joi.string().max(100).email().required(),
  password: Joi.string().max(100).required(),
});

const getCustomerValidation = Joi.string().max(100).required().email();

const updateCustomerValidation = Joi.object({
  name: Joi.string().max(100).optional(),
  password: Joi.string().max(100).optional(),
  profile_picture: Joi.string().optional(),
});

const resetPasswordValidation = Joi.object({
  email: Joi.string().max(100).required().email(),
  password: Joi.string().max(100).required(),
  password_confirmation: Joi.string().max(100).required(),
});

export { createCustomerValidation, loginCustomerValidation, getCustomerValidation, updateCustomerValidation, resetPasswordValidation };
