import { DataTypes } from "sequelize";
import { sequelize } from "../db/connectDB";

const User = sequelize.define("User" , {
    
      username : {
          type : DataTypes.STRING,
          allowNull : true
      },
      userEmail : {
          type : DataTypes.STRING,
          allowNull : false
      },
      userPassword : {
          type : DataTypes.STRING,
          allowNull : true
      },
      refresh_token : {
          type : DataTypes.STRING,
          allowNull : true
      },
      refresh_token_expiry : {
          type : DataTypes.DATE,
          defaultValue : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          allowNull : true
      },
      otp : {
          type : DataTypes.STRING,
          allowNull : true
      },
      otp_expiry : {
          type : DataTypes.DATE,
          allowNull : true
      }

} , { timestamps : true})

export {User}