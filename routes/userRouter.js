// routes/userRouter.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const Product = require('../models/productModel'); // Importa Product

router.get('/login', userController.mostrarLogin);
router.post('/login', userController.procesarLogin);

router.get('/admin', async (req, res) => {
    try {
        const productos = await Product.findAll();

        // --- AÑADE ESTOS CONSOLE.LOGS DE DEPURACIÓN ---
        console.log('--- Debug Panel de Administración ---');
        console.log('Productos obtenidos de la DB (raw, primeros 3):', productos.slice(0, 3));
        console.log('Total productos raw:', productos.length);
        // ---------------------------------------------

        const adaptedProducts = productos.map(item => ({
            id: item.id,
            nombre: item.nombre, // Usa 'nombre'
            imagen: item.imagen, // Usa 'imagen'
            precio: item.precio, // Usa 'precio'
            descripcion: item.descripcion,
            categoria: item.categoria,
            precio_original: item.precio_original // Usa 'precio_original'
        }));

        // --- AÑADE ESTOS CONSOLE.LOGS DE DEPURACIÓN ---
        console.log('Productos adaptados para el panel de administración (primeros 3):', adaptedProducts.slice(0, 3));
        console.log('Total productos adaptados:', adaptedProducts.length);
        console.log('-----------------------------------');
        // ---------------------------------------------

        res.render('users/admin', { products: adaptedProducts });
    } catch (error) {
        console.error('Error al cargar la página de administración de usuarios:', error);
        res.status(500).render('error', { message: 'No se pudo cargar el panel de administración.' });
    }
});

module.exports = router;