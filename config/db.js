// config/db.js
// Carga las variables de entorno del archivo .env
require('dotenv').config();

// Importa Sequelize
const { Sequelize } = require('sequelize');

// Crea una nueva instancia de Sequelize
// Los parámetros son: nombre_bd, usuario, contraseña, { host, dialect, logging }
const sequelize = new Sequelize(
    process.env.DB_NAME,      // Nombre de la base de datos
    process.env.DB_USER,      // Usuario de la base de datos
    process.env.DB_PASSWORD,  // Contraseña del usuario
    {
        host: process.env.DB_HOST, // Host de la base de datos
        dialect: 'mysql',          // Tipo de base de datos
        port: process.env.DB_PORT, // Puerto de MySQL
        logging: false,            // Desactiva el log de SQL en consola (pon true para depurar)
        // Opciones adicionales del pool de conexiones (similar a mysql2/promise)
        pool: {
            max: 10,  // Máximo número de conexiones en el pool
            min: 0,   // Mínimo número de conexiones en el pool
            acquire: 30000, // Tiempo máximo en ms que el pool intentará obtener una conexión
            idle: 10000 // Tiempo máximo en ms que una conexión puede estar inactiva antes de ser liberada
        }
    }
);

// Función para probar la conexión a la base de datos
async function testConnection() {
    try {
        await sequelize.authenticate(); // Intenta autenticarse con la base de datos
        console.log('Conexión a la base de datos MySQL con Sequelize exitosa!');
    } catch (error) {
        console.error('Error al conectar a la base de datos MySQL con Sequelize:', error);
        process.exit(1); // Sale de la aplicación si no puede conectar a la BD
    }
}

// Llama a la función para probar la conexión al iniciar
testConnection();

// Exporta la instancia de Sequelize para que pueda ser utilizada en los modelos
module.exports = sequelize;