import "dotenv/config.js";

const PORT = process.env.PORT || 4000;
const MONGO_URI = process.env.MONGO_URI


if (!PORT) {
    throw new Error("PORT is not defined");
}
if (!MONGO_URI) {
    throw new Error("MONGO_URI is not defined");
}

export {
    PORT,
    MONGO_URI
}