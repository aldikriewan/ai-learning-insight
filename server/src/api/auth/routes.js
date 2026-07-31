const AuthHandler = require("./handler");
const { RegisterSchema, LoginSchema } = require("../../validator/authSchema");

const routes = [
  {
    method: "POST",
    path: "/auth/register",
    options: {
      auth: false, // Endpoint ini terbuka (tidak butuh login)
      validate: {
        payload: RegisterSchema, // Validasi input otomatis oleh Joi
      },
    },
    handler: AuthHandler.register,
  },
  {
    method: "POST",
    path: "/auth/login",
    options: {
      auth: false, // Endpoint ini terbuka
      validate: {
        payload: LoginSchema,
      },
    },
    handler: AuthHandler.login,
  },
];

module.exports = routes;
