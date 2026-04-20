module.exports = {
  apps: [{
    name: 'cdpilot-site',
    script: '.next/standalone/01dev/cdpilot-site/server.js',
    cwd: '/opt/cdpilot-site',
    env: {
      NODE_ENV: 'production',
      PORT: 3400,
      HOSTNAME: '0.0.0.0',
    },
    instances: 1,
    autorestart: true,
    max_memory_restart: '512M',
  }]
};
