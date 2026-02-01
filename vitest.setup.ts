import { webcrypto } from "crypto";

if (typeof global.crypto === "undefined") {
  global.crypto = webcrypto as Crypto;
}

if (typeof global.TextEncoder === "undefined") {
  const { TextEncoder, TextDecoder } = require("util");
  global.TextEncoder = TextEncoder;
  global.TextDecoder = TextDecoder;
}
