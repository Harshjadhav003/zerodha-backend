const { createClient } = require('redis');

let client;

if (process.env.NODE_ENV === 'production') {
  client = createClient({
    url: process.env.REDIS_URL,
    socket: {
      tls: true,
    },
  });
} else {
  client = createClient({
    socket: {
      host: '127.0.0.1',
      port: 6379,
    },
  });
}

client.on('error', (err) => {
  console.log(' Redis Client Error', err);
});

(async () => {
  try {
    if (!client.isOpen) {
      await client.connect();
      console.log(' Redis connected');
    }
  } catch (err) {
    console.error(' Redis connection failed:', err.message);
  }
})();

module.exports = client;