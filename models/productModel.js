// models/productModel.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db'); // Importa tu instancia de Sequelize

const Product = sequelize.define('Product', { // El primer argumento 'Product' es el nombre del modelo
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    nombre: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    descripcion: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    precio: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
    },
    imagen: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    categoria: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    precio_original: { // ¡Esta línea es clave para las ofertas!
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
    },
}, {
    tableName: 'productos',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    underscored: true,
});

// AHORA EXPORTAMOS UN OBJETO QUE CONTIENE LAS FUNCIONES QUE TU CONTROLADOR ESPERA
const productModel = {
    findAll: async () => {
        return await Product.findAll();
    },
    // Este es el método que faltaba y causaba el error
    findById: async (id) => {
        return await Product.findByPk(id); // Sequelize usa findByPk para buscar por clave primaria
    },
    create: async (data) => {
        return await Product.create(data);
    },
    update: async (id, data) => {
        // En Sequelize, update requiere el objeto de datos y una condición 'where'
        const [updatedRows] = await Product.update(data, {
            where: { id: id }
        });
        return updatedRows > 0; // Retorna true si se actualizó al menos una fila
    },
    delete: async (id) => {
        // En Sequelize, destroy requiere una condición 'where'
        const deletedRows = await Product.destroy({
            where: { id: id }
        });
        return deletedRows > 0; // Retorna true si se eliminó al menos una fila
    }
};

module.exports = productModel; // Exporta el objeto con los métodos