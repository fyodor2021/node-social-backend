const { Storage } = require("@google-cloud/storage");
require("dotenv").config();
const projectId = process.env.PROJECT_ID;
const bucketName = process.env.BUCKET_NAME;
const keyFilename = process.env.KEY_FILE_NAME;
const Redis = require("redis");
const redisClient = Redis.createClient({
  password: process.env.REDIS_PWD,
  socket: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
  },
});
(async () => {
  await redisClient.connect();
  redisClient.on("error", (err) => console.log("Redis Client Error", err));
})();

const storage = new Storage({ projectId, keyFilename });
const getSignedURL = async (fileName) => {
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
const deleteImage = async (fileName) => {
  try {
    if (fileName) {
      await storage.bucket(bucketName).file(fileName).delete();
    }
  } catch (err) {
    console.log(err);
  }
};
module.exports = { getSignedURL, deleteImage };
