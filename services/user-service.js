const fs = require('fs');
const {User} = require('../models');
const {uploadToS3, generatePresignedUrl} = require('./../helpers');
const {s3} = require('../config/aws');

class UserService {
  async getUsers() {
    try {
      const users = await User.findAll();

      return users.map(user => {
        const {applicationId, avatar, email, firstName, lastName, id, socialMedia = {facebook: user.facebook, instagram: user.instagram, linkedIn: user.linkedIn}} = user;

        return {
          applicationId,
          avatar,
          email,
          firstName,
          lastName,
          id,
          socialMedia
        };
      });
    } catch (err) {
      throw new Error(err.message);
    }
  }

  async getUser(id) {
    try {
      const [user] = await User.findAll({where: {id}});

      if (!user) {
        throw ({message: 'User does not exist!'});
      }

      return user;
    } catch (err) {
      throw new Error(err.message);
    }
  }

  async updateUser(id, data, avatarFile) {
    try {
      let avatar = null;
      const user = await User.findByPk(id);

      if (!user) {
        throw ({ message: 'User does not exist!' });
      }

      // Delete previous file from S3 bucket
      let oldFileKey = null;

      if (avatarFile && user.avatar) {
        oldFileKey = user.avatar.split('/').slice(-2).join('/');
    
        if (oldFileKey) {
          const deleteParams = {
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: oldFileKey
          };

          await s3.deleteObject(deleteParams).promise();
        }
      }

      // Handle avatar file upload
      if (avatarFile) {
        avatar = await uploadToS3(avatarFile, 'avatars', id);

        fs.unlinkSync(avatarFile.path); // Clean up temporary file

        await user.update({...data, avatar});

        return user;
      }
  
      await user.update({...data});

      return user;
    } catch (err) {
      throw new Error(err.message);
    }
  }

  async deleteUser(id) {
    try {
      const [user] = await User.findAll({ where: { id }});

      if (!user) {
        throw ({message: 'User does not exist!'});
      }

      await User.destroy({ where: { id }});

      return user;
    } catch (err) {
      throw new Error(err.message);
    }
  }

  async updateAvatarUrls() {
    try {
      const records = await User.findAll({attributes: ['id', 'avatar', 'firstName', 'lastName']});

      if (!records) {
        throw ({message: 'There are no avatars!'});
      }

      records.forEach(async(record) => {
        try {
          if (!record.avatar) {
            console.warn(`WARNING: User ${record.firstName} ${record.lastName} does not have an avatar`);

            return;
          }

          if (!record.avatar.includes("avatars/")) {
            console.warn('WARNING: Invalid user avatar URL');

            return;
          }

          // Extract the object key from s3Upload.Location
          const objectKey = record.avatar.substring(record.avatar.indexOf("avatars/"));
          const avatarKey = objectKey.substring(0, objectKey.indexOf('%'));
          const clearAvatarKey = avatarKey.includes('?') ? avatarKey.substring(0, avatarKey.indexOf('?')) : avatarKey;
    
          // Generate a new pre-signed URL
          const url = await generatePresignedUrl(clearAvatarKey);
    
          // Update the record in your database with the new pre-signed URL
          User.update({avatar: url}, {where: {id: record.id}});
        } catch (err) {
          console.error('Error generating URL for object', record.avatar, err);
        }
      });
    } catch (err) {
      throw new Error(err.message);
    }
  }
}

module.exports = new UserService();