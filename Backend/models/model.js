const db = require("../connections/db");
const Sequelize = require("sequelize");
const csvSchema = db.define("csvData", {
    id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
    },
    sku_code: {
        type: Sequelize.STRING},
    product_name: {
        type: Sequelize.STRING},
    product_description: {
        type: Sequelize.STRING
    },
    createdAt: {
        type: Sequelize.DATE,
        default: Date.now()
    },
    updatedAt: {
        type: Sequelize.DATE,
        default: Date.now()
    },
});

module.exports = csvSchema