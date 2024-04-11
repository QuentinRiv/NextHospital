const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');

// Base de données
const mongoDB = 'mongodb://127.0.0.1/ma_base_de_donnees'; // Remplacez ma_base_de_donnees par le nom de votre base de données
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

app.use(express.json());
app.use(express.static('public'));
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views')); // Assurez-vous que ce chemin mène au dossier où vous stockez vos templates EJS


// Route optionnelle pour servir index.html en tant que page d'accueil
const patientRoutes = require('./routes/patient');
const doctorRoutes = require('./routes/doctorR');
const userRoutes = require('./routes/user');
app.use('/patient', patientRoutes);
app.use('/doctor', doctorRoutes);
app.use('/auth', userRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
