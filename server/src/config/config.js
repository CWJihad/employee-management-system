import "dotenv/config.js";

const PORT = process.env.PORT || 4000;
const MONGO_URI = process.env.MONGO_URI
const JWT_SECRET = process.env.JWT_SECRET


if (!PORT) {
    throw new Error("PORT is not defined");
}
if (!MONGO_URI) {
    throw new Error("MONGO_URI is not defined");
}
if (!JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined");
}

export {
    PORT,
    MONGO_URI,
    JWT_SECRET
}