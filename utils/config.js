const { JWT_SECRET = "some-secret-key" } = process.env;

const corsOptions = {
  origin: [
    "http://localhost:3001",
    "http://localhost:5000",
    "https://jcalcan.github.io",
  ],
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

module.exports = { JWT_SECRET, corsOptions };
