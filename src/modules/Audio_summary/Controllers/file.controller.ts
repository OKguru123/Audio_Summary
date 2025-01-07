import { Request, Response, NextFunction } from 'express';
import { CustomError } from '../../../errors/error';
import response from '../../../helpers/response';
import path from 'path';
import fs from 'fs';
import { File } from '../Models/file.model';
import axios from 'axios';
import { Console } from 'console';

const convertAudioToText = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.file) {
      return next(
        new CustomError(
          'Please provide the audio file that was expected to be uploaded for transcription',
          400
        )
      );
    }

    const audioFilePath = req.file.path;
    if (!audioFilePath) {
      return next(
        new CustomError('File could not be uploaded successfully', 400)
      );
    }

    const absoluteFilePath = path.resolve(audioFilePath);

    const url = 'https://api.deepgram.com/v1/listen?summarize=v2';
    const apiKey = process.env.DEEP_GRAM_API_KEY;

    const headers = {
      Accept: 'application/json',
      Authorization: `Token ${apiKey}`,
      'Content-Type': 'audio/mpeg',
    };

    const response = await axios.post(
      url,
      fs.createReadStream(absoluteFilePath),
      {
        headers,
        params: {
          diarize: true,
        },
      }
    );

    const results = response.data.results.channels[0].alternatives[0];
    const words = results.words;

    if (response?.data?.results?.summary?.result != 'success') {
      return next(
        new CustomError('Could not compile the summary for the audio File', 500)
      );
    }

    const summary = response?.data?.results?.summary?.short;
    const uniqueSpeakers = new Set(words.map((word: any) => word.speaker));
    const numberOfSpeakers = uniqueSpeakers.size;

    res.json({
      success: true,
      message: 'Audio transcription and speaker identification successful',
      transcription: results.transcript,
      speakers: numberOfSpeakers,
      summary,
    });
  } catch (error: any) {
    console.error('Deepgram Error:', error.response?.data || error.message);
    return next(
      new CustomError(
        error.response?.data?.message ||
          error.message ||
          'Internal server error',
        500
      )
    );
  }
};

const summarizeOnClick = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { audioFileId } = req.params;

    if (!audioFileId) {
      return next(new CustomError('Please Provide the fileId', 400));
    }

    const audioFile = (await File.findByPk(audioFileId))?.dataValues;

    if (!audioFile) {
      return next(new CustomError('File with requested File not found', 404));
    }

    const fileBaseURL = path.basename(audioFile?.fileUrl);
    console.log(path.join(__dirname), 'current ditectory');

    const filePath = path.join(__dirname, '../public/uploads', fileBaseURL);
    console.log(filePath, 'file path');

    const url = 'https://api.deepgram.com/v1/listen?summarize=v2';
    const apiKey = process.env.DEEP_GRAM_API_KEY;

    const headers = {
      Accept: 'application/json',
      Authorization: `Token ${apiKey}`,
      'Content-Type': 'audio/mpeg',
    };

    const response = await axios.post(url, fs.createReadStream(filePath), {
      headers,
      params: {
        model: 'nova-2',
        smart_format: true,
        punctuate: true,
        diarize: true,
      },
    });

    const results = response?.data?.results?.channels[0]?.alternatives[0];

    const words = results?.words;

    if (response?.data?.results?.summary?.result != 'success') {
      return next(
        new CustomError('Could not compile the summary for the audio File', 500)
      );
    }

    const summary = response?.data?.results?.summary?.short;
    const uniqueSpeakers = new Set(words.map((word: any) => word?.speaker));
    const numberOfSpeakers = uniqueSpeakers.size;
    const transcriptText =
      response?.data?.results?.channels[0]?.alternatives[0]?.paragraphs
        .transcript;

    await File.update(
      {
        summariesText: summary,

        speakers: numberOfSpeakers,

        transcript: transcriptText,
      },
      {
        where: {
          id: audioFileId,
        },
      }
    );

    const updatedFile = await File.findByPk(audioFileId);
    res.json({
      success: true,
      message: 'Audio Summary & Speakers',
      updatedFile,
    });
  } catch (error: any) {
    console.error('Deepgram Error:', error.response?.data || error.message);
    return next(
      new CustomError(
        error.response?.data?.message ||
          error.message ||
          'Internal server error',
        500
      )
    );
  }
};

const UploadAudioFile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const file = req.file;

    const { fileName } = req.body;

    if (!file?.path || !fileName) {
      return next(new CustomError('Please Provide the file Path', 400));
    }
    const isNameExist = await File.findOne({
      where: {
        filename: fileName,
      },
    });

    if (isNameExist) {
      return next(new CustomError('File With this name already exist', 400));
    }

    const publicDir = path.join(__dirname, '..', 'public', 'uploads');

    if (!fs.existsSync(publicDir)) {
      fs.mkdirSync(publicDir, { recursive: true });
    }

    const targetPath = path.join(publicDir, file?.filename);

    fs.rename(file.path, targetPath, async (err) => {
      if (err) {
        return next(new CustomError(err?.message, 400));
      }

      const fileUrl = `/uploads/${file.filename}`;

      const uploadedFile = await File.create({
        filename: fileName,
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

    const audioFile: any = (await File.findByPk(audioFileId))?.dataValues;

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

    const pathName = fileToDelete?.fileUrl;
    let fileName = path.basename(pathName);
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

const deleteMultipleAudioFiles = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { fileIds } = req.body;
    if (!Array.isArray(fileIds) || fileIds.length === 0) {
      throw new Error('No file IDs provided.');
    }

    const audioFiles = await File.findAll({
      where: { id: fileIds },
    });

    if (audioFiles.length === 0) {
      throw new Error('No matching audio files found for the given IDs.');
    }

    const uploadDir = path.join(__dirname, '../public/uploads');

    const filesToDelete = audioFiles.map((file: any) => ({
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

    await Promise.all(deleteOperations);

    return res.status(200).json({
      success: true,
      message: 'Selected files deleted successfully Done.',
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
  summarizeOnClick,
  deleteMultipleAudioFiles,
};
