import joi from 'joi';

export const signUp = joi.object({
  name: joi.string().required(),
  email: joi.string().email().required(),
  password: joi.string().required(),
  confirmPassword: joi.string().valid(joi.ref('password')).required(),
});

export const signIn = joi.object({
  email: joi.string().email().required(),
  password: joi.string().required(),
});

export const entry = joi.object({
  value: joi.number().required(),
  description: joi.string().required(),
  operation: joi.string().required().valid('credit', 'debit'),
  user: joi.object().required(),
  date: joi.string().required()
});
