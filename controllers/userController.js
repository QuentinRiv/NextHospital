import jwt from 'jsonwebtoken';
import { join, dirname } from 'path';
import { hash as _hash, compare } from 'bcrypt';
import { fileURLToPath } from 'url';

import User from '../models/User.js';
import { Http2ServerResponse } from 'http2';
import { getUserInfo } from './dbController.js'; // Ajustez le chemin relatif selon votre structure de répertoire


export function signup(req, res, next) {
    _hash(req.body.password, 10)
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
  }


  export function login(req, res, next) {
    User.findOne({ email: req.body.email })
        .then(user => {
            if (!user) {
                return res.status(401).json({ error: 'Utilisateur non trouvé !' });
            }
            compare(req.body.password, user.password)
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
 }

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

 export function  connect(req, res, next) {
    res.sendFile(join(__dirname, '..', 'views', './login.html'));
}

export async function getInfo(req, res) {
    try {
      const data = await getUserInfo(req.query.key, req.query.value);
      if (!data) {
        return res.status(404).json({ error: "Aucune donnée trouvée pour la clé et la valeur spécifiées" });
      }
      res.status(200).json(data);
    } catch (error) {
      res.status(500).send("Erreur interne du serveur : ", error);
    }
  }

  const userCtrl = {
    signup,
    login,
    connect,
    getInfo
};

export default userCtrl;