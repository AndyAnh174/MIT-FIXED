const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = app => {
  app.use(
    "/socket.io",
    createProxyMiddleware({
      target: "http://localhost:3333/socket.io",
      changeOrigin: true,
    }),
  );

  app.use(
    "/api",
    createProxyMiddleware({
      target: "http://localhost:3333",
      changeOrigin: true,
    }),
  );
};