// Importez les modules nécessaires
require('./connect');
const express = require('express');
const http = require('http');
// Créez une application Express
const app = express();
app.use(express.json())
const server = http.createServer(app);
const cors = require('cors');
// Utilisez le middleware CORS pour toutes les routes
app.use(cors());
// Utilisez les routes pour les messages et les utilisateurs
const messagesRoutes = require('./Routes/Message');
const userRoutes = require('./Routes/User');
app.use('/', messagesRoutes);
app.use('/', userRoutes);


app.use(express.static('client/build'));
app.get('*', (req, res) => {
  res.sendFile(`${__dirname}/client/build/index.html`)
})

const socketIo = require('socket.io');
const configureSockets = require('./Sockets/sockets');

// Créez une instance Socket.IO avec la configuration CORS
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:5173", // Ajoutez l'URL de votre client React ici
    methods: ["GET", "POST"]
  }
});

// Utilisez le gestionnaire de socket
configureSockets(io);

// Définissez le port
const PORT = process.env.PORT || 3003;

// Lancez le serveur
server.listen(PORT, () => {
  console.log(`Serveur en cours d'exécution sur le port ${PORT}`);
});

// Chargez la configuration de l'environnement
require('dotenv').config();

