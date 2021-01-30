const Joi = require('@hapi/joi')

const customerRegisterValidation = (data) => {
    const schema = Joi.object({
        name: Joi.string()
            .required(),
        email: Joi.string()
            .email()
            .lowercase(true)
            .required(),
        password: Joi.string()
            .min(6)
            .required(),
        address: Joi.string()
            .required(),
        phone: Joi.string()
            .required(),
    })

    return schema.validate(data)
}

const merchantRegisterValidation = (data) => {
    const schema = Joi.object({
        name: Joi.string()
            .required(),
        email: Joi.string()
            .email()
            .lowercase(true)
            .required(),
        password: Joi.string()
            .min(6)
            .required(),
        address: Joi.string()
            .required(),
        phone: Joi.string()
            .required(),
        store_name: Joi.string()
            .required(),
    })

    return schema.validate(data)
}

const driverRegisterValidation = (data) => {
    const schema = Joi.object({
        name: Joi.string()
            .required(),
        email: Joi.string()
            .email()
            .lowercase(true)
            .required(),
        password: Joi.string()
            .min(6)
            .required(),
        address: Joi.string()
            .required(),
        phone: Joi.string()
            .required(),
        license_plates: Joi.string()
            .required(),
    })

    return schema.validate(data)
}

const loginValidation = (data) => {
    const schema = Joi.object({
        email: Joi.string()
            .email()
            .required(),
        password: Joi.string()
            .min(6)
            .required()
    })

    return schema.validate(data)
}

module.exports.customerRegisterValidation = customerRegisterValidation
module.exports.merchantRegisterValidation = merchantRegisterValidation
module.exports.driverRegisterValidation = driverRegisterValidation
module.exports.loginValidation = loginValidation