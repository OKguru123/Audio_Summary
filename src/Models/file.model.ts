import { DataTypes } from 'sequelize';
import { sequelize } from '../db/connectDB';

const File = sequelize.define('File', {

    filename : {
       type : DataTypes.STRING,
       allowNull : false
    },

    fileUrl : {
         type : DataTypes.STRING,
         allowNull : false
    },
    summariesText : {
       type : DataTypes.STRING,
       allowNull : true,
       defaultValue : ""
    }

} , {timestamps : true});


export {File}
// import { Model, DataTypes, Optional } from 'sequelize';
// import { sequelize } from '../db/connectDB'; // Update with your actual database import

// // Define attributes for the File model
// interface FileAttributes {
//   id: number;
//   filename: string;
//   filepath: string; // Optional, if you store the file path
//   duration?: number; // Optional, if you store the duration
//   createdAt?: Date;
//   updatedAt?: Date;
// }

// // Optional attributes for creating a new File instance
// interface FileCreationAttributes extends Optional<FileAttributes, 'id'> {}

// // Extend Sequelize's Model class
// class File extends Model<FileAttributes, FileCreationAttributes> implements FileAttributes {
//   public id!: number;
//   public filename!: string;
//   public filepath!: string;
//   public duration?: number;
//   public readonly createdAt!: Date;
//   public readonly updatedAt!: Date;
// }

// // Initialize the File model
// File.init(
//   {
//     id: {
//       type: DataTypes.INTEGER,
//       primaryKey: true,
//       autoIncrement: true,
//     },
//     filename: {
//       type: DataTypes.STRING,
//       allowNull: false,
//     },
//     filepath: {
//       type: DataTypes.STRING,
//       allowNull: false,
//     },
//     duration: {
//       type: DataTypes.FLOAT, // Assuming duration is stored in seconds
//       allowNull: true,
//     },
//   },
//   {
//     sequelize,
//     modelName: 'File',
//     tableName: 'files', // Update with your actual table name
//     timestamps: true,
//   }
// );

// export {File};
