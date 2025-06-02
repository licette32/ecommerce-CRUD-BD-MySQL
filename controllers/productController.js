// controllers/productController.js
// Importa el modelo de producto que interactúa con la base de datos
const productModel = require('../models/productModel');
const path = require('path');
const fs = require('fs').promises; // Importamos fs.promises para eliminar archivos de forma asíncrona

const productController = {
    // Muestra la página de inicio con kits y ofertas (adaptado para BD)
    home: async (req, res) => {
        try {
            const allItems = await productModel.findAll(); // Obtiene todos los productos de la BD

            const kits = allItems.filter(item => item.categoria === 'kits');
            const offers = allItems.filter(item => item.precio_original && item.precio_original > item.precio);

            // Función auxiliar para adaptar los datos del producto a la vista
            const adaptProductData = (item) => ({
                _id: item.id,
                name: item.nombre,
                imageUrl: item.imagen,
                price: item.precio,
                currentPrice: item.precio,
                originalPrice: item.precio_original,
                description: item.descripcion || '',
                category: item.categoria,
                discountPercentage: (item.precio_original && item.precio_original > item.precio) ?
                    ((item.precio_original - item.precio) / item.precio_original * 100).toFixed(0) : undefined
            });

            const adaptedKits = kits.map(adaptProductData);
            const adaptedOffers = offers.map(adaptProductData);

            res.render('Home', {
                kits: adaptedKits,
                offers: adaptedOffers
            });

        } catch (error) {
            // Se mantiene este console.error ya que indica un fallo crítico en la carga de la página principal.
            console.error('Error al cargar la página de inicio:', error);
            res.status(500).render('error', {
                message: 'No pudimos cargar la página de inicio en este momento.'
            });
        }
    },

    // Muestra todos los productos o filtra por categoría
    stock: async (req, res) => {
        try {
            const allItems = await productModel.findAll(); // Obtiene todos los productos de la BD
            const categoriaSolicitada = req.query.categoria;

            const productosFiltrados = categoriaSolicitada ?
                allItems.filter(item => item.categoria === categoriaSolicitada) :
                allItems;

            // Función auxiliar para adaptar los datos del producto a la vista
            const adaptProductData = (item) => ({
                _id: item.id,
                name: item.nombre,
                imageUrl: item.imagen,
                price: item.precio,
                currentPrice: item.precio,
                originalPrice: item.precio_original,
                description: item.descripcion || '',
                category: item.categoria,
                discountPercentage: (item.precio_original && item.precio_original > item.precio) ?
                    ((item.precio_original - item.precio) / item.precio_original * 100).toFixed(0) : undefined
            });

            const adaptedProducts = productosFiltrados.map(adaptProductData);

            res.render('productos', {
                productosFiltrados: adaptedProducts,
                categoriaSeleccionada: categoriaSolicitada
            });

        } catch (error) {
            // Se mantiene este console.error para depurar problemas de carga de productos.
            console.error('Error al cargar la página de productos o categoría:', error);
            res.status(500).render('error', {
                message: 'No pudimos cargar los productos o la categoría solicitada en este momento.'
            });
        }
    },

    // Muestra los detalles de un producto específico
    detalle: async (req, res) => {
        try {
            const id = parseInt(req.params.id);
            const producto = await productModel.findById(id); // Obtiene el producto de la BD

            if (producto) {
                res.render('products/detalleProd', {
                    producto: producto
                });
            } else {
                res.status(404).render('error404', {
                    mensaje: 'Producto no encontrado',
                    imagen: '/image/error404.png'
                });
            }
        } catch (error) {
            // Se mantiene este console.error para problemas al buscar un producto por ID.
            console.error('Error al obtener detalle del producto:', error);
            res.status(500).send('Error interno del servidor al cargar el producto.');
        }
    },

    // --- MÉTODOS CRUD PARA EL ADMIN ---

    // Muestra el formulario para crear un nuevo producto
    createForm: (req, res) => {
        res.render('products/createProduct');
    },

    // Almacena un nuevo producto en la base de datos
    store: async (req, res) => {
        try {
            const {
                nombre,
                precio,
                categoria,
                descripcion,
                precio_original
            } = req.body;
            const imagen = req.file ? `image/${req.file.filename}` : 'image/default-product.png';

            const nuevoProducto = {
                nombre,
                precio: parseFloat(precio),
                categoria,
                descripcion,
                imagen,
                precio_original: precio_original ? parseFloat(precio_original) : null
            };

            await productModel.create(nuevoProducto); // Llama al modelo para crear en la BD
            res.redirect("/users/admin"); // Redirige al panel de admin
        } catch (error) {
            // Se mantiene este console.error para depurar fallos en la creación de productos.
            console.error("Error al guardar el producto:", error);
            res.status(500).send("Error interno al guardar el producto.");
        }
    },

    // Muestra el formulario para editar un producto existente
    editForm: async (req, res) => {
        try {
            const id = parseInt(req.params.id);
            const producto = await productModel.findById(id); // Obtiene el producto de la BD

            if (producto) {
                res.render('products/editProduct', {
                    producto
                });
            } else {
                res.status(404).render('error404', {
                    mensaje: 'Producto no encontrado',
                    imagen: '/image/error404.png'
                });
            }
        } catch (error) {
            // Se mantiene este console.error para errores al cargar el formulario de edición.
            console.error('Error al cargar formulario de edición:', error);
            res.status(500).send('Error interno del servidor.');
        }
    },

    // Actualiza un producto existente en la base de datos
    update: async (req, res) => {
        try {
            const id = parseInt(req.params.id);
            const {
                nombre,
                precio,
                categoria,
                descripcion,
                precio_original
            } = req.body;
            const nuevaImagen = req.file ? `image/${req.file.filename}` : null;

            const existingProduct = await productModel.findById(id);
            if (!existingProduct) {
                return res.status(404).render('error404', {
                    mensaje: 'Producto no encontrado',
                    imagen: '/image/error404.png'
                });
            }

            if (nuevaImagen && existingProduct.imagen && existingProduct.imagen !== 'image/default-product.png') {
                const oldImagePath = path.join(__dirname, '../public', existingProduct.imagen);
                try {
                    await fs.unlink(oldImagePath); // Elimina la imagen antigua
                    // Se mantiene este console.log porque es una acción importante en el sistema de archivos.
                    console.log(`Imagen antigua eliminada: ${oldImagePath}`);
                } catch (unlinkError) {
                    // Se mantiene este console.error porque es un error en el sistema de archivos que debe ser monitoreado.
                    console.error("ERROR: No se pudo eliminar la imagen antigua del disco:", unlinkError);
                }
            }

            const updatedProductData = {
                nombre,
                precio: parseFloat(precio),
                categoria,
                descripcion,
                imagen: nuevaImagen || existingProduct.imagen, // Usa la nueva imagen o mantiene la existente
                precio_original: precio_original ? parseFloat(precio_original) : null
            };

            await productModel.update(id, updatedProductData); // Llama al modelo para actualizar en la BD
            res.redirect('/users/admin'); // Redirige al panel de admin
        } catch (error) {
            // Se mantiene este console.error para problemas en la actualización del producto.
            console.error('Error al actualizar el producto:', error);
            res.status(500).send('Error interno al actualizar el producto.');
        }
    },

    // Muestra la confirmación para eliminar un producto
    deleteConfirm: async (req, res) => {
        try {
            const id = parseInt(req.params.id);
            const producto = await productModel.findById(id); // Obtiene el producto de la BD

            if (producto) {
                res.render('products/deleteProductConfirm', {
                    producto
                });
            } else {
                res.status(404).render('error404', {
                    mensaje: 'Producto no encontrado',
                    imagen: '/image/error404.png'
                });
            }
        } catch (error) {
            // Se mantiene este console.error para errores al cargar la confirmación de eliminación.
            console.error('Error al cargar confirmación de eliminación:', error);
            res.status(500).send('Error interno del servidor.');
        }
    },

    // Elimina un producto de la base de datos
    destroy: async (req, res) => {
        try {
            const id = parseInt(req.params.id);
            const productToDelete = await productModel.findById(id);

            if (!productToDelete) {
                return res.status(404).render('error404', {
                    mensaje: 'Producto no encontrado',
                    imagen: '/image/error404.png'
                });
            }

            if (productToDelete.imagen && productToDelete.imagen !== 'image/default-product.png') {
                const rutaImagen = path.join(__dirname, '../public', productToDelete.imagen);
                try {
                    await fs.unlink(rutaImagen); // Usa await con fs.promises.unlink
                    // Se mantiene este console.log porque es una acción importante en el sistema de archivos.
                    console.log(`Imagen eliminada del disco: ${rutaImagen}`);
                } catch (unlinkError) {
                    // Se mantiene este console.error porque indica un fallo en la eliminación de un archivo.
                    console.error("ERROR: Fallo al eliminar la imagen del disco:", unlinkError);
                }
            }

            await productModel.delete(id); // Llama al modelo para eliminar de la BD
            res.redirect('/users/admin'); // Redirige al panel de admin
        } catch (error) {
            // Se mantiene este console.error para errores críticos al eliminar un producto de la DB.
            console.error('Error al eliminar el producto:', error);
            res.status(500).send('Error interno al eliminar el producto.');
        }
    },

    // --- Otros métodos (posiblemente para el frontend) ---

    // Filtrar por categoría 'ofertas'
    ofertas: async (req, res) => {
        try {
            const productos = await productModel.findAll();
            const productosOferta = productos.filter(p => p.categoria === 'ofertas');
            res.render('products/ofertas', {
                products: productosOferta
            });
        } catch (error) {
            // Se mantiene este console.error para errores al cargar la sección de ofertas.
            console.error('Error al cargar ofertas:', error);
            res.status(500).send('Error interno del servidor.');
        }
    },

    // Filtrar por categoría 'kits'
    kits: async (req, res) => {
        try {
            const productos = await productModel.findAll();
            const productosKits = productos.filter(p => p.categoria === 'kits');
            res.render('products/kits', {
                products: productosKits
            });
        } catch (error) {
            // Se mantiene este console.error para errores al cargar la sección de kits.
            console.error('Error al cargar kits:', error);
            res.status(500).send('Error interno del servidor.');
        }
    },

    // Nuevo método para mostrar el formulario de contacto
    contactForm: (req, res) => {
        res.render('contact/contact');
    },

    // Nuevo método para manejar el envío del formulario de contacto
    handleContactForm: (req, res) => {
        const {
            nombre,
            email,
            telefono,
            mensaje
        } = req.body;
        // Se mantienen estos console.log porque son útiles para verificar que la información del formulario se recibe correctamente.
        console.log("Formulario de contacto recibido:");
        console.log("Nombre:", nombre);
        console.log("Email:", email);
        console.log("Teléfono:", telefono);
        console.log("Mensaje:", mensaje);
        res.redirect('/contact-success');
    },

    // Este admin se usará para el panel de administración
    admin: async (req, res) => {
        try {
            const productos = await productModel.findAll(); // Obtiene todos los productos para el admin
            res.render('admin/admin', {
                products: productos
            });
        } catch (error) {
            // Se mantiene este console.error para errores al cargar el panel de administración.
            console.error('Error al cargar el panel de admin:', error);
            res.status(500).send('Error interno del servidor.');
        }
    }
};

module.exports = productController;