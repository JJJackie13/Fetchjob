import dotenv from "dotenv";
dotenv.config();

export const env = {
    DB_USERNAME: process.env.DB_USERNAME,
    DB_PASSWORD: process.env.DB_PASSWORD,
    DB_NAME: process.env.DB_NAME,
    DB_HOST: process.env.DB_HOST || "localhost",
    PORT: process.env.PORT! || 8080,
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
    LOGGING_LEVEL: process.env.LOGGING_LEVEL || "silly",
    NODE_ENV: process.env.NODE_ENV || "development",
    JWTSECRET: process.env.JWTSECRET,
};
