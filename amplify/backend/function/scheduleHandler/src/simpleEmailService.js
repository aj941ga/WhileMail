// Load the AWS SDK for Node.js

const { AWS } = require('./libs/Client');
/*
@Param options: {
    to : [],
    cc: [],
    subject: [],
    body: [],
}
*/
function sendMail(options) {

    const { from, to, cc, subject, body } = options;
    // Create sendEmail params 
    const params = {
        Destination: { /* required */
            CcAddresses: cc,
            ToAddresses: to,
        },
        Message: { /* required */
            Body: { /* required */
                Html: {
                    Charset: "UTF-8",
                    Data: body + `<hr/> mail sent by ${from} using whilemail`
                },
                Text: {
                    Charset: "UTF-8",
                    Data: 'text'
                }
            },
            Subject: {
                Charset: 'UTF-8',
                Data: subject
            }
        },
        Source: process.env.SOURCE_EMAIL, /* required */
        // ReplyToAddresses: [
        //     'EMAIL_ADDRESS',
        //     /* more items */
        // ],
    };

    // Create the promise and SES service object
    return new AWS.SES({ apiVersion: '2010-12-01' }).sendEmail(params).promise();

}

module.exports = {
    sendMail
};