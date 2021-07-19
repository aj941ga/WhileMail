/* Amplify Params - DO NOT EDIT
	ENV
	REGION
	STORAGE_MAILSTABLE_ARN
	STORAGE_MAILSTABLE_NAME
	STORAGE_MAILSTABLE_STREAMARN
Amplify Params - DO NOT EDIT */
/*
If a recipient email address is invalid (that is, it is not in the format
     UserName@[SubDomain.]Domain.TopLevelDomain), the entire message is rejected,
      even if the message contains other recipients that are valid.

*/
/*
    Input: {ruleName, from}
    gets event.ruleName and event.from as input from eventBridge
    reads data from mongodb where id is event.ruleName
    sends data to all recepients via Simple Email Service
*/
const { sendMail } = require('./simpleEmailService');
const { AWS } = require('./libs/Client');

const docClient = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
    // TODO implement
    const params = {
        TableName: process.env.STORAGE_MAILSTABLE_NAME,
        Key: {
            "id": event.ruleName,
            "from": event.from,
        }
    };
    try {
        const { Item: mail } = await docClient.get(params).promise();
        await sendMail(mail);
    }
    catch (ex) {
        console.log('error', ex);
    }
};
