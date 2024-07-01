const fs = require('fs');
const jwt = require('jsonwebtoken');
const {s3} = require('./config/aws');
const {Permissions, UserPermissions} = require('./models');

const validate = (requiredFields, req) => {
  const errorMessagesArray = [];

  requiredFields.forEach(field => {
    if (!req.body[field]) {
      errorMessagesArray.push(`${field} is missing!`);
    }
  });

  if (errorMessagesArray.length) {
    return ({valid: false, errors: errorMessagesArray});
  }

  return ({valid: true, errors: null});
}

const generatePresignedUrl = objectKey => {
  const params = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: objectKey,
    Expires: 60 * 60 * 24 * 7 // 7 days expiration
  };

  return new Promise((resolve, reject) => {
    s3.getSignedUrl('getObject', params, (err, url) => {
      if (err) {
        reject(err);
      } else {
        resolve(url);
      }
    });
  });
}

const uploadToS3 = async (file, prefix, id) => {
  // Upload new file to S3
  const {mimetype, path } = file;
  const fileContent = fs.readFileSync(path);
  const params = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: `${prefix}/${id}.png`,
    Body: fileContent,
    ContentType: mimetype,
  };

  await s3.upload(params).promise();

  const signedUrl = generatePresignedUrl(params.Key);

  return signedUrl;
};

const checkUserPermission = async(PERMISSION_NAME, token) => {
  try {
    const verifiedToken = await jwt.verify(token, process.env.JWT_SECRET_KEY, {algorithms: ["HS256"]});
    const {id} = verifiedToken;

    if (!id) {
      console.error(`ERROR: Invalid token. ID is missing!`);

      return false;
    }
    
    const permission = await Permissions.findOne({where: {name: PERMISSION_NAME}});

    if (!permission) {
      console.error(`ERROR: Permission ${PERMISSION_NAME} does not exist!`);

      return false;
    }

    const userPermission = await UserPermissions.findOne({where: {userId: id, permissionId: permission.id}});

    return !!userPermission;
  } catch (err) {
    throw new Error('Permission check failed!', err);
  }
}

module.exports = {validate, uploadToS3, generatePresignedUrl, checkUserPermission};