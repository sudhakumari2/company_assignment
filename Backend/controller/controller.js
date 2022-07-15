const csvModel = require("../models/model")
const Joi = require('joi')
const Sequelize = require("sequelize");
const Op=Sequelize.Op
const CreateCsv = async (req, res) => {
    // const Schema = Joi.object({
    //     sku_code: Joi.number().required(),
    //     product_name: Joi.string().optional().required(),
    //     product_description: Joi.string().optional().required(),
    // });
    // let validateSchema = Schema.validate(req.body)
    // if (validateSchema.error) {
    //     return res.status(400).json({
    //         massage: validateSchema.error.massage || "Bad Request",
    //         code: 400
    //     })
    // } else {
    //     validateSchema = validateSchema.value;
    // }
    try {
        const data=req.body
        console.log(data);
            const result = await csvModel.bulkCreate(data)
            return res.status(201).send({
                massage: "data added successfully",
                status: 201,
            })

        
    } catch(err) {
        console.log(err);
        return res.status(500).json({
            massage: 'internal server Error',
            status: 500
        })
    }
}

const getAllData = async (req, res) => {
    let filter = {}
    const Schema = Joi.object({
        search: Joi.string().optional()
    });
    let query = Schema.validate(req.query)
    if (query.error) {
        return res.status(400).json({
            massage: query.error.massage || "Bad Request",
            code: 400
        })
    } else {
        query = query.value;
    }
    if (query.search) {
        filter = {
            [Op.or]: [
                { sku_code: { [Op.like]: `%${query.search}%` } },
                { product_name: { [Op.like]: `%${query.search}%` } },
                { product_description: { [Op.like]: `%${query.search}%` } },
            ]
        }
    }
    try {
        let result = await csvModel.findAll({where: filter})
        return res.status(200).send({
            massage: "data access successfully",
            status: 200,
            data:result
        })
    }
    catch {
        return res.status(500).json({
            massage: 'internal server Error',
            status: 500
        })
    }
}
module.exports ={CreateCsv,getAllData}