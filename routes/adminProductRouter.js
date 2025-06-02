// routes/adminProductRouter.js (Este es el que tenías como productRouter.js)
const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const productoController = require("../controllers/productController");

// Configuración de Multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '../public/image'));
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});
const upload = multer({ storage });

// --- Rutas del CRUD para el panel de administración de Productos ---

// 1. CREAR PRODUCTO (CREATE)
router.get("/create", productoController.createForm); 
router.post("/create", upload.single('imagen'), productoController.store);

// 2. LEER/LISTAR PRODUCTOS (READ)
router.get("/detalle/:id", productoController.detalle); // Solo si hay una vista de detalle separada del admin

// 3. ACTUALIZAR PRODUCTO (UPDATE)
router.get("/edit/:id", productoController.editForm); 
router.put("/:id", upload.single('imagen'), productoController.update);

// 4. ELIMINAR PRODUCTO (DELETE)
router.get("/delete/:id", productoController.deleteConfirm); 
router.delete("/:id", productoController.destroy); 

module.exports = router;