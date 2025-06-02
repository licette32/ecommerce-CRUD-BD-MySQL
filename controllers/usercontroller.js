// controllers/userController.js
// Importa los modelos que interactúan con la base de datos
const userModel = require('../models/userModel');
const productModel = require('../models/productModel'); // Necesario para mostrarAdminPanel
const path = require('path');
// const fs = require('fs'); // Ya no se necesita para leer JSON de productos

const userController = {
    // Renderiza el formulario de login
    mostrarLogin: (req, res) => {
        res.render('users/login');
    },

    // Procesa el login
    procesarLogin: async (req, res) => {
        const { username, password } = req.body;

        try {
            // Llama al modelo de usuario para verificar las credenciales en la BD
            const user = await userModel.findByUsernameAndPassword(username, password);

            if (user) {
                // En un proyecto real, aquí se establecería una sesión o un token JWT
                res.redirect('/users/admin');
            } else {
                res.render('users/login', { error: 'Usuario o contraseña incorrecta' });
            }
        } catch (error) {
            console.error('Error al procesar login:', error);
            res.status(500).send('Error interno del servidor al intentar iniciar sesión.');
        }
    },

    // Renderiza el panel de administración con los productos desde la BD
    mostrarAdminPanel: async (req, res) => {
        try {
            // Llama al modelo de producto para obtener todos los productos de la BD
            const productos = await productModel.findAll();
            res.render('users/admin', { products: productos });
        } catch (error) {
            console.error('Error al cargar el panel de admin:', error);
            res.status(500).send('Error interno del servidor al cargar el panel de administración.');
        }
    }
};

module.exports = userController;