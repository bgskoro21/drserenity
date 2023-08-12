import Joi from "joi";

const createCategoryValidation = Joi.object({
  name: Joi.string().max(100).required().messages({
    "string.empty": "Name of category is required",
  }),
  picture: Joi.string().required().messages({
    "any.required": "Category picture is required",
  }),
});

const getCategoryByIdValidation = Joi.number().positive().required();

const updateCategoryValidation = Joi.object({
  id: Joi.number().positive().required(),
  name: Joi.string().max(100).required(),
  picture: Joi.string().optional(),
});

export { createCategoryValidation, getCategoryByIdValidation, updateCategoryValidation };
