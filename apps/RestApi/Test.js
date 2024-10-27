// Importar las dependencias
const express = require('express');

// Crear una instancia de Express
const app = express();

// Configurar el puerto
const PORT = 3000;

// Middleware para manejar el parsing de JSON
app.use(express.json());

// Endpoint para comprobar el servidor
app.get('/', (req, res) => {
    res.send('¡El servidor está funcionando correctamente!');
    console.log('¡El servidor está funcionando correctamente!');
});

app.post('/api/v1/users/login', (req, res) => {
    console.log("Esto es un login");
});


// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
