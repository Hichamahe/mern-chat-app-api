const express = require('express')
const router = express.Router()
//recupérer le model User
const Message = require('../models/Messages')

// Enregistrement d'un nouveau message
router.post('/messages', async (req, res) => {
  try {
    const { senderId, receiverId, content, senderName, senderLastName, senderImage } = req.body;
    const newMessage = new Message({
      senderId,
      receiverId,
      content, 
      senderName, 
      senderLastName, 
      senderImage
    });
    await newMessage.save();
    res.status(201).json(newMessage);
  } catch (error) {
    console.error('Erreur lors de l\'enregistrement du message :', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Récupération des messages d'un utilisateur spécifique
router.get('/messages/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;
    const messages = await Message.find({ $or: [{ senderId: userId }, { receiverId: userId }] });
    res.json({ messages });
  } catch (error) {
    console.error('Erreur lors de la récupération des messages :', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

router.get('/messages/:receiverId/:senderId', async (req, res) => {
  const { receiverId, senderId } = req.params;

  try {
    const messages = await Message.find({
      $or: [
        { senderId, receiverId },
        { senderId: receiverId, receiverId: senderId },
      ],
    }).sort({ sentAt: 'asc' });

    res.json(messages);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur lors de la récupération des messages.' });
  }
});


module.exports = router;

