import { Router } from 'express';
import { upload } from '../Middleware/multer';

const router = Router();

router.post('/file/upload', upload.single('audio'), convertAudioToText);

export default router;
