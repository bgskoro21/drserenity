import Joi from "joi";

const createCartValidation = Joi.object({
  product_id: Joi.number().integer().required(),
  size_id: Joi.number().integer().required(),
  quantity: Joi.number().integer().min(1).required(),
});

const deleteCartValidation = Joi.number().integer().required();

export { createCartValidation, deleteCartValidation };
