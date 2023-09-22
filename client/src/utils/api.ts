const PROD_URL = "https://lecturify-production.up.railway.app";
const DEV_URL = "http://localhost:1337";

const prod = process.env.NODE_ENV === "production";
export const apiUrl = prod ? PROD_URL : DEV_URL;
