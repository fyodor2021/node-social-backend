import { Storage } from "@google-cloud/storage";
import { redisWrapper } from "../redis-wrapper.js";
const projectId = process.env.PROJECT_ID;
const bucketName = process.env.BUCKET_NAME;
const keyFilename = process.env.KEY_FILE_NAME;

const storage = new Storage({ projectId, keyFilename });
export const getSignedURL = async (fileName) => {
  const redisClient = redisWrapper.client;
  if (fileName) {
    const savedUrl = await redisClient.get(fileName);
    if (savedUrl) {
      
      return savedUrl;
    } else {
      const date = Date.now() + (2 * 60 * 60 * 1000);
      const options = {
        action: "read",
        expires: date,
      };
      try {
        const [url] = await storage
          .bucket(bucketName)
          .file(fileName)
          .getSignedUrl(options);
        redisClient.setEx(fileName, 2 * 60 * 60, url);
        return url;
      } catch (err) {
        console.log(err);
      }
    }
  }
};
export const deleteImage = async (fileName) => {
  try {
    if (fileName) {
      await storage.bucket(bucketName).file(fileName).delete();
    }
  } catch (err) {
    console.log(err);
  }
};

