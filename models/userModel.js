const { DataTypes } = require('sequelize');
const sequelize = require('../config/db'); // Importa la instancia de Sequelize

const User = sequelize.define('User', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    password: { // Aquí espero contraseña en texto plano en la DB
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },

}, {
    tableName: 'usuarios',
    timestamps: false, 
});

// Método de clase para buscar usuario y verificar contraseña (AJUSTADO PARA TEXTO PLANO)
User.findByUsernameAndPassword = async (username, plainPassword) => {
    try {
        // Busca al usuario por username y la contraseña en texto plano directamente.
        // ESTO ES INSEGURO EN PRODUCCIÓN.
        const user = await User.findOne({
            where: {
                username: username,
                password: plainPassword, // <--- COMPARA CONTRASEÑA EN TEXTO PLANO
            }
        });

        // Si user es null, significa que no se encontró ninguna coincidencia con ese username Y contraseña.
        return user; // Devuelve el objeto usuario si existe, o null si no.

    } catch (error) {
        console.error('Error en User.findByUsernameAndPassword:', error);
        throw error; // Re-lanza el error
    }
};

module.exports = User; // Exporta el modelo de Sequelize 'User'