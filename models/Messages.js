const mongoose = require('mongoose')


const MessageSchema = new mongoose.Schema({
  senderId: {
    type: String,
    required: true,
  },
  senderName: {
    type:String
  },
  senderLastName: {
    type:String
  },
  senderImage: {
    type:String
  },
  receiverId: {
    type: String,
  },
  content: {
    type: String,
    required: true,
  },
  sentAt: {
    type: Date,
    default: Date.now,
  },
})

const Message = mongoose.model('Message', MessageSchema)

module.exports = Message;