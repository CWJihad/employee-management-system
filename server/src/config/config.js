import "dotenv/config.js";

const PORT = process.env.PORT || 4000;
const MONGO_URI = process.env.MONGO_URI;
const JWT_SECRET = process.env.JWT_SECRET;
const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
const INNGEST_EVENT_KEY = process.env.INNGEST_EVENT_KEY;
const INNGEST_SIGNING_KEY = process.env.INNGEST_SIGNING_KEY;
const SMTP_USER = process.env.SMTP_USER;
const SMTP_PASS = process.env.SMTP_PASS;
const SENDER_EMAIL = process.env.SENDER_EMAIL;

if (!PORT) {
  throw new Error("PORT is not defined");
}
if (!MONGO_URI) {
  throw new Error("MONGO_URI is not defined");
}
if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined");
}
if (!ADMIN_EMAIL) {
  throw new Error("ADMIN_EMAIL is not defined");
}
if (!INNGEST_EVENT_KEY) {
  throw new Error("INNGEST_EVENT_KEY is not defined");
}
if (!INNGEST_SIGNING_KEY) {
  throw new Error("INNGEST_SIGNING_KEY is not defined");
}
if (!SMTP_USER) {
  throw new Error("SMTP_USER is not defined");
}
if (!SMTP_PASS) {
  throw new Error("SMTP_PASS is not defined");
}
if (!SENDER_EMAIL) {
  throw new Error("SENDER_EMAIL is not defined");
}

export {
  PORT,
  MONGO_URI,
  JWT_SECRET,
  ADMIN_EMAIL,
  INNGEST_EVENT_KEY,
  INNGEST_SIGNING_KEY,
  SENDER_EMAIL,
  SMTP_PASS,
  SMTP_USER,
};
