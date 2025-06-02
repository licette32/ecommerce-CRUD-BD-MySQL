-- 1. Crea la base de datos si no existe
CREATE DATABASE IF NOT EXISTS mi_tienda;

-- 2. Selecciona la base de datos para usarla
USE mi_tienda;

-- 3. Crea la tabla 'productos' si no existe

CREATE TABLE IF NOT EXISTS productos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    descripcion TEXT,
    precio DECIMAL(10, 2) NOT NULL,
    imagen VARCHAR(255),
    categoria VARCHAR(100),
    precio_original DECIMAL(10, 2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 4. Crea la tabla 'usuarios' si no existe
CREATE TABLE IF NOT EXISTS usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE,
    is_admin BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 5. Inserta un usuario administrador de ejemplo
INSERT INTO usuarios (username, password, is_admin) VALUES ('admin', '1234', TRUE);

-- 6. Sentencias INSERT INTO para los productos

INSERT INTO productos (id, nombre, precio, imagen, categoria, descripcion, precio_original) VALUES
(4, 'Mochila Trekking 60L', 55750.00, 'image/mochila4.png', 'camping', 'En color gris, negro y rojo.', NULL);

INSERT INTO productos (id, nombre, precio, imagen, categoria, descripcion, precio_original) VALUES
(5, 'Kit de Anzuelos Profesional', 12990.00, 'image/kitanzuellos5.png', 'pesca', NULL, 18500.00);

INSERT INTO productos (id, nombre, precio, imagen, categoria, descripcion, precio_original) VALUES
(6, 'Linterna Frontal Recargable', 18500.00, 'image/linternafrontal6.png', 'camping', NULL, 24990.00);

INSERT INTO productos (id, nombre, precio, imagen, categoria, descripcion, precio_original) VALUES
(8, 'Carrete de Pesca Spinning', 37800.00, 'image/carretepesca8.png', 'pesca', NULL, 45000.00);

INSERT INTO productos (id, nombre, precio, imagen, categoria, descripcion, precio_original) VALUES
(9, 'Termo NEW Classic 800 ml Mate System 22hrs', 124650.00, 'image/termo1.png', 'camping', NULL, NULL);

INSERT INTO productos (id, nombre, precio, imagen, categoria, descripcion, precio_original) VALUES
(10, 'Mesa de aluminio para Camping con 2 bancos', 240590.00, 'image/mesacamp.png', 'camping', NULL, NULL);

INSERT INTO productos (id, nombre, precio, imagen, categoria, descripcion, precio_original) VALUES
(12, 'Sombrilla C/ Rompeviento Tipo Carpa Playa + Funda', 107260.00, 'image/sombrilla.png', 'camping', NULL, NULL);

INSERT INTO productos (id, nombre, precio, imagen, categoria, descripcion, precio_original) VALUES
(13, 'Kit de Anzuelos Profesional', 12990.00, 'image/kitanzuellos5.png', 'ofertas', NULL, 18500.00);

INSERT INTO productos (id, nombre, precio, imagen, categoria, descripcion, precio_original) VALUES
(14, 'Linterna Frontal Recargable', 18500.00, 'image/linternafrontal6.png', 'ofertas', NULL, 24990.00);

INSERT INTO productos (id, nombre, precio, imagen, categoria, descripcion, precio_original) VALUES
(15, 'Carrete de Pesca Spinning', 37800.00, 'image/carretepesca8.png', 'pesca', NULL, NULL);

INSERT INTO productos (id, nombre, precio, imagen, categoria, descripcion, precio_original) VALUES
(16, 'Kit Iniciación Camping', 149990.00, 'image/kit1.png', 'kits', 'Incluye tienda, saco, colchoneta y linterna.', 179990.00);

INSERT INTO productos (id, nombre, precio, imagen, categoria, descripcion, precio_original) VALUES
(17, 'Kit Pesca Completo', 99990.00, 'image/kit2.png', 'kits', 'Caña, carrete, línea, anzuelos, señuelos y caja de pesca.', 125000.00);

INSERT INTO productos (id, nombre, precio, imagen, categoria, descripcion, precio_original) VALUES
(18, 'Kit Supervivencia', 45500.00, 'image/kit3.png', 'kits', 'Navaja, brújula, silbato, primeros auxilios, manta térmica.', 59990.00);

INSERT INTO productos (id, nombre, precio, imagen, categoria, descripcion, precio_original) VALUES
(19, 'Kit Familiar Camping', 299990.00, 'image/kit4.png', 'kits', 'Tienda 6 personas, 4 sacos, mesa y cocinilla a gas.', 359099.00);

INSERT INTO productos (id, nombre, precio, imagen, categoria, descripcion, precio_original) VALUES
(21, 'Caja de pesca Barracuda grande 2 bandejas', 59100.00, 'image/cajab.png', 'pesca', NULL, NULL);

INSERT INTO productos (id, nombre, precio, imagen, categoria, descripcion, precio_original) VALUES
(22, 'Bobina De Nylon Asso 250 Gramos', 65500.00, 'image/bobina.png', 'pesca', NULL, NULL);

INSERT INTO productos (id, nombre, precio, imagen, categoria, descripcion, precio_original) VALUES
(23, 'Cuchara HOLOLURE #2', 16330.00, 'image/cuchara1.png', 'pesca', NULL, NULL);

INSERT INTO productos (id, nombre, precio, imagen, categoria, descripcion, precio_original) VALUES
(27, 'mesa', 350050.00, 'image/imagen-1748794528172-729712517.png', 'pesca', NULL, NULL);

INSERT INTO productos (id, nombre, precio, imagen, categoria, descripcion, precio_original) VALUES
(28, 'Juego de mesa y sillas plegables ultraligero 3 en 1', 350000.00, 'image/imagen-1748796541315-482968079.png', 'pesca', '3 en 1', NULL);

INSERT INTO productos (id, nombre, precio, imagen, categoria, descripcion, precio_original) VALUES
(30, 'Inflador', 75000.00, 'image/imagen-1748798918936-843630507.png', 'camping', 'Marca Spinit', NULL);

INSERT INTO productos (id, nombre, precio, imagen, categoria, descripcion, precio_original) VALUES
(31, 'Tienda de Campaña 4 Personas', 350000.00, 'image/imagen-1748809253007-751831862.jpg', 'camping', 'En color verde y azul.', NULL);