import dotenv from "dotenv";
dotenv.config();

const congif = {
  mongo_db_url: String(process.env.MONGO_DB_URL),
  cloud_name: String(process.env.CLOUD_NAME),
  api_key: String(process.env.API_KEY),
  api_secret: String(process.env.API_SECRET),
};

export default congif;