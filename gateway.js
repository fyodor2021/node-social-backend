require("dotenv").config();
const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");
const app = express();
const cors = require('cors')
app.use(express.static('frontend/dist'))
app.use(cors({  origin: [process.env.ORIGIN_URL],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  'Access-Control-Allow-Headers': 'Authorization',
  credentials: true,}));

app.use(
  "/api/v1/auth",
  createProxyMiddleware({
    target: "http://localhost:3002/api/v1/auth",
  })
);

app.use(
    "/api/v1",
  createProxyMiddleware({
    target: "http://localhost:3001/api/v1/",
  })
);

app.use(
  "http://localhost:3003/",
  createProxyMiddleware({
    target: "http://localhost:3003/",
  })
);
app.get('*', (req,res) => {
  res.sendFile(__dirname + '/frontend/dist/index.html')
})
app.listen(8080, () => console.log("gateway listening on port 8080"));
