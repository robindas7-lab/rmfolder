module.exports = {
  apps: [
    {
      name: "rocket-matka-frontend",
      script: "node_modules/next/dist/bin/next",
      args: "start",
      cwd: "./",
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: "1G",
      env: {
        NODE_ENV: "production",
        PORT: 3000,
      },
    },
    {
      name: "rocket-matka-scraper",
      script: "scraper/index.js",
      cwd: "./",
      instances: 1,
      autorestart: true, // PM2 will keep it running infinitely
      watch: false,
      max_memory_restart: "500M",
      env: {
        NODE_ENV: "production",
      },
    },
  ],
};
