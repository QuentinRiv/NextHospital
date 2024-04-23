import { Router } from 'express';
import { join, dirname } from 'path'; // Assurez-vous que cette ligne est décommentée
const router = Router();

import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

router.get('/', (req, res) => {
  res.sendFile(join(__dirname, '..', 'views', 'document.html'));
});


export default router;
