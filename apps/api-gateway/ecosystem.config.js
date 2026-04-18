module.exports = {
  apps: [{
    name: "lumina-api-gateway",
    script: "./dist/main.js",
    instances: 1, // Explicit limit protecting massive single-loop memory routing
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: "production"
    }
  }]
}
