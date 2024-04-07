const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');

const mongoDB = 'mongodb://127.0.0.1/ma_base_de_donnees'; // Remplacez ma_base_de_donnees par le nom de votre base de données
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));


const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static('public'));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views')); // Assurez-vous que ce chemin mène au dossier où vous stockez vos templates EJS


// Route optionnelle pour servir index.html en tant que page d'accueil
const patientRoutes = require('./routes/patientRoutes');

app.use('/', patientRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});