const { JWT_SECRET = "some-secret-key" } = process.env;

const corsOptions = {
  origin: [
    "http://localhost:3000",
    "http://localhost:3001",
    "http://localhost:4173",
    "https://whattowear.mine.bz",
    "https://www.whattowear.mine.bz",
  ],
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

module.exports = { JWT_SECRET, corsOptions };
