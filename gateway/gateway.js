require("dotenv").config();
const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");
const app = express();
const cors = require("cors");
const https = require("https");
const fs = require("fs");
const path = require("path");

app.use(express.static("frontend/dist"));
app.use(
  cors({
    origin: process.env.ORIGIN_URL,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    "Access-Control-Allow-Headers": "Authorization",
    credentials: true,
  })
);

app.use(
  "/api/v1",
  createProxyMiddleware({
    target: process.env.API_SERVER,
    changeOrigin: true,
    secure: false,
  })
);
app.use(
  "/socket.io",
  createProxyMiddleware({
    target: process.env.IO_SERVER,
    ws: true,
    secure: false,
  })
);

app.get("*", (req, res) => {
  res.sendFile(__dirname + "/frontend/dist/index.html");
});
// const httpsServer = https.createServer(
//   {
//     key: fs.readFileSync(path.join(__dirname, "certs", "key.pem")),
//     cert: fs.readFileSync(path.join(__dirname, "certs", "cert.pem")),
//   },
//   app
// );

// httpsServer.listen(443, () => console.log("gateway server started 443"));

// const httpsServer = https.createServer(app);
app.listen(80, () => console.log("gateway server started 80"));
  
