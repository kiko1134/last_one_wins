import dotenv from "dotenv";

dotenv.config();

const config = {
  MONGO_URI: process.env.MONGO_URI || "",
  PORT: process.env.PORT || 5000,
  NODE_ENV: process.env.NODE_ENV || "development",
};

if (!config.MONGO_URI) {
  console.error("❌ Missing MONGO_URI in environment variables!");
  process.exit(1);
}

export default config;
