// routes/webRoutes.js
const express = require('express');
const router = express.Router();

const productoController = require('../controllers/productController');
const Product = require('../models/productModel'); // Importa Product al principio

// --- RUTAS DE VISTAS WEB GENERALES ---

// Ruta para la página principal (Home.ejs)
router.get('/', async (req, res) => {
    try {
        const products = await Product.findAll();

        const adaptedProducts = products.map(p => { // Abre la función de callback del map
            const adapted = { // 'adapted' se define aquí
                id: p.id,
                name: p.name || p.nombre,
                imageUrl: p.imageUrl || p.imagen,
                currentPrice: parseFloat(p.currentPrice || p.precio),
                originalPrice: p.precio_original ? parseFloat(p.precio_original) : null,
                description: p.description || '',
                category: p.category || p.categoria
            };

            // Calcula el porcentaje de descuento si lo necesitas en el frontend
            if (adapted.originalPrice && adapted.originalPrice > adapted.currentPrice && adapted.originalPrice > 0) {
                adapted.discountPercentage = Math.round(((adapted.originalPrice - adapted.currentPrice) / adapted.originalPrice) * 100);
            } else {
                adapted.discountPercentage = null;
            }
            
            return adapted;
        });

        // --- LOS CONSOLE.LOGS DE RESUMEN VAN AQUÍ FUERA DEL MAP ---
        console.log('*** Datos para Home.ejs ***');
        console.log('Total de productos adaptados:', adaptedProducts.length);
        console.log('Productos adaptados (primeros 3):', adaptedProducts.slice(0, 3));
        
        // Ahora sí, después de que adaptedProducts está bien formado
        const kits = adaptedProducts.filter(item => item.category && item.category.toLowerCase() === 'kits');
        const offers = adaptedProducts.filter(item => item.originalPrice && item.originalPrice > item.currentPrice);
        
        console.log('Total de kits:', kits.length);
        console.log('Kits (primeros 3):', kits.slice(0, 3));
        console.log('Total de ofertas:', offers.length);
        console.log('Ofertas (primeros 3):', offers.slice(0, 3));
        console.log('***************************');
        // --- FIN CONSOLE.LOGS DE RESUMEN ---
        
        res.render('Home', {
            products: adaptedProducts,
            kits: kits,
            offers: offers
        });

    } catch (error) {
        console.error('Error al obtener datos y renderizar Home.ejs en webRoutes:', error);
        res.status(500).send('Error al cargar la página de inicio.');
    }
});

// Ruta para el listado general de productos (para la web, no API)
router.get('/productos', productoController.stock);

// Rutas de categorías para la web
router.get('/ofertas', productoController.ofertas);
router.get('/kits', productoController.kits);

// --- RUTAS DE CONTACTO ---
router.get('/contact', productoController.contactForm);
router.post('/submit-contact', productoController.handleContactForm);
router.get('/contact-success', (req, res) => {
    res.render('contact/contact-success'); // Asumo que esta es la ruta correcta
});

module.exports = router;