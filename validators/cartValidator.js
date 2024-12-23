import Joi from "joi";

export const addToCartSchema = Joi.object({
  productId: Joi.string().required(),
  quantity: Joi.number().min(1).required(),
});

export const removeFromCartSchema = Joi.object({
  productId: Joi.string().required(),
  quantity: Joi.number().min(1).required(),
});
