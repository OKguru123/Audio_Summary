import { Request, Response, NextFunction } from 'express';
import { CustomError } from '../errors/error';
import response, { CustomResponse } from '../helpers/response';

const convertAudioToText = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.file) {
      next(new CustomError('Please Provide the audio File', 400));
    }

    const audioFilePath = req.file?.path;

    return response.success({
      res,
      code: 200,
      data: audioFilePath,
      message: 'File Uploaded SuccessFully',
      error: false,
    });
  } catch (error) {
    next(new CustomError('Internal Server Error', 500));
  }
};

export { convertAudioToText };
