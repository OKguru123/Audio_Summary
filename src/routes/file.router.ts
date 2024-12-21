import { Router } from 'express';
import { myUploader } from '../Middleware/multer';
import { convertAudioToText , convertUploadedAudioFileToText, deleteAllAudioFile, deleteFileById, getAllAudio, renameFileById, UploadAudioFile } from '../Controllers/file.controller';
import { PromiseHandler } from '../modules/v1/common/middlewares';

const router = Router();

router.post('/upload', myUploader.single("audioFile") ,PromiseHandler(UploadAudioFile));
router.get('/getAllAudio' , PromiseHandler(getAllAudio))
router.put("/renameFileById/:audioFileId" , PromiseHandler(renameFileById))
router.delete("/deleteFileById/:audioFileId" , PromiseHandler(deleteFileById))
router.delete("/deleteAllAudioFiles" , PromiseHandler(deleteAllAudioFile))
router.get("/getTranscribedText/:audioFileId" , PromiseHandler(convertUploadedAudioFileToText))




export default router;
