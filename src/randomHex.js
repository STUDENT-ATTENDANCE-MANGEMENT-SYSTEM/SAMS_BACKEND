import crypto from "crypto";

const randomHex = crypto.randomBytes(6).toString("hex");
console.log(randomHex);
