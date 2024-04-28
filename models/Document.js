import mongoose, { model } from "mongoose";
const { Schema } = mongoose;

const documentSchema = new Schema({
  name: { type: String, required: true },
  type: { type: String, required: true }, // 'file' or 'folder'
  extension: { type: String, required: true },
  parent: { type: Schema.Types.ObjectId, ref: "Document", default: null }, // Pointe vers le parent (null pour la racine)
  children: [{ type: Schema.Types.ObjectId, ref: "Document" }], // Liste des enfants
  size: { type: Number, required: true, default: 0 }, // En octets
  creationDate: { type: Date, default: Date.now }, // Date de création
  modifDate: { type: Date, default: Date.now }, // Date de dernière modification
  path: { type: String, required: true }, // Chemin complet
  owner: { type: Schema.Types.ObjectId, ref: "User" }, // Référence à un modèle d'utilisateur
});

const Document = model("Document", documentSchema);

export default Document;
