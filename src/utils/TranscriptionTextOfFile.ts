import axios from "axios";
import FormData from "form-data";
import { logger } from "../helpers";
import { convertDataIntoStreams } from "./createFileStream";

export const getTranscriptionText = async (file: any) => {
  try {

     // Convert the audio file into stream file data :-
     const streamFileData = convertDataIntoStreams(file);
    const formData = new FormData();
    
    // Appending the file and model info to the form data
    formData.append("file", streamFileData);
    formData.append("model", "whisper-1");

    console.log(formData , "My FormData")

    // Sending the request to OpenAI API
    const response = await axios.post(
      `${process.env.OPENAI_END_POINT_TRANSCRIPTIONS}`, 
      formData, 
      {
        headers: {
          ...formData.getHeaders(),
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
      }
    );
    
    // Return the transcription result
    logger.info(response.headers['x-ratelimit-remaining']);
    logger.info(response.headers['x-ratelimit-reset']);
    return response.data;

  } catch (error: any) {
    // Log detailed error
   
    if (error.response) {
      // Log if error is from the response, e.g., 4xx or 5xx status code
      logger.error(`Error Response from OpenAI API: ${error.response.status} - ${JSON.stringify(error.response.data)}`);
    } else if (error.request) {
      // Log if error is related to request (e.g., network issues)
      logger.error(`Error Request: ${JSON.stringify(error.request)}`);
    } else {
      // Log other types of errors
      logger.error(`Error: ${JSON.stringify(error.message)}`);
    }
    
    // Optional: Re-throw the error or return a default response
    throw new Error('Failed to get transcription.');
  }
};
