require("dotenv").config(); // Membaca file .env
const Hapi = require("@hapi/hapi");
const Jwt = require("hapi-auth-jwt2");

// Import Routes
const authRoutes = require("./api/auth/routes");
const studentRoutes = require("./api/students/routes");
const adminRoutes = require("./api/admin/routes");

const init = async () => {
  const server = Hapi.server({
    port: process.env.PORT || 5000,
    host: process.env.HOST || "localhost",
    routes: {
      cors: {
        origin: ["*"],
        credentials: true,
        headers: ["Content-Type", "Authorization"],
        additionalHeaders: ["Authorization"],
      },
    },
  });

  await server.register(Jwt);

  server.auth.strategy("jwt", "jwt", {
    key: process.env.JWT_SECRET,
    validate: async (decoded, request, h) => {
      return { isValid: true };
    },
    verifyOptions: { algorithms: ["HS256"] },
  });

  server.route([...authRoutes, ...studentRoutes, ...adminRoutes]);

  await server.start();
  console.log("🚀 Server berjalan pada %s", server.info.uri);
};

process.on("unhandledRejection", (err) => {
  console.log(err);
  process.exit(1);
});

init();
