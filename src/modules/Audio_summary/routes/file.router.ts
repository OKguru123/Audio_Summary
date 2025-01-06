import { Router } from 'express';
import { myUploader } from '../../../Middleware/multer';
import {
  convertAudioToText,
  deleteAllAudioFile,
  deleteFileById,
  deleteMultipleAudioFiles,
  getAllAudio,
  renameFileById,
  summarizeOnClick,
  UploadAudioFile,
} from '../Controllers/file.controller';
import { PromiseHandler } from '../../v1/common/middlewares';

const router = Router();
router.post(
  '/uploadAndConvert',
  myUploader.single('audioFile'),
  PromiseHandler(convertAudioToText)
);
router.post(
  '/upload',
  myUploader.single('audioFile'),
  PromiseHandler(UploadAudioFile)
);
router.get('/getAllAudio', PromiseHandler(getAllAudio));
router.put('/renameFileById/:audioFileId', PromiseHandler(renameFileById));
router.delete('/deleteFileById/:audioFileId', PromiseHandler(deleteFileById));
router.delete('/deleteAllAudioFiles', PromiseHandler(deleteAllAudioFile));
router.get('/summarizeOnClick/:audioFileId', PromiseHandler(summarizeOnClick));
router.delete(
  '/deleteMultipleAudioFiles',
  PromiseHandler(deleteMultipleAudioFiles)
);

export default router;
