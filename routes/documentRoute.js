import { Router } from 'express';
const router = Router();

import documentCtrl from '../controllers/documentController.js';

router.get('/fileList', documentCtrl.fileList);
router.get('/', documentCtrl.home);
router.get('/random', documentCtrl.createDocumentHierarchy);
router.get('/getDocuments', documentCtrl.getDocuments);
router.get('/getDocumentInfo', documentCtrl.getDocumentInfo);

export default router;
