//connecter le serveur avec la base des donnés
const mongoose = require('mongoose')

mongoose.connect('mongodb://127.0.0.1:27017/signUp-signIn', {
              useNewUrlParser: true,
              useUnifiedTopology: true,
})
    
        .then(()=>{
            console.log('la base des données est connecté')
        })
        .catch((err)=>{
            console.log(err)
        })

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'Erreur de connexion à la base de données :'));
db.once('open', () => {
  console.log('Connecté à la base de données MongoDB');
});

module.exports = mongoose