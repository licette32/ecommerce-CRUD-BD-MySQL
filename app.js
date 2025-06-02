// app.js
const express = require('express');
const path = require('path');
const methodOverride = require('method-override');
const sequelize = require('./config/db'); 

// --- Importa tus Routers ---
const adminProductRouter = require('./routes/adminProductRouter');

// 2. userRouter: Para todo lo relacionado con usuarios y autenticación (login, admin dashboard)
const userRouter = require('./routes/userRouter');

// 3. webRoutes: Para todas las páginas web generales (Home, Productos para la web, Contacto, etc.)
const webRoutes = require('./routes/webRoutes');

const app = express();

// --- Middlewares de la Aplicación ---
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

// --- Configuración de EJS ---
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// --- Servir archivos estáticos ---
app.use(express.static(path.join(__dirname, 'public')));

// --- Montaje de Routers ---
// Monta las rutas del CRUD de productos del ADMIN bajo el prefijo /admin/productos
// Esto coincidirá con las acciones de tus formularios EJS
app.use('/admin/productos', adminProductRouter); // <--- ¡CAMBIO CRUCIAL AQUÍ!

// Monta las rutas de usuario bajo el prefijo /users
app.use('/users', userRouter);

// Monta las rutas web generales en la raíz (/)
app.use('/', webRoutes);

// --- Manejo de errores 404 (Not Found) ---
app.use((req, res, next) => {
    res.status(404).render('error404', {
        mensaje: 'La página que buscas no se pudo encontrar.',
        imagen: '/image/404-error.png'
    });
});

// --- Inicio del Servidor y Conexión a la Base de Datos ---
async function startServer() {
    try {
        await sequelize.authenticate();
        console.log('Conexión a la base de datos MySQL con Sequelize establecida correctamente.');

        await sequelize.sync({ alter: true });
        console.log('Modelos sincronizados con la base de datos.');

        const PORT = process.env.PORT || 3000;
        app.listen(PORT, () => {
            console.log(`Servidor corriendo en http://localhost:${PORT}`);
            console.log('Presiona Ctrl + C para detenerlo.');
        });

    } catch (error) {
        console.error('ERROR CRÍTICO: No se pudo conectar o sincronizar la base de datos o iniciar el servidor:', error);
        process.exit(1);
    }
}

startServer();