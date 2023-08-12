import Joi from "joi";

const createProductsValidation = Joi.object({
  name: Joi.string().max(100).required().messages({
    "string.empty": "Name of products is required",
  }),
  prices: Joi.number().positive().required().messages({
    "number.positive": "Prices must be positive",
    "number.required": "Prices is required",
  }),
  picture: Joi.string().required(),
  description: Joi.string().required(),
  category_id: Joi.number().positive().required().messages({
    "number.positive": "Category must be selected",
  }),
});

const getDetailProductsValidation = Joi.number().positive().required();

const getProductsValidation = Joi.object({
  page: Joi.number().min(1).positive().default(1),
  size: Joi.number().min(1).positive().max(100).default(10),
});

const updateProductsValidation = Joi.object({
  id: Joi.number().positive().required(),
  name: Joi.string().max(100).required(),
  prices: Joi.number().positive().required(),
  picture: Joi.string().optional(),
  description: Joi.string().required(),
  category_id: Joi.number().positive().required(),
});

const searchProductsValidation = Joi.object({
  page: Joi.number().min(1).positive().default(1),
  size: Joi.number().min(1).positive().max(100).default(10),
  name: Joi.string().optional(),
  description: Joi.string().optional(),
  prices: Joi.number().positive().optional(),
});

export { createProductsValidation, getDetailProductsValidation, updateProductsValidation, getProductsValidation, searchProductsValidation };
