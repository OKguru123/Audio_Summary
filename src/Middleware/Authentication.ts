import { Request, NextFunction, Response } from 'express';
import { CustomError } from '../errors/error';
import jwt from 'jsonwebtoken';
import { generateAccessToken, userInfoType } from '../utils/GenerateToken';
// import { User } from "../Models/user.model";
import { DecodedJWTPayloadType } from '../@types';
