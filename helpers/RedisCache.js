const Redis = require('ioredis');

const REDIS_ENDPOINT = process.env.REDIS_ENDPOINT;

let cacheClient;

console.log('using REDIS_ENDPOINT', REDIS_ENDPOINT);

const get = async key => {
  try {
    if (cacheClient) {
      console.time('cacheClient.get()');
      let res = await cacheClient.get(key);
      console.timeEnd('cacheClient.get()');
      // console.debug(`cacheClient.get(${key}) is ${res}`);
      if (res) {
        res = JSON.parse(res);
      }
      console.log(`Read cache key=${key}`, res);
      return res;
    } else {
      console.log('Cache is not available');
    }
  } catch (err) {
    console.error('Read cache error', err);
  }
  return undefined;
};

const set = async (key, value, lifetime = 600) => {
  try {
    if (cacheClient) {
      console.log(`SET cache key=${key}`, value);
      console.time('cacheClient.set()');
      await cacheClient.set(key, JSON.stringify(value), 'EX', lifetime);
      console.timeEnd('cacheClient.set()');
    } else {
      console.log('Cache is not available');
    }
  } catch (err) {
    console.error('Write cache error', err);
  }
};

const connect = () => {
  if (!cacheClient && typeof REDIS_ENDPOINT === 'string') {
    const params = REDIS_ENDPOINT.split(':');
    console.log('Connecting to redis', params);
    try {
      cacheClient = new Redis({
        host: params[0],
        port: params[1],
        password: params[2],
        lazyConnect: true,
      });
      console.time('redis.connect()');
      cacheClient.connect().then(() => {
        console.timeEnd('redis.connect()');
        console.log('Create Redis Client success');
      });
    } catch (error) {
      console.error('Connect to redis failed', error);
    }
  }
  return { get, set };
};

module.exports = {
  connect,
};
