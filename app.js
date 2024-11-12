const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');
const path = require('path');
const authRoutes = require('./routes/authRoutes');  // Importa las rutas de autenticación
const app = express();

// Middleware para parsear JSON y archivos estáticos
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Rutas de autenticación
app.use('/api/auth', authRoutes);  // Ruta que usa el archivo 'authRoutes.js'

// Configuración de la API de Sinric Pro
const API_KEY = 'fb9e9e90-6c91-45d4-9fcf-0031bb370b5c';
let accessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3MDYwZTVlZGVkZGVjZTM0YmFhMTI3NiIsInRpZCI6IjY3MzAwNmJjOGYzY2M1MTdlYjE0NTY4ZSIsImlhdCI6MTczMTIwMDcwMCwiZXhwIjoxNzMxODA1NTAwfQ.NSuBgpKXi42tRb4vRS33DzxfTmLyzV1eptj-7QTdsaw'; // Token obtenido previamente
const DEVICE_ID = '67060f670d73840bd1d70018';

// Ruta para obtener el accessToken
app.get('/auth', async (req, res) => {
  try {
    const response = await axios.post('https://api.sinric.pro/api/v1/auth', {}, {
      headers: { 'x-sinric-api-key': API_KEY }
    });
    accessToken = response.data.accessToken;
    res.send('Token obtenido con éxito');
  } catch (error) {
    res.status(500).send('Error obteniendo el token');
  }
});

// Ruta para encender el dispositivo
app.post('/turnOn', async (req, res) => {
  try {
    const response = await axios.post(`https://api.sinric.pro/api/v1/devices/${DEVICE_ID}/action`, 
      { type: 'request', action: 'setPowerState', value: JSON.stringify({ state: 'On' }) }, 
      { headers: { 'Authorization': `Bearer ${accessToken}`, 'Content-Type': 'application/json' } }
    );
    res.send('Dispositivo encendido');
  } catch (error) {
    res.status(500).send('Error encendiendo el dispositivo');
  }
});

// Ruta para apagar el dispositivo
app.post('/turnOff', async (req, res) => {
  try {
    const response = await axios.post(`https://api.sinric.pro/api/v1/devices/${DEVICE_ID}/action`, 
      { type: 'request', action: 'setPowerState', value: JSON.stringify({ state: 'Off' }) }, 
      { headers: { 'Authorization': `Bearer ${accessToken}`, 'Content-Type': 'application/json' } }
    );
    res.send('Dispositivo apagado');
  } catch (error) {
    res.status(500).send('Error apagando el dispositivo');
  }
});

// Iniciar el servidor
const PORT = 3000;
app.listen(PORT, () => console.log(`Servidor corriendo en el puerto ${PORT}`));
