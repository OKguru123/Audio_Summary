import { v2 as cloudinary } from "cloudinary";

//  Configuration of Cloudinary :-
(() =>{
     cloudinary.config({
     cloud_name : process.env.CLOUDINARY_CLOUD_NAME,
     api_key : process.env.CLOUDINARY_API_KEY,
     api_secret : process.env.CLOUDINARY_API_SECRET
   })
})()


//  Function for Uploading the file on cloudinary :-
export const uploadToCloudinary = async(filePath : string) =>{
  
      try {
         
          const response = await cloudinary.uploader.upload(filePath , {
              resource_type : "video"
          })

          if (!response.public_id) {
               return null;
          }

          return response;

      } catch (error : any) {
           throw new Error(error)
      }


}

// Function for deleting the resource from cloudinary :-
export const deleteFromCloudinary = async (publicId : string) =>{
  
     try {
         const responseOfDeletion = await cloudinary.uploader.destroy(publicId , {
               resource_type : "video"
            } , (err , res) =>{
                if (err) {
                    throw new Error (err)
                }

                return res;
            })

            return responseOfDeletion;
     }
     catch(error : any) {
         throw new Error (error)
     }

}