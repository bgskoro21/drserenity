import Joi from "joi";

const createAdminValidation = Joi.object({
  username: Joi.string().max(100).required(),
  name: Joi.string().max(100).required(),
  password: Joi.string().max(100).required(),
});

const loginAdminValidation = Joi.object({
  username: Joi.string().max(100).required(),
  password: Joi.string().max(100).required(),
});

const getAdminValidation = Joi.string().max(100).required();

const updateAdminValidation = Joi.object({
  name: Joi.string().max(100).optional(),
  password: Joi.string().max(100).optional(),
  profile_picture: Joi.string().max(255).optional(),
});

export { createAdminValidation, loginAdminValidation, getAdminValidation, updateAdminValidation };
