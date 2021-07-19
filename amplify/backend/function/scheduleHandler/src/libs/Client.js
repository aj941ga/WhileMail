var AWS = require('aws-sdk');
// Set the region 

AWS.config.update({
    region: process.env.REGION
});


module.exports = { AWS };