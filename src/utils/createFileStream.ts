import fs from 'fs';

export const convertDataIntoStreams = (filePath: string) => {
  return fs.createReadStream(filePath);
};