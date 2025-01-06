import { DataTypes } from 'sequelize';
import { sequelize } from '../../../db/connectDB';

const File = sequelize.define(
  'File',
  {
    filename: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    fileUrl: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    summariesText: {
      type: DataTypes.TEXT,
      allowNull: true,
      defaultValue: '',
    },
    transcript: {
      type: DataTypes.TEXT,
      allowNull: true,
      defaultValue: '',
    },
    speakers: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  },
  { timestamps: true }
);

export { File };
