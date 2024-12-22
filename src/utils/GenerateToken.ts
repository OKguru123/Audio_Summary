import jwt from 'jsonwebtoken'


interface userInfoType  {
       username? : string,
       userEmail? : string,
       userId : string
}
const generateAccessToken = (userInfo : userInfoType , secret : string) =>{
    
     return jwt.sign(userInfo , secret , {
         expiresIn : "15min"
     })

}

const generateRefreshToken = (userInfo : userInfoType , secret : string) =>{
    
       return jwt.sign(userInfo , secret);

}

export {generateAccessToken , generateRefreshToken}