import multer from 'multer';
import path from 'path';



// Define storage options
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // console.log('multer file ',file)
    
    
    cb(null, path.join(__dirname, '../..', 'temp'));
   
    
  },

  filename: (req, file, cb) => {
     
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    // console.log(uniqueSuffix+file.originalname, "multer uniqueSuffix name +" )
    cb(null, uniqueSuffix + path.extname(file.originalname));
    // console.log(uniqueSuffix+path.extname(file.originalname), "multer uniqueSuffix name + extrem" )
   
  },

} 

);



const myUploader = multer({
  storage
})

export { myUploader };
