const RedisCache = require('./helpers/RedisCache');

const cache = RedisCache.connect();

module.exports.hello = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;
  console.time('process');
  const { httpMethod } = event;
  const key = `KEY_${httpMethod}`;
  try {
    let result = await cache.get(key);
    console.log('result', result);
    if (!result) {
      result = {
        message: `Hello World! With an HTTP ${httpMethod}`,
      };
      await cache.set(key, result);
    }
    console.timeEnd('process');
    return (response = {
      statusCode: 200,
      body: JSON.stringify(result),
    });
  } catch (err) {
    console.timeEnd('process');
    return (response = {
      statusCode: 500,
      body: JSON.stringify(err),
    });
  }

  // return {
  //   statusCode: 200,
  //   body: JSON.stringify(
  //     {
  //       message: 'Go Serverless v1.0! Your function executed successfully!',
  //       input: event,
  //     },
  //     null,
  //     2
  //   ),
  // };

  // Use this code if you don't use the http event with the LAMBDA-PROXY integration
  // return { message: 'Go Serverless v1.0! Your function executed successfully!', event };
};
