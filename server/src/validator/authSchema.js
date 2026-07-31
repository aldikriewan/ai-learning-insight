const Joi = require("joi");

// Schema untuk Register
const RegisterSchema = Joi.object({
  name: Joi.string().min(3).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(), // Minimal 8 karakter agar aman
  phone: Joi.string().optional(),
});

// Schema untuk Login
const LoginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

module.exports = { RegisterSchema, LoginSchema };
