module.exports = {
  "devServer": {
    "proxy": {
      '/api': {
        "target": 'http://test-api.servers.mchains.cn',
        "changeOrigin": true,
        "ws": true
      }
    }
  }
}