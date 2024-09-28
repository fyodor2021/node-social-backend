require("dotenv").config();
const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");
const app = express();
const cors = require("cors");

app.use(express.static('vue-social-frontend/dist'))



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
  console.log('im here')
  res.sendFile(__dirname + '/vue-social-frontend/dist/index.html')
})
app.listen(8080, () => console.log("gateway listening on port 8080"));
