const { JWT_SECRET = "some-secret-key" } = process.env;

const corsOptions = {
  origin: [
    "http://localhost:3000",
    "http://localhost:3001",
    "http://localhost:4173",
    "https://whattowear.mine.bz",
    "https://www.whattowear.mine.bz",
    "https://api.whattowear.mine.bz",
  ],
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "Origin", "Accept"],
  exposedHeaders: ["Access-Control-Allow-Origin"],
  credentials: true,
  optionsSuccessStatus: 200,
};

module.exports = { JWT_SECRET, corsOptions };
