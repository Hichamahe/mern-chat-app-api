const express = require('express')

const router = express.Router()

//fs => file systeme pour arriver a un fichier 
const fs = require('fs').promises;

//recupérer le model User
const User = require('../models/Users')

const bcrypt = require('bcrypt');

//importer des fichier
const multer = require('multer');
let filenam = '';
const mystorage = multer.diskStorage({
  destination: function (req, file, cb) {
        cb(null, 'Uploads')},
  filename: (req, file, redirect)=>{
    let date = Date.now()
    let fl = date + '.' + file.mimetype.split('/')[1];
    redirect(null, fl)
    filenam = fl
  }
})


const upload = multer({storage: mystorage})

router.post('/upload', upload.single('image'), async (req, res) => {
  try{
        if (!req.file || !req.body.id) {
      return res.status(400).send({ error: 'Paramètres manquants' });
    }
    const imgUrl = '' + req.file.filename; // Chemin où l'image est sauvegardée
    const userId = req.body.id
    const user = await User.findByIdAndUpdate({_id: userId}, { image: imgUrl }, { new: true })


    // Enregistrez les modifications dans la base de données
    await user.save();
    res.status(200).send(user);
  } catch (error) {
    console.error('Erreur lors de la mise à jour de l\'image :', error);
    res.status(500).send(error);
  }
});

//récupérer l'image
router.use('/getimage', express.static('Uploads'))

//créer un utilisateur
router.post('/create', async (req, res)=>{
    
    try{
        const { name, lastName, email, password} = req.body;
        const hashpassword = bcrypt.hashSync(password, 10)
        //vérifier si email déja exister
        const emailExists  = await User.findOne({email})
        if(emailExists){
          return res.status(400).send({errors:{email: 'email déja exstant'}})
        }
        //créer un nouveau utilisateur
        const newUser  = new User({name, lastName, email, password: hashpassword});
        const savedUser = await newUser.save();
        res.send(savedUser)
    } catch (error){
        console.error('Erreur lors de la création d\'un utilisateur :', error);
        res.status(500).send(error)
    }
})

//Récupérer un utilisateur dans la base des données
router.get('/home/users/:userId',async (req, res)=>{
  try {
    const userId = req.params.userId;
    const usr = await User.findById(userId);
    res.json(usr);
  } catch (error) {
    // console.error('Erreur lors de la récupération de l\'utilisateur :', error);
    res.status(500).send('Erreur serveur');
  }
})



//login page
const jwt = require('jsonwebtoken');
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    // vérifier si le email est correcte
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).send('email ou mot de passe incorrect !');
    }
    // vérifier si le mdp est correcte
    const isValidPassword = await bcrypt.compareSync(password, user.password);
    if (!isValidPassword) {
      return res.status(401).send('email ou mot de passe incorrect !');
    }

    // Mettre à jour le champ 'actif' à true
    await User.updateOne({ email }, { $set: { actif: true } });
    // générer un token JWT
    const payload = {
      id: user._id,
      email: user.email,
    };
    const token = jwt.sign(payload, 'azer/123');
    // envoyer token au client
    res.status(200).send({ token, id: user.id, actif:true });
  } catch (error) {
    console.error('Erreur lors de la connexion :', error);
    res.status(500).send('Erreur interne du serveur');
  }
});

// Route de déconnexion
router.post('/logout', async (req, res) => {
  const { userId  } = req.body;
  console.log('Id reçu pour la déconnexion :', userId );
  try {
    // Mettre à jour le champ 'actif' à false lors de la déconnexion
    await User.updateOne({ _id: userId }, { $set: { actif: false } });
    // Répondre avec un message de succès
    res.status(200).send('Déconnexion réussie');
  } catch (error) {
    console.error('Erreur lors de la déconnexion :', error);
    res.status(500).send('Erreur interne du serveur');
  }
});

//supprimer un utilisateur
router.delete('/home/delete', async (req, res) => {
  try {
    const userId = req.body.id;
    // Récupérez l'utilisateur avant de le supprimer
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).send({ error: 'Utilisateur non trouvé' });
    }
    // Supprimez le fichier image associé
    if (user.image) {
      const imagePath = `../Uploads/${user.image}`;
      try {
        await fs.unlink(imagePath);
        console.log(`Fichier image supprimé : ${imagePath}`);
      } catch (error) {
        console.error('Erreur lors de la suppression du fichier image :', error);
      }
    }
    // Supprimez l'utilisateur
    await User.findByIdAndDelete(userId);

    res.status(200).send({ message: 'Utilisateur et image associée supprimés avec succès' });
  } catch (error) {
    console.error('Erreur lors de la suppression de l\'utilisateur :', error);
    res.status(500).send({ error: 'Erreur serveur lors de la suppression de l\'utilisateur' });
  }
});

//Récupérer la verification de token 
const  validateToken  = require('../Middleware/ValidateToken')

// Récupérer tous les utilisateurs sauf l'utilisateur actuel
router.get("/allUsers", validateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    let users = await User.find({ _id: { $ne: userId } }, "name lastName image");
    res.json(users);
  } catch (error) {
    console.error('Erreur lors de la récupération des utilisateurs :', error);
    res.status(500).send(error);
  }
});

router.get('/users/active', async (req, res) => {
      try {
        const  userIdToExclude  = req.query.id; // Récupérer l'ID de l'utilisateur à exclure depuis les paramètres de requête
        // Construire la requête MongoDB pour obtenir tous les utilisateurs actifs sauf l'utilisateur spécifié
        const query = { actif: true, _id: { $ne: userIdToExclude } };
        const UserActifs = await User.find(query);
        res.json({ UserActifs });
    } catch (error) {
        console.error('Erreur lors de la récupération des utilisateurs actifs', error);
        res.status(500).json({ error: 'Erreur lors de la récupération des utilisateurs actifs' });
    }
});

module.exports = router
