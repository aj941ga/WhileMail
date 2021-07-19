/* Amplify Params - DO NOT EDIT
	ENV
	FUNCTION_SCHEDULEHANDLER_NAME
	REGION
	STORAGE_MAILSTABLE_ARN
	STORAGE_MAILSTABLE_NAME
	STORAGE_MAILSTABLE_STREAMARN
Amplify Params - DO NOT EDIT */
/*
Copyright 2017 - 2017 Amazon.com, Inc. or its affiliates. All Rights Reserved.
Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance with the License. A copy of the License is located at
    http://aws.amazon.com/apache2.0/
or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and limitations under the License.
*/
let express = require('express')
const jwt = require('jsonwebtoken');
let awsServerlessExpressMiddleware = require('aws-serverless-express/middleware')
const { Mail, validateMail } = require('./models/mails');
const { v4: uuidv4 } = require('uuid');
const { addNewRule, updateRule, deleteRule } = require('./eventBridge/rules');
const dynamoose = require('dynamoose');
const validate = require('./validation-middleware');

// declare a new express app
let app = express()
app.use(express.json())
app.use(awsServerlessExpressMiddleware.eventContext())

// Enable CORS for all methods
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*")
  res.header("Access-Control-Allow-Headers", "*")
  next()
});

app.use(function (req, res, next) {

  // token is already verified by middleware in api-gateway
  const token = req.header('Authorization');
  req.user = jwt.decode(token);
  next();
});

/**********************
 * get method *
 **********************/

app.get('/mails/:id', async function (req, res) {

  const id = req.params.id;
  const mail = await Mail.get({ id, from: req.user.email });

  if (!mail) return res.status(404).send('mail not found');

  return res.send(mail);
});

app.get('/mails', async function (req, res) {

  try {
    const mails = await Mail.query('from').eq('aj941ga@gmail.com').exec();
    return res.send(mails);
  }
  catch (ex) {
    return res.status(400).send(ex);
  }
});

/****************************
* post method *
****************************/

app.post('/mails', validate(validateMail), async function (req, res) {
  // Add your code here
  const { to, cc, subject, body, cronExpression } = req.body;
  try {
    let mail = new Mail({ id: uuidv4(), from: req.user.email, to, cc, subject, body, cronExpression });
    mail = await mail.save();

    const schedule = `cron(${cronExpression})`;
    addNewRule(`${mail.id}`, schedule, req.user.email);
    return res.send(mail);
  }
  catch (ex) {
    return res.status(400).send(ex);
  }
});

/****************************
* put method *
****************************/

app.put('/mails/:id', validate(validateMail), async function (req, res) {
  // Add your code here
  const id = req.params.id;
  const { to, cc, subject, body, cronExpression } = req.body;

  try {
    const mail = await Mail.update({ id, from: req.user.email }, { to, cc, subject, body, cronExpression });
    if (!mail) return res.status(404).send('mail with given id not found');

    const schedule = `cron(${cronExpression})`;
    updateRule(`${mail.id}`, schedule);
    return res.send(mail);
  }
  catch (ex) {
    return res.status(500).send('internal server error');
  }

});

/****************************
*  delete method *
****************************/

app.delete('/mails/:id', async function (req, res) {
  // Add your code here
  const id = req.params.id;

  const mail = await Mail.get({ id, from: req.user.email });
  if (!mail) return res.status(404).send('mail not found');

  try {
    await mail.delete();
    deleteRule(`${mail.id}`);
  }
  catch (error) {
    return res.status(500).send('internal server error');
  }
  return res.send(mail);

});

app.listen(3000, function () {
  console.log(process.env.FUNCTION_SCHEDULEHANDLER_NAME);
  console.log("App started")
});

// Export the app object. When executing the application local this does nothing. However,
// to port it to AWS Lambda we will create a wrapper around that will load the app from
// this file
module.exports = app
