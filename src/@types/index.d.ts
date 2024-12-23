import type { Request } from 'express';

declare global {
  namespace Express {
    interface Request {
      user?: unknown;
    }
  }
}


export interface FileSchema {
     filename : string,
     fileUrl : string,
     summariesText : string,
     createdAt : Date,
     updatedAt : Date
}

export interface DecodedJWTPayloadType {
     userId : string,
     username? : string,
     userEmail? : string
}