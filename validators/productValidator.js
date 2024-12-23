import Joi from "joi";

export const createProductSchema = Joi.object({
  name: Joi.string().required(),
  description: Joi.string().required(),
  price: Joi.number().required(),
  stock: Joi.number().required(),
});

export const updateProductSchema = Joi.object({
  name: Joi.string(),
  description: Joi.string(),
  price: Joi.number(),
  stock: Joi.number(),
});
