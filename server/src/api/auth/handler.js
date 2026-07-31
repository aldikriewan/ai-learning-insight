const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");
const Boom = require("@hapi/boom"); // Untuk error handling standar HTTP

const prisma = new PrismaClient();

const AuthHandler = {
  // 1. REGISTER SISWA
  async register(request, h) {
    try {
      const { name, email, password, phone } = request.payload;

      // Cek apakah email sudah terdaftar
      const existingUser = await prisma.users.findUnique({
        where: { email: email },
      });

      if (existingUser) {
        // Return 409 Conflict jika email sudah ada
        throw Boom.conflict("Email sudah terdaftar");
      }

      // Hash password (Enkripsi satu arah)
      const hashedPassword = await bcrypt.hash(password, 10);

      // Simpan ke Database
      const newUser = await prisma.users.create({
        data: {
          name,
          email,
          password_hash: hashedPassword,
          phone,
          user_role: "admin", // Default role selalu student
        },
      });

      // Return response sukses (tanpa password)
      return h
        .response({
          status: "success",
          message: "Registrasi berhasil",
          data: {
            id: newUser.id,
            email: newUser.email,
            name: newUser.name,
          },
        })
        .code(201);
    } catch (error) {
      console.error(error);
    }
  },

  // 2. LOGIN SISWA
  async login(request, h) {
    const { email, password } = request.payload;

    // Cari user berdasarkan email
    const user = await prisma.users.findUnique({
      where: { email: email },
    });

    // Jika user tidak ketemu ATAU password salah
    if (!user || !(await bcrypt.compare(password, user.password_hash))) {
      throw Boom.unauthorized("Email atau password salah");
    }

    // Generate Token (JWT)
    // Token ini adalah "KTP Digital" user untuk akses endpoint lain
    const token = jwt.sign(
      {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.user_role,
        scope: user.user_role,
      },
      process.env.JWT_SECRET, // Pastikan ini ada di file .env
      { expiresIn: "24h" } // Token berlaku 24 jam
    );

    return h
      .response({
        status: "success",
        message: "Login berhasil",
        data: {
          token: token,
          user: {
            id: user.id,
            name: user.name,
            role: user.user_role,
            email: user.email,
          },
        },
      })
      .code(200);
  },
};

module.exports = AuthHandler;
