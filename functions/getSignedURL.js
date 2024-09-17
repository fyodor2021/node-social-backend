const { Storage } = require("@google-cloud/storage");
require("dotenv").config();
const projectId = process.env.PROJECT_ID;
const bucketName = process.env.BUCKET_NAME;
const keyFilename = process.env.KEY_FILE_NAME;

const storage = new Storage({ projectId, keyFilename });
const getSignedURL = async (fileName) => {
  if (fileName) {
    const options = {
      action: "read",
      expires: Date.now() + 15 * 60 * 10000,
    };
    const [url] = await storage
      .bucket(bucketName)
      .file(fileName)
      .getSignedUrl(options);
    return url;
  }
};
module.exports = getSignedURL;
