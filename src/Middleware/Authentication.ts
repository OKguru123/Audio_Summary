import {Request ,NextFunction, Response } from "express";
import { CustomError } from "../errors/error";
import jwt from "jsonwebtoken";
import { generateAccessToken, userInfoType } from "../utils/GenerateToken";
import { User } from "../Models/user.model";
import { DecodedJWTPayloadType } from "../@types";

// const isAuthentication = async (req : Request , res : Response , next : NextFunction) =>{
  
//     try { 
      
//        const accessToken = req.headers["authorization"]?.split(" ")[1];


//        if (!accessToken) {
//           return next (new CustomError("Please Provide the access Token" , 401))
//        }

//        try {
        
//         const decodedAccessToken   = jwt.verify(accessToken , process.env.ACCESS_TOKEN_SECRET!)
//         console.log(decodedAccessToken , "decoded Access Token")
//         return next();

//           // if (decodedAccessToken) {
              
//           //    req.user = await User.findByPk(decodedAccessToken?.userId);
//           //    return next();
//           // }
//        } catch (error : any) {
        
//           //  if (error.name == "TokenExpiredError")  {
            
//           //    const {refreshToken} = req.cookies()

//           //      if (!refreshToken) {
//           //          return next (new CustomError("Refresh Token Is not provided" , 401))
//           //      }

//           //      try {
                
//           //       //  Verify Refresh Token :-
//           //       const decodedRefreshToken = jwt.verify(refreshToken , process.env.REFRESH_TOKEN_SECRET!)
                
//           //       //  Generate new Access Token :-

//           //       const accessToken = generateAccessToken({userId : decodedRefreshToken?.userId} , process.env.ACCESS_TOKEN_SECRET!);

//           //       req.user = await User.findByPk(decodedRefreshToken?.userId);

//           //       res.setHeader("authorization" , accessToken)

//           //       return next();

                


//           //      } catch (error : any) {
                
//           //         if (error.name == "TokenExpiredError") {
                    
//           //             // That means refresh Token also get Expired :-
//           //             return next (new CustomError("Login is needed" , 401))

//           //         }
//           //         else {
//           //           return next (new CustomError("Invalid Refresh Token" , 401))
//           //         }
 
//           //      }

//           //  }

//           //  else {
//           //   return next (new CustomError("Invalid Access Token" , 401))
//           //  }

//        }



//     }
//     catch (error : any) {
//        return next (new CustomError(error?.message , 500))
//     }

// }

// export {isAuthentication}