const mongoose = require('mongoose')

const Invitation = mongoose.model('Invitation', {
  sender : {
    type: mongoose.Types.ObjectId,
    required : true,
    propreties:{
        senderUserID: {
           type: String,
           ref: 'User',
           required: true,
        },
        senderName: {
           type: String,
           ref: 'User',
           required: true,
        },
        senderLastName: {
           type: String,
           ref: 'User',
           required: true,
        },
    }
  },
  receiverUserID: {
    type: mongoose.Types.ObjectId,
    ref: 'User',
    required: true,
  },
    type: {
    type: String,
    default: 'invitation-personnelle',  // Type spécifique pour une invitation personnelle
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'declined'],
    default: 'pending',
  },
  sentAt: {
    type: Date,
    default: Date.now,
  },
})

module.exports = Invitation