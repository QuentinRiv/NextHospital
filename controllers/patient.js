const Patient = require('../models/Patient');

exports.createPatient = (req, res, next) => {
    
  const newpatient = new Patient({
        patientname: req.body.patientname,
        password: req.body.password, // Vous devriez hasher les mots de passe avant de les stocker !
        email: req.body.email
      });
    
    newpatient.save()
      .then(patient => res.status(201).send(patient))
      .catch(err => res.status(500).send("Erreur lors de la création de l'utilisateur : " + err.message));

};

exports.getPatients = (req, res) => {
  Patient.find({}).then(patients => {
      res.render('patients', { patients: patients });
  }).catch(err => {
      console.error(err);
      res.status(500).send('Erreur lors de la récupération des patients');
  });
};