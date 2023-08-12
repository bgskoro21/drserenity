import Joi from "joi";

const createSizesValidation = Joi.object({
  name: Joi.string().max(100).required().messages({
    "string.empty": "Size is required!",
  }),
  stock: Joi.number().positive().required(),
});

const getSizesValidation = Joi.number().positive().required();

const updateSizesValidation = Joi.object({
  id: Joi.number().positive().required(),
  name: Joi.string().max(100).required(),
  stock: Joi.number().positive().required(),
});

export { createSizesValidation, getSizesValidation, updateSizesValidation };
