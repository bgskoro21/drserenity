import Joi from "joi";

const checkoutValidation = Joi.object({
  address: Joi.string().required(),
});

const updateOrderValidation = Joi.object({
  id: Joi.string().required(),
  type: Joi.string().required(),
});

const paymentValidation = Joi.string().required();

export { checkoutValidation, updateOrderValidation, paymentValidation };
