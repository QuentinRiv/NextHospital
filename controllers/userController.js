const jwt = require('jsonwebtoken');
const path = require('path');
const bcrypt = require('bcrypt');

const User = require('../models/User');
const { Http2ServerResponse } = require('http2');

exports.signup = (req, res, next) => {
    bcrypt.hash(req.body.password, 10)
      .then(hash => {
        const user = new User({
          email: req.body.email,
          password: hash,
          profileType: req.body.profileType,
          profileId: req.body.profileId
        });
        user.save()
          .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
          .catch(error => res.status(400).json({ error }));
      })
      .catch(error => res.status(500).json({ error: error.message }));
  };


  exports.login = (req, res, next) => {
    User.findOne({ email: req.body.email })
        .then(user => {
            if (!user) {
                return res.status(401).json({ error: 'Utilisateur non trouvé !' });
            }
            bcrypt.compare(req.body.password, user.password)
                .then(valid => {
                    if (!valid) {
                        return res.status(401).json({ error: 'Mot de passe incorrect !' });
                    }
                    const tokenn = jwt.sign(
                        { userId: user._id },
                        'RANDOM_TOKEN_SECRET',
                        { expiresIn: '24h' }
                    );
                    res.cookie('jwt', tokenn, {Http2ServerResponse, maxAge: 60*60*24*1000});
                    res.status(200).json({
                        userId: user._id,
                        token: tokenn,
                        profileType: user.profileType
                    });
                    

                })
                .catch(error => res.status(500).json({ error: error.message }));
        })
        .catch(error => res.status(500).json({ error }));
 };

 exports.connect = (req, res, next) => {
    res.sendFile(path.join(__dirname, '..', 'views', 'login.html'));
};

exports.getUserInfo = async (req, res) => {
    const key = req.query.key;
    const value = req.query.value;
    if (value) {
        try {
            // Correction de la valeur pour remplacer '%20' par des espaces
            const adjustedValue = value.replace(/%20/g, " ");
            // Assumons que vous cherchez par 'name', corriger la requête pour utiliser la clé correcte
            const user = await User.findOne({ [key]: value });

            if (user) {
                console.log(user);
                res.status(202).json({
                    id: user._id,
                    email: user.email,
                    profileType: user.profileType // Données réelles du patient trouvé
                });
            } else {
                // Aucun utilisateur trouvé avec ce nom
                res.status(404).json({ message: "Aucun user trouvé avec ce nom." });
            }
        } catch (error) {
            // Gestion des erreurs de la requête à la base de données
            console.error('Erreur lors de la recherche du user:', error);
            res.status(500).json({ message: "Erreur interne du serveur lors de la recherche du user ." });
        }
    } else {
        res.status(400).json({ message: "Aucune valeur spécifiée pour la recherche." });
    }
};

