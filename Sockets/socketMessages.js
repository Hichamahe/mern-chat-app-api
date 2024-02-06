const Message = require('../models/Messages');

module.exports = (io) => {
  io.on('connection', (socket) => {
    socket.on('sendMessage', async (data) => {
      try {
        const msg = new Message(data);
        await msg.save();
        const formattedDate = new Date().toISOString();
        io.emit('newMessage', {
          _id: data._id, 
          content: data.content,
          senderId: data.senderId,
          receiverId:data.receiverId,
          senderName: data.senderName,
          senderLastName: data.senderLastName,
          senderImage: data.senderImage,
          sentAt: formattedDate,
        });
        // Émettre une notification à tous les utilisateurs sauf à l'expéditeur
        io.emit('messageNotification', {
         senderId: data.senderId,
         receiverId:data.receiverId,
        });

      } catch (error) {
        console.error(error);
      }
    });

    socket.on('disconnect', () => {
    });
  });
};
