import { Router } from 'express';
const router = Router();

import documentCtrl from '../controllers/documentController.js';

router.get('/fileList', documentCtrl.fileList);
router.get('/', documentCtrl.home);

export default router;
