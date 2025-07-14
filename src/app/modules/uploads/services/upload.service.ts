import { Injectable } from '@nestjs/common';
import { UploadApiErrorResponse, UploadApiOptions, UploadApiResponse, v2 } from 'cloudinary';
import * as streamifier from 'streamifier';
import { Multer } from 'multer';
@Injectable()
export class UploadService {
  async uploadImage(
    file: Express.Multer.File,
  ): Promise<UploadApiResponse | UploadApiErrorResponse> {
    return new Promise((resolve, reject) => {
      const upload = v2.uploader.upload_stream(
        {
          folder: 'avatars',
          resource_type: 'image',
          public_id: `avatar-${Date.now()}`,
          access_mode: 'public',
          type: 'upload',
          transformation: [
            { width: 500, height: 500, crop: 'limit' }
          ]
        },
        (error, result) => {
          if (error) return reject(error);
          if (!result) return reject(new Error("Upload result is undefined"));
          resolve(result);
        }
      );
      streamifier.createReadStream(file.buffer).pipe(upload);
    });
  }

  async uploadCV(
    file: Express.Multer.File
  ): Promise<UploadApiResponse | UploadApiErrorResponse> {
    return new Promise((resolve, reject) => {
      const upload = v2.uploader.upload_stream(
        {
          folder: 'pdfs',
          resource_type: 'auto',
          public_id: `cv-${Date.now()}`,
          access_mode: 'public',
          type: 'upload'
        },
        (error, result) => {
          if (error) return reject(error);
          if (!result) return reject(new Error("Upload result is undefined"));
          resolve(result);
        }
      );
      
      streamifier.createReadStream(file.buffer).pipe(upload);
    });
  }

  async uploadVideo(
    file: Express.Multer.File
  ): Promise<UploadApiResponse | UploadApiErrorResponse> {
    return new Promise((resolve, reject) => {
      const upload = v2.uploader.upload_stream(
        {
          folder: 'videos',
          resource_type: 'video',
          public_id: `video-${Date.now()}`,
          access_mode: 'public',
          type: 'upload',
          chunk_size: 20000000 // 20MB chunks
        },
        (error, result) => {
          if (error) return reject(error);
          if (!result) return reject(new Error("Upload result is undefined"));
          resolve(result);
        }
      );
      
      streamifier.createReadStream(file.buffer).pipe(upload);
    });
  }

  async uploadAvatar(
    file: Express.Multer.File
  ): Promise<UploadApiResponse | UploadApiErrorResponse> {
    return new Promise((resolve, reject) => {
      const upload = v2.uploader.upload_stream(
        {
          folder: 'avatars',
          resource_type: 'image',
          public_id: `avatar-${Date.now()}`,
          access_mode: 'public',
          type: 'upload',
          transformation: [
            { width: 300, height: 300, crop: 'fill', gravity: 'face' }
          ]
        },
        (error, result) => {
          if (error) return reject(error);
          if (!result) return reject(new Error("Upload result is undefined"));
          resolve(result);
        }
      );
      
      streamifier.createReadStream(file.buffer).pipe(upload);
    });
  }
}