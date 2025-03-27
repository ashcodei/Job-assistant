const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  // API requests proxy
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'http://localhost:5000',
      changeOrigin: true,
      // Don't rewrite the path
      pathRewrite: { '^/api': '/api' },
      // Important: Disable WebSocket for API proxy
      ws: false,
    })
  );
  
  // Don't proxy WebSocket connections
  app.use(
    '/ws',
    createProxyMiddleware({
      target: 'http://localhost:3000',
      ws: true,
      // Don't forward requests that have already been handled
      selfHandleResponse: true,
      onProxyReq: (proxyReq, req, res) => {
        // This prevents proxying WebSocket connections to the backend
        res.writeHead(200);
        res.end();
      }
    })
  );
};