const awsServerlessExpress = require('aws-serverless-express');
const app = require('./app');
const dynamoose = require('dynamoose');

const server = awsServerlessExpress.createServer(app);

// if (process.env.NODE_ENV !== 'production') {
//   // use local dynamoDB
//   dynamoose.aws.ddb.local("http://localhost:8000");
// }

exports.handler = (event, context) => {
  console.log(`EVENT: ${JSON.stringify(event)}`);
  return awsServerlessExpress.proxy(server, event, context, 'PROMISE').promise;
};
