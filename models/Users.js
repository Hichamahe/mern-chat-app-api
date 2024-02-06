const mongoose = require('mongoose')

const User = mongoose.model('User', {
    name:{
        type:String,
        require:true
    },
    lastName:{
        type:String
    },
    image:{
        type:String
    },
    email:{
        type:String
    },
    password:{
        type:String
    },
    amis :[{type:mongoose.Types.ObjectId, ref: 'User'}],

    demandeAmis:[{  
        senderId:   { type: String, ref: 'User' },
        type:       { type: String, default: 'pending' },
        senderName:       { type: String, ref: 'User' },
        senderLastName:   { type: String, ref: 'User' },
        senderImage:      { type: String, ref: 'User' },
        sentAt:     { type: Date, default: Date.now },
    }],
 
    dernnier_connexion: {
        type:Date
    },

    actif: Boolean,

})

module.exports = User