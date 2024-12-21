import { Request, Response, NextFunction } from 'express';
import { CustomError } from '../errors/error';
import response from '../helpers/response';
import path from 'path';
import { convertDataIntoStreams } from '../utils/createFileStream';
import { getTranscriptionText } from '../utils/TranscriptionTextOfFile';
import fs from 'fs';
import { File } from '../Models/file.model';
import logger from '../helpers/logger';
import { FileSchema } from '../@types';

const convertAudioToText = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.file) {
      return next(
        new CustomError(
          'Please Provide the audio File that was expected to be uploaded for transcription',
          400
        )
      );
    }

    const audioFilePath = req.file?.path;

    if (!audioFilePath) {
      return next(
        new CustomError('File could not be uploaded successfully', 400)
      );
    }

    // Step 1: Convert the file relative path into an absolute path
    const absoluteFilePath = path.resolve(audioFilePath);
    console.log('My File Absolute Path:', absoluteFilePath);

    // Step 2: Create a stream of the audio file
    const streamFileData = convertDataIntoStreams(absoluteFilePath);
    console.log('Stream File Data:', streamFileData);

    // Step 3: Get the transcription from OpenAI API
    const data = await getTranscriptionText(streamFileData);
    console.log('Transcription Data:', data);

    // If transcription was successful, return the result
    return response.success({
      res,
      code: 200,
      data: {
        success: true,
        message: 'Your file uploaded and transcribed successfully',
        transcription: data.text, // Assuming `data.text` contains the transcription
      },
      error: false,
    });
  } catch (error: any) {
    return next(new CustomError(error?.message));
  }
};

const convertUploadedAudioFileToText = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { audioFileId } = req.params;

    if (!audioFileId) {
      return next(new CustomError('Please Provide the File Id', 400));
    }

    const audioFile = (await File.findByPk(audioFileId))?.dataValues;

    if (!audioFile) {
       return next(new CustomError("File with Id not found" , 404))
    }

    const filePath = path.join(__dirname , "../public/uploads" , audioFile?.fileUrl)

   

    // Now send the streamFileData into the transcription text Function :-
    const transcribedResponse = await getTranscriptionText(filePath);


    if (!transcribedResponse || !transcribedResponse.text) {
         return next (new CustomError("transcribed text not found"))
    }
    return response.success({
     res,
     code: 200,
     data: {
       success: true,
       message: 'Your file uploaded and transcribed successfully',
       transcription: transcribedResponse.text, // Assuming `data.text` contains the transcription
     },
     error: false,
    })


  } catch (error: any) {
    return next(new CustomError(error?.message));
  }
};

const UploadAudioFile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const file = req.file;
    if (!file?.path) {
      return next(new CustomError('Please Provide the file Path', 400));
    }

    //  Check Name :-

    const isNameExist = await File.findOne({
      where: {
        filename: file.originalname,
      },
    });

    console.log(isNameExist);

    if (isNameExist) {
      console.log('Hitting here');
      return next(new CustomError('File With this name already exist', 400));
    }

    console.log('IS Here ', file.path);

    const publicDir = path.join(__dirname, '..', 'public', 'uploads'); // Adjust path as needed
    console.log(publicDir);
    if (!fs.existsSync(publicDir)) {
      fs.mkdirSync(publicDir, { recursive: true });
    }

    const targetPath = path.join(publicDir, file?.filename);

    //   Move the file from current multer uploaded path to the public directory path :-
    fs.rename(file.path, targetPath, async (err) => {
      if (err) {
        return next(new CustomError(err?.message, 400));
      }

      const fileUrl = `/uploads/${file.filename}`;

      //   API Call For Storing in DB :-
      const uploadedFile = await File.create({
        filename: file.originalname,
        fileUrl: fileUrl,
      });

      if (!uploadedFile) {
        return next(new CustomError('File Could not uploaded', 400));
      }

      response.success({
        res,
        code: 200,
        data: {
          success: true,
          message: 'Your file uploaded successfully',
        },
        error: false,
      });
    });
  } catch (error: any) {
    return next(new CustomError(error?.message));
  }
};

