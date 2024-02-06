const User = require('../models/Users');

module.exports = (io) => {
  io.on('connection', (socket) => {
    socket.on('updateUserStatus', async (userId, newStatus) => {
      try {
        // Mettez à jour le statut de l'utilisateur dans la base de données
        await User.updateOne({ _id: userId }, { $set: { actif: newStatus } });
        // Récupérez tous les utilisateurs actifs, sauf l'utilisateur actuel
        const updatedActiveUsers = await User.find({ actif: true, _id: { $ne: userId } });
        // Émettez la liste mise à jour des utilisateurs actifs à tous les clients connectés
        io.emit('activeUsers', updatedActiveUsers);
      } catch (error) {
        console.error('Erreur lors de la mise à jour du statut de l\'utilisateur :', error);
      }
    });
      
    socket.on('disconnect', () => {
    });
  });
};