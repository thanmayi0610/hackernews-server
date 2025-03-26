import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import "dotenv/config"
import {jwtSecretKey} from '../environment';
import jwt from "jsonwebtoken";
const app = new Hono()

// app.get('/', (c) => {
//   return c.text('Hello Hono!')
// })
const payload: jwt.JwtPayload = {
  iss: "https://purpleshorts.co.in",
  sub: "ThanmayiJR",
};
const token = jwt.sign(payload, jwtSecretKey, {
  algorithm: "HS256",
  expiresIn: "30d",
});
console.log("Token: ",token);
try {
  const decoded = jwt.verify(token, jwtSecretKey);
  console.log("Decoded Payload", decoded);
} catch (e) {
  console.log("Error", e);
}
//console.log("jwt secret key",jwtSecretKey);
serve({
  fetch: app.fetch,
  port: 3000
}, (info) => {
  console.log(`Server is running on http://localhost:${info.port}`)
})
