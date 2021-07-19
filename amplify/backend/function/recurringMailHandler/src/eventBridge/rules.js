
const AWS = require("aws-sdk");

AWS.config.update({
    // credentials: fromIni({ profile: 'admin_jamal' }),
    // secretAccessKey: config.get('aws-secret-access-key'),
    // accessKeyId: config.get('aws-access-key-id'),
    region: process.env.REGION,
});
const eventBridge = new AWS.EventBridge();

/*
    @Param ruleName: unique id for each mail schedule
    @Param schedule: cron expression for schedule
    @Param from: email of client who invoked schedule
*/
async function addNewRule(ruleName, schedule, from) {
    const ruleParams = {
        Name: ruleName,
        ScheduleExpression: schedule,
    };
    let rule;
    try {
        rule = await eventBridge.putRule(ruleParams).promise();
    } catch (err) {
        console.log("Error", err);
    }
    /*
        uncomment to provide only restricted rules permission to execute your
        lambda function

        const permissionParams = {
            Action: "lambda:InvokeFunction",
            FunctionName: "reminder",
            Principal: "events.amazonaws.com",
            StatementId: ruleName,
            SourceArn: rule.RuleArn,
        };
        try {
            await lambda.addPermission(permissionParams).promise();
        } catch (err) {
            console.log("Error", err);
        }
    */
    const targetParams = {
        Rule: ruleName,
        Targets: [
            {
                Id: `${ruleName}-target`,
                Arn: `arn:aws:lambda:${process.env.REGION}:${process.env.ACCOUNT_ID}:function:${process.env.FUNCTION_SCHEDULEHANDLER_NAME}`,
                Input: `{ "ruleName": "${ruleName}", "from": "${from}" }`,
            },
        ],
    };
    try {
        const result = await eventBridge.putTargets(targetParams).promise();
        return result;
    } catch (err) {
        console.log("Error", err);
    }
}

/*
    @Param ruleName: unique id for each mail ScheduleExpression
*/
async function disableRule(ruleName) {
    const ruleParams = {
        Name: ruleName,
    };
    try {
        await eventBridge.disableRule(ruleParams).promise();
    } catch (err) {
        console.log("Error", err);
    }
}
/*
    @Param ruleName: unique id for each mail ScheduleExpression
*/
async function enableRule(ruleName) {

    const ruleParams = {
        Name: ruleName,
    };
    try {
        await eventBridge.enableRule(ruleParams).promise();
    } catch (err) {
        console.log("Error", err);
    }
}
/*
    @Param ruleName: unique id for each mail ScheduleExpression
*/
async function deleteRule(ruleName) {

    // first remove the targets associated with a rule before deleting it
    const targetParams = {
        Ids: [`${ruleName}-target`],
        Rule: ruleName,
    };
    try {
        await eventBridge.removeTargets(targetParams).promise();
    }
    catch (err) {
        console.log("Error", err);
        return;
    }
    // delete the rule
    const deleteParams = {
        "Name": ruleName
    }
    try {
        await eventBridge.deleteRule(deleteParams).promise();
    }
    catch (err) {
        console.log("Error", err);
        return;
    }
}
/*
    @Param ruleName: unique id for each mail schedule
    @Param schedule: cron expression
*/
async function updateRule(ruleName, schedule) {
    const ruleParams = {
        Name: ruleName,
        ScheduleExpression: schedule,
    };
    try {
        await eventBridge.putRule(ruleParams).promise();
    } catch (err) {
        console.log("Error", err);
    }
}


module.exports = { addNewRule, disableRule, enableRule, deleteRule, updateRule }
