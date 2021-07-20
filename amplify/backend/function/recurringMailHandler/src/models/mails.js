// const Joi = require('joi');
const dynamoose = require('dynamoose');
const table = process.env.STORAGE_MAILSTABLE_NAME;
const Joi = require('joi');

const mailSchema = new dynamoose.Schema({
    id: {
        type: String,
        required: true,
        hashKey: true,
    },
    from: {
        type: String,
        index: {
            name: "from-index",
            global: true
        },
        rangeKey: true,
        required: true,
    },
    to: {
        type: Array,
        Schema: [String],
        required: true
    },
    cc: {
        type: Array,
        Schema: [String],
        required: false
    },
    subject: {
        type: String,
        required: true
    },
    body: {
        type: String,
        required: true
    },
    cronExpression: {
        type: String,
        required: true
    },
    creationTime: {
        type: Date,
        required: true,
        default: Date.now()
    },
    recur: {
        type: String,
        required: true
    }
}, {
    saveUnknown: true
});

const Mail = dynamoose.model(table, mailSchema);

function validateMail(mail) {

    const schema = Joi.object({
        to: Joi.array().items(Joi.string().min(5).max(255).required().email()).required(),
        cc: Joi.array().items(Joi.string().min(5).max(255).email()),
        bcc: Joi.array().items(Joi.string().min(5).max(255).email()),
        subject: Joi.string().required(),
        body: Joi.string().required(),
        cronExpression: Joi.string().required(),
        recur: Joi.string().required(),
    });

    return schema.validate(mail);
}

module.exports = { Mail, validateMail };