const getAllAudio = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const allAudios = await File.findAll();

    if (!allAudios) {
      return next(new CustomError('Audios could not fetch', 400));
    }

    return response.success({
      res,
      code: 200,
      data: {
        success: true,
        message: 'All Audio Files',
        allAudios: allAudios,
      },
      error: false,
    });
  } catch (error: any) {
    return next(new CustomError(error?.message));
  }
};

const renameFileById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { audioFileId } = req.params;

    let { newName } = req.body;

    if (!newName) {
      return next(new CustomError('Please Provide the new Name for File', 400));
    }

    if (!audioFileId) {
      return next(new CustomError('File Id is not Provide', 400));
    }

    // console.log("Name and Id " , )

    const audioFile: any = (await File.findByPk(audioFileId))?.dataValues;

    console.log('Audio File ', audioFile);
    if (!audioFile) {
      return next(new CustomError('File with Id not found', 404));
    }

    if (!newName.endsWith('.mp3')) {
      newName += '.mp3';
    }

    const updatedAudioFile = await File.update(
      {
        filename: newName,
      },
      { where: { id: audioFileId } }
    );

    if (!updatedAudioFile) {
      return next(new CustomError('File Could not get Updated', 500));
    }

    return response.success({
      res,
      code: 200,
      data: {
        success: true,
        message: 'Audio Renamed Successfully',
        updatedAudioFile,
      },
      error: false,
    });
  } catch (error: any) {
    return next(new CustomError(error?.message));
  }
};

const deleteFileById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { audioFileId } = req.params;

    if (!audioFileId) {
      return next(new CustomError('File Id is not Provide', 400));
    }

    const fileToDelete: any = (await File.findByPk(audioFileId))?.dataValues;

    if (!fileToDelete) {
      return next(new CustomError('File to delete not found', 404));
    }

    console.log('Deleted File ', fileToDelete);

    const pathName = fileToDelete?.fileUrl;
    let fileName = path.basename(pathName);
    console.log('fileName ', fileName);
    const filePath = path.join(__dirname, '../public/uploads', fileName);

    fs.unlink(filePath, async (error) => {
      if (error) {
        return next(new CustomError(error.message, 500));
      }

      const deletedFile = await File.destroy({
        where: {
          id: audioFileId,
        },
      });

      if (!deletedFile) {
        return next(new CustomError('File Could not deleted', 400));
      }

      return response.success({
        res,
        code: 200,
        data: {
          success: true,
          message: 'Audio file Deleted Successfully',
          deletedFile,
        },
        error: false,
      });
    });
  } catch (error: any) {
    return next(new CustomError(error?.message));
  }
};

const deleteAllAudioFile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const allAudioFiles = await File.findAll();

    const uploadDir = path.join(__dirname, '../public/uploads');

    const filesToDelete = allAudioFiles.map((file: any) => ({
      filePath: path.join(uploadDir, path.basename(file.fileUrl)),
      fileId: file.id,
    }));

    const deleteOperations = filesToDelete.map(async ({ filePath, fileId }) => {
      try {
        await fs.promises.unlink(filePath);

        const isDeleted = await File.destroy({ where: { id: fileId } });
        if (!isDeleted) {
          throw new Error(
            `File with ID ${fileId} could not be deleted from the database`
          );
        }
      } catch (error: any) {
        throw new Error(`Error deleting file ${filePath}: ${error.message}`);
      }
    });

    console.log(deleteOperations, 'Delete Operation');
    await Promise.all(deleteOperations);

    return response.success({
      res,
      code: 200,
      data: {
        success: true,
        message: 'All Audio Files Deleted Successfully',
      },
      error: false,
    });
  } catch (error: any) {
    return next(new CustomError(error.message, 500));
  }
};

export {
  convertAudioToText,
  UploadAudioFile,
  getAllAudio,
  renameFileById,
  deleteFileById,
  deleteAllAudioFile,
  convertUploadedAudioFileToText
};
