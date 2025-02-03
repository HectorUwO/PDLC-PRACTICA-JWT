const express = require('express');
const jwt = require('jsonwebtoken');
const cors = require('cors');

const app = express();
const port = 3000;

app.use(express.json());
app.use(cors());

const SECRET_KEY = "clave_secreta_educativa";

// Ruta protegida con JWT para GET
app.get('/protected', (req, res) => {
    const token = req.headers['authorization']?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: "Token requerido" });
    }

    jwt.verify(token, SECRET_KEY, (err, decoded) => {
        if (err) {
            return res.status(403).json({ error: "Token inválido o expirado" });
        }
        res.json({ message: "Acceso permitido", user: decoded });
    });
});

// Nueva ruta protegida para POST
app.post('/protected', (req, res) => {
    const token = req.headers['authorization']?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: "Token requerido" });
    }

    jwt.verify(token, SECRET_KEY, (err, decoded) => {
        if (err) {
            return res.status(403).json({ error: "Token inválido o expirado" });
        }
        
        // Procesar los datos recibidos
        const { title, body, userId } = req.body;
        
        // Ejemplo de respuesta con los datos recibidos
        res.status(201).json({ 
            message: "Datos recibidos correctamente", 
            data: { title, body, userId } 
        });
    });
});

app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});