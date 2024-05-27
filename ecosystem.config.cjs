module.exports = {
  apps: [
    {
      name: "broker",
      script: "./index.js",
      instances: "max",
      exec_mode: "cluster",
      env: {
        NODE_ENV: "production",
      },
    },
  ],
};
