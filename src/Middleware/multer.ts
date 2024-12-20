import multer from 'multer';
import path from 'path';



// Define storage options
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    
    console.log("file Name " , file.originalname , file.fieldname)
    cb(null, path.join(__dirname, '../..', 'temp'));
    
  },
  filename: (req, file, cb) => {
      console.log(file.fieldname , "My Path")
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});



const myUploader = multer({
  storage
})

export { myUploader };
