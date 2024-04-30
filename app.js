import express, { json, urlencoded, static as staticServe } from "express";
const app = express();
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
dotenv.config();

// Base de données
const mongoDB =
  "mongodb+srv://nohepeh973:b1WLyvrljlLFFzLn@nexthospital.ixqdtf5.mongodb.net/?retryWrites=true&w=majority&appName=NextHospital"; // URI de ma DB
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:")); // En cas d'erreur

app.use(json());
app.use(staticServe("public"));
app.use(cookieParser());
app.use(urlencoded({ extended: true }));

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.set("views", join(__dirname, "views"));
app.set("view engine", "ejs");

// Routes qui elles-mêmes font appelle à des Controllers
import patientRoutes from "./routes/patientRoute.js";
import doctorRoutes from "./routes/doctorRoute.js";
import userRoutes from "./routes/userRoute.js";
import consultationRoute from "./routes/consultationRoute.js";
import appointmentRoute from "./routes/appointmentRoute.js";
import documentRoute from "./routes/documentRoute.js";
app.use("/patient", patientRoutes);
app.use("/doctor", doctorRoutes);
app.use("/auth", userRoutes);
app.use("/consultation", consultationRoute);
app.use("/appointment", appointmentRoute);
app.use("/document", documentRoute);

// Démarrage du serveur
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Liste des choses à faire
app.get("/todo", function (req, res) {
  const afaire = {
    1: "Page des docs => régler les infos qui disparaissent",
    2: "Page des docs => premier icone pour ajouter un fichier ou dossier",
    3: "Résoudre les soucis de création de patient",
  };
  return res.status(202).json(afaire);
});

// Si l'URL n'existe pas
app.get("*", function (req, res) {
  res.sendFile(join(__dirname, ".", "views", "error404.html"));
});
